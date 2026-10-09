import {
  address,
  compileOffchainMessageV1Envelope,
  getBase58Decoder,
  getBase58Encoder,
  getUtf8Encoder,
} from '@solana/kit';
import { describe, expect, it, vi } from 'vitest';

import { createSolanaMessageSigner } from './signerUtils';

describe('createSolanaMessageSigner', () => {
  it('signs message using Wallet Standard solana:signMessage feature on wallet', async () => {
    const mockSig = new Uint8Array([1, 2, 3, 4]);
    const mockSignMessage = vi.fn().mockResolvedValue([{ signature: mockSig }]);

    const wallet = {
      features: {
        'solana:signMessage': {
          signMessage: mockSignMessage,
        },
      },
    };
    const account = { address: 'mock-account' };

    const signer = createSolanaMessageSigner({ wallet, account });
    const result = await signer('Hello Solana');

    expect(mockSignMessage).toHaveBeenCalledWith({
      account,
      message: getUtf8Encoder().encode('Hello Solana'),
    });
    expect(result).toBe(getBase58Decoder().decode(mockSig));
  });

  it('signs message using Wallet Standard solana:signMessage feature on account', async () => {
    const mockSig = new Uint8Array([5, 6, 7, 8]);
    const mockSignMessage = vi.fn().mockResolvedValue([{ signature: mockSig }]);

    const wallet = {};
    const account = {
      address: 'mock-account',
      features: {
        'solana:signMessage': {
          signMessage: mockSignMessage,
        },
      },
    };

    const signer = createSolanaMessageSigner({ wallet, account });
    const result = await signer('Test Message');

    expect(result).toBe(getBase58Decoder().decode(mockSig));
  });

  it('falls back to wallet.signMessages if feature not present', async () => {
    const mockSig = new Uint8Array([9, 10, 11, 12]);
    const mockSignMessages = vi.fn().mockResolvedValue([{ signature: mockSig }]);

    const wallet = { signMessages: mockSignMessages };
    const account = { address: 'mock-account' };

    const signer = createSolanaMessageSigner({ wallet, account });
    const result = await signer('Fallback');

    expect(result).toBe(getBase58Decoder().decode(mockSig));
  });

  it('falls back to legacy signMessage adapter if provided', async () => {
    const mockSig = new Uint8Array([13, 14, 15, 16]);
    const mockLegacy = vi.fn().mockResolvedValue(mockSig);

    const wallet = { signMessage: mockLegacy };

    const signer = createSolanaMessageSigner({ wallet });
    const result = await signer('Legacy');

    expect(result).toBe(getBase58Decoder().decode(mockSig));
  });

  it('throws descriptive error if target lacks signing capability', async () => {
    const signer = createSolanaMessageSigner({ wallet: {}, account: {} });
    await expect(signer('Fail')).rejects.toThrow('[SATELLITE-SOLANA] Signer lacks known message signing capabilities.');
  });
});

