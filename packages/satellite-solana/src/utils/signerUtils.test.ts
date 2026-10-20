import {
  address,
  compileOffchainMessageV1Envelope,
  getBase58Decoder,
  getBase58Encoder,
  getUtf8Encoder,
} from '@solana/kit';
import { describe, expect, it, vi } from 'vitest';

import { createSolanaMessageSigner } from './signerUtils';

// The capabilities and formats are tested with the shared signer in @tuwaio/orbit-solana; these tests cover what
// Satellite Connect adds or relies on.
describe('createSolanaMessageSigner', () => {
  it('signs with the solana:signMessage feature of the wallet or of the account', async () => {
    const signature = new Uint8Array([1, 2, 3, 4]);
    const signMessage = vi.fn().mockResolvedValue([{ signature }]);
    const account = { address: 'mock-account' };

    expect(
      await createSolanaMessageSigner({ wallet: { features: { 'solana:signMessage': { signMessage } } }, account })(
        'Hello Solana',
      ),
    ).toBe(getBase58Decoder().decode(signature));
    expect(signMessage).toHaveBeenCalledWith({ account, message: getUtf8Encoder().encode('Hello Solana') });

    const onAccount = { address: 'mock-account', features: { 'solana:signMessage': { signMessage } } };
    expect(await createSolanaMessageSigner({ wallet: {}, account: onAccount })('Test')).toBe(
      getBase58Decoder().decode(signature),
    );
  });

  it('calls the methods of a wallet adapter class on the adapter', async () => {
    const signature = new Uint8Array([9, 10, 11, 12]);
    class Adapter {
      readonly signature = signature;
      async signMessages(this: Adapter) {
        return [{ signature: this.signature }];
      }
    }

    expect(await createSolanaMessageSigner({ wallet: new Adapter() })('Fallback')).toBe(
      getBase58Decoder().decode(signature),
    );
  });

  it('keeps the [SATELLITE-SOLANA] prefix of its errors', async () => {
    await expect(createSolanaMessageSigner(null as never)('Fail')).rejects.toThrow(
      '[SATELLITE-SOLANA] Invalid signer target.',
    );
    await expect(createSolanaMessageSigner({ wallet: {}, account: {} })('Fail')).rejects.toThrow(
      '[SATELLITE-SOLANA] Signer lacks known message signing capabilities.',
    );
    await expect(
      createSolanaMessageSigner({ wallet: null, account: null, publicKey: null, signMessage: undefined })('Hello'),
    ).rejects.toThrow('[SATELLITE-SOLANA] Signer lacks known message signing capabilities.');
  });

  it('rejects a legacy signMessage that returns neither bytes nor { signature }', async () => {
    const signMessage = vi.fn().mockResolvedValue('not bytes') as unknown as (
      message: Uint8Array,
    ) => Promise<Uint8Array>;

    await expect(createSolanaMessageSigner({ signMessage })('Hello')).rejects.toThrow(
      '[SATELLITE-SOLANA] Unexpected legacy signMessage result format.',
    );
  });
});

describe('createSolanaMessageSigner with off-chain messages', () => {
  async function createAccount() {
    const keyPair = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
    const publicKey = new Uint8Array(await globalThis.crypto.subtle.exportKey('raw', keyPair.publicKey));
    return { keyPair, publicKey, address: getBase58Decoder().decode(publicKey) };
  }

  type Account = Awaited<ReturnType<typeof createAccount>>;

  function envelopeOf(signer: string, content: string): Uint8Array<ArrayBuffer> {
    return new Uint8Array(
      compileOffchainMessageV1Envelope({ version: 1, content, requiredSignatories: [{ address: address(signer) }] })
        .content,
    );
  }

  async function signEnvelope(account: Account, content: string) {
    const signedOffchainMessage = envelopeOf(account.address, content);
    const signature = new Uint8Array(
      await globalThis.crypto.subtle.sign('Ed25519', account.keyPair.privateKey, signedOffchainMessage),
    );
    return { signedOffchainMessage, signature };
  }

  async function verifies(publicKey: Uint8Array, signature: string, data: Uint8Array<ArrayBuffer>) {
    const key = await globalThis.crypto.subtle.importKey('raw', new Uint8Array(publicKey), 'Ed25519', false, [
      'verify',
    ]);
    return globalThis.crypto.subtle.verify('Ed25519', key, new Uint8Array(getBase58Encoder().encode(signature)), data);
  }

  it('signs the off-chain message when the account cannot sign plain messages', async () => {
    const account = await createAccount();
    const walletAccount = {
      address: account.address,
      publicKey: account.publicKey,
      features: ['solana:signOffchainMessage'],
    };
    const signOffchainMessage = vi.fn(async (input: { message: string }) => [
      await signEnvelope(account, input.message),
    ]);
    const signMessage = vi.fn();
    const wallet = {
      features: {
        'solana:signMessage': { version: '1.0.0', signMessage },
        'solana:signOffchainMessage': { version: '1.0.0', supportedMessageVersions: [1], signOffchainMessage },
      },
    };

    const signature = await createSolanaMessageSigner({ wallet, account: walletAccount })('Hello');

    expect(signMessage).not.toHaveBeenCalled();
    expect(await verifies(account.publicKey, signature, envelopeOf(account.address, 'Hello'))).toBe(true);
  });

  it('checks the off-chain message against the envelope, also when only publicKey names the signer', async () => {
    const account = await createAccount();
    const target = {
      wallet: null,
      publicKey: { toBase58: () => account.address },
      signOffchainMessage: vi.fn(() => signEnvelope(account, 'Other')),
    };

    await expect(createSolanaMessageSigner(target, { messageFormat: 'offchainMessage' })('Hello')).rejects.toThrow(
      '[SATELLITE-SOLANA] Wallet signed a different off-chain message than requested.',
    );
  });

  it('signs with useWallet() of @solana/wallet-adapter v3 and of @solana/wallet-adapter-react 0.15', async () => {
    const account = await createAccount();
    const signBytes = vi.fn(
      async (message: Uint8Array) =>
        new Uint8Array(
          await globalThis.crypto.subtle.sign('Ed25519', account.keyPair.privateKey, new Uint8Array(message)),
        ),
    );
    const v3 = {
      wallet: { adapter: { name: 'Phantom', icon: 'data:image/svg+xml;base64,', url: '', readyState: 'Installed' } },
      account: { address: account.address, publicKey: account.publicKey, chains: [], features: ['solana:signMessage'] },
      address: account.address,
      signMessage: signBytes,
    };
    const v1 = { wallet: null, publicKey: { toBase58: () => account.address }, signMessage: signBytes };
    const bytes = new Uint8Array(getUtf8Encoder().encode('Hello'));

    expect(await verifies(account.publicKey, await createSolanaMessageSigner(v3)('Hello'), bytes)).toBe(true);
    expect(await verifies(account.publicKey, await createSolanaMessageSigner(v1)('Hello'), bytes)).toBe(true);
  });
});