describe('createSolanaMessageSigner with off-chain messages', () => {
  async function createAccount() {
    const keyPair = (await globalThis.crypto.subtle.generateKey('Ed25519', true, ['sign', 'verify'])) as CryptoKeyPair;
    const publicKey = new Uint8Array(await globalThis.crypto.subtle.exportKey('raw', keyPair.publicKey));
    return { keyPair, publicKey, address: getBase58Decoder().decode(publicKey) };
  }

  function envelopeOf(signer: string, content: string): Uint8Array<ArrayBuffer> {
    return new Uint8Array(
      compileOffchainMessageV1Envelope({ version: 1, content, requiredSignatories: [{ address: address(signer) }] })
        .content,
    );
  }

  async function verifies(publicKey: Uint8Array, signature: string, data: Uint8Array<ArrayBuffer>) {
    const key = await globalThis.crypto.subtle.importKey('raw', new Uint8Array(publicKey), 'Ed25519', false, [
      'verify',
    ]);
    return globalThis.crypto.subtle.verify('Ed25519', key, new Uint8Array(getBase58Encoder().encode(signature)), data);
  }

  function walletWith(
    account: Awaited<ReturnType<typeof createAccount>>,
    accountFeatures: string[],
    supportedMessageVersions: number[] = [1],
  ) {
    const walletAccount = { address: account.address, publicKey: account.publicKey, features: accountFeatures };
    const signOffchainMessage = vi.fn(async (input: { message: string }) => {
      const signedOffchainMessage = envelopeOf(account.address, input.message);
      const signature = new Uint8Array(
        await globalThis.crypto.subtle.sign('Ed25519', account.keyPair.privateKey, signedOffchainMessage),
      );
      return [{ signedOffchainMessage, signature }];
    });
    const signMessage = vi.fn(async (input: { message: Uint8Array }) => [
      {
        signature: new Uint8Array(
          await globalThis.crypto.subtle.sign('Ed25519', account.keyPair.privateKey, new Uint8Array(input.message)),
        ),
      },
    ]);
    const wallet = {
      features: {
        'solana:signMessage': { version: '1.0.0', signMessage },
        'solana:signOffchainMessage': { version: '1.0.0', supportedMessageVersions, signOffchainMessage },
      },
    };
    return { wallet, account: walletAccount, signMessage, signOffchainMessage };
  }

  it('signs the off-chain message when the account cannot sign plain messages', async () => {
    const account = await createAccount();
    const target = walletWith(account, ['solana:signOffchainMessage']);

    const signature = await createSolanaMessageSigner({ wallet: target.wallet, account: target.account })('Hello');

    expect(target.signMessage).not.toHaveBeenCalled();
    expect(target.signOffchainMessage).toHaveBeenCalledWith({
      account: target.account,
      message: 'Hello',
      messageVersion: 1,
      requiredSigners: [account.publicKey],
    });
    expect(await verifies(account.publicKey, signature, envelopeOf(account.address, 'Hello'))).toBe(true);
  });

  it('keeps solana:signMessage when the account supports it', async () => {
    const account = await createAccount();
    const target = walletWith(account, ['solana:signMessage', 'solana:signOffchainMessage']);

    const signature = await createSolanaMessageSigner({ wallet: target.wallet, account: target.account })('Hello');

    expect(target.signMessage).toHaveBeenCalled();
    expect(target.signOffchainMessage).not.toHaveBeenCalled();
    expect(await verifies(account.publicKey, signature, new Uint8Array(getUtf8Encoder().encode('Hello')))).toBe(true);
  });

  it('signs the off-chain message when messageFormat is offchainMessage', async () => {
    const account = await createAccount();
    const target = walletWith(account, ['solana:signMessage', 'solana:signOffchainMessage']);

    await createSolanaMessageSigner(
      { wallet: target.wallet, account: target.account },
      { messageFormat: 'offchainMessage' },
    )('Hello');

    expect(target.signOffchainMessage).toHaveBeenCalled();
    expect(target.signMessage).not.toHaveBeenCalled();
  });

  it('rejects when the wallet signed a different off-chain message', async () => {
    const account = await createAccount();
    const target = walletWith(account, ['solana:signOffchainMessage']);
    target.signOffchainMessage.mockImplementation(async () => [
      { signedOffchainMessage: envelopeOf(account.address, 'Other'), signature: new Uint8Array(64) },
    ]);

    await expect(
      createSolanaMessageSigner({ wallet: target.wallet, account: target.account })('Hello'),
    ).rejects.toThrow('different off-chain message');
  });

  it('rejects when the wallet cannot sign version 1 off-chain messages', async () => {
    const account = await createAccount();
    const target = walletWith(account, ['solana:signOffchainMessage'], []);

    await expect(
      createSolanaMessageSigner(
        { wallet: target.wallet, account: target.account },
        { messageFormat: 'offchainMessage' },
      )('Hello'),
    ).rejects.toThrow('version 1 off-chain messages');
  });
});
