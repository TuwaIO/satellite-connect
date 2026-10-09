/**
 * @file Message signer for Solana wallets: Wallet Standard `solana:signMessage` or `solana:signOffchainMessage`, with
 * fallbacks for wallet adapters.
 */

import {
  address as toAddress,
  compileOffchainMessageV1Envelope,
  getAddressEncoder,
  getBase58Decoder,
  getUtf8Encoder,
} from '@solana/kit';

/**
 * How {@link createSolanaMessageSigner} has the wallet sign:
 *
 * - `'auto'` (default): the UTF-8 bytes of the message, or its version 1 off-chain message when the account lists
 *   `solana:signOffchainMessage` but not `solana:signMessage` (as hardware wallet accounts may), or when the wallet
 *   has no other way to sign;
 * - `'message'`: always the UTF-8 bytes;
 * - `'offchainMessage'`: always the version 1 off-chain message (`solana:signOffchainMessage` or a
 *   `signOffchainMessage(message)` method).
 *
 * `@tuwaio/siwx-solana` and `@tuwaio/siwx-server` accept both for SIWX.
 */
export type SolanaMessageFormat = 'auto' | 'message' | 'offchainMessage';

/**
 * Options of {@link createSolanaMessageSigner}.
 */
export interface SolanaMessageSignerOptions {
  /** How the wallet signs. Defaults to `'auto'`; see {@link SolanaMessageFormat}. */
  messageFormat?: SolanaMessageFormat;
}

type OffchainMessageOutput = { signature: Uint8Array; signedOffchainMessage?: Uint8Array };

type OffchainMessageFeature = {
  supportedMessageVersions?: readonly number[];
  signOffchainMessage: (
    ...inputs: readonly {
      account: unknown;
      message: string;
      messageVersion: 1;
      requiredSigners: readonly Uint8Array[];
    }[]
  ) => Promise<readonly OffchainMessageOutput[]>;
};

/**
 * Finds how the target signs version 1 off-chain messages, or why it cannot: the `solana:signOffchainMessage` feature
 * of the wallet, or a `signOffchainMessage(message)` method of the wallet, the account or the target.
 */
function findOffchainMessageSigner(
  target: SolanaSignerTarget,
  wallet: Record<string, unknown>,
  account: Record<string, unknown>,
): { sign: (message: string) => Promise<OffchainMessageOutput> } | { error: string } | undefined {
  const walletFeatures = (wallet as { features?: unknown })?.features;
  const feature =
    walletFeatures && typeof walletFeatures === 'object' && !Array.isArray(walletFeatures)
      ? ((walletFeatures as Record<string, unknown>)['solana:signOffchainMessage'] as
          OffchainMessageFeature | undefined)
      : undefined;
  if (feature && typeof feature.signOffchainMessage === 'function') {
    if (!feature.supportedMessageVersions?.includes(1)) {
      return { error: '[SATELLITE-SOLANA] The wallet cannot sign version 1 off-chain messages.' };
    }
    return {
      sign: async (message) => {
        const publicKey = (account as { publicKey?: unknown }).publicKey;
        const outputs = await feature.signOffchainMessage({
          account,
          message,
          messageVersion: 1,
          requiredSigners: [
            publicKey instanceof Uint8Array
              ? publicKey
              : new Uint8Array(
                  getAddressEncoder().encode(toAddress(String((account as { address?: unknown }).address))),
                ),
          ],
        });
        return outputs[0];
      },
    };
  }
  const owner = [wallet, account, target].find(
    (candidate) => typeof (candidate as { signOffchainMessage?: unknown })?.signOffchainMessage === 'function',
  ) as { signOffchainMessage: (message: string) => Promise<OffchainMessageOutput> } | undefined;
  return owner ? { sign: (message) => owner.signOffchainMessage(message) } : undefined;
}

/**
 * Signs `message` as a version 1 off-chain message and returns the base58 signature. When the wallet returns the
 * bytes it signed and the account address is known, checks that they are the envelope of `message`.
 */
async function signOffchainMessage(
  signer: NonNullable<ReturnType<typeof findOffchainMessageSigner>>,
  message: string,
  address: unknown,
): Promise<string> {
  if ('error' in signer) throw new Error(signer.error);
  const output = await signer.sign(message);
  if (!output?.signature) {
    throw new Error('[SATELLITE-SOLANA] Wallet returned invalid signOffchainMessage output.');
  }
  if (output.signedOffchainMessage && typeof address === 'string') {
    const expected = compileOffchainMessageV1Envelope({
      version: 1,
      content: message,
      requiredSignatories: [{ address: toAddress(address) }],
    }).content;
    const signed = output.signedOffchainMessage;
    if (signed.length !== expected.length || signed.some((byte, index) => byte !== expected[index])) {
      throw new Error('[SATELLITE-SOLANA] Wallet signed a different off-chain message than requested.');
    }
  }
  return getBase58Decoder().decode(output.signature);
}

/**
 * Tells whether the account lists `feature`. Accounts that list no features support all of the wallet's.
 */
function accountSupports(account: Record<string, unknown>, feature: string): boolean {
  const features = (account as { features?: unknown })?.features;
  return !Array.isArray(features) || features.includes(feature);
}

/**
 * The wallet and account that {@link createSolanaMessageSigner} signs with. Pass the Wallet Standard `Wallet` and
 * `WalletAccount` (see {@link unwrapUiWalletHandles}) or a wallet adapter. When `wallet` or `account` is missing, the
 * target object itself is used in its place.
 */
export interface SolanaSignerTarget {
  /** The account to sign with, passed to the wallet's `signMessage`. */
  account?: unknown;
  /** The wallet that implements `solana:signMessage`, `signMessages` or `signMessage`. */
  wallet?: unknown;
  /** Any other property; the target may be a wallet adapter itself. */
  [key: string]: unknown;
}

/**
 * Creates a function that signs UTF-8 messages with a Solana wallet and returns base58 signatures. The adapter and the
 * watcher use it as `signMessage` of a Solana connection.
 *
 * The signer uses the first capability it finds: the Wallet Standard `solana:signMessage` feature of the wallet (or
 * of the account), a `signMessages` function, then a legacy `signMessage` function of the wallet, its `adapter` or the
 * account. Accounts that list `solana:signOffchainMessage` but not `solana:signMessage` (hardware wallet accounts may)
 * sign the version 1 off-chain message of the text instead; `options.messageFormat` changes the choice
 * ({@link SolanaMessageFormat}). The wallet may show a prompt.
 *
 * @param target - The wallet and account to sign with.
 * @param options - `messageFormat`: `'auto'` (default), `'message'` or `'offchainMessage'`.
 * @returns A function that signs `message` and resolves to the base58-encoded signature. It rejects with
 * `[SATELLITE-SOLANA] Invalid signer target.` when `target` is missing,
 * `[SATELLITE-SOLANA] Signer lacks known message signing capabilities.` when no capability is found, an
 * `... invalid signMessage output.`, `... invalid signMessages output.` or `... invalid signOffchainMessage output.`
 * error when the wallet returns no signature, `... cannot sign version 1 off-chain messages.` or
 * `... signed a different off-chain message than requested.` for off-chain messages, and with the wallet's error when
 * the user rejects.
 */
export function createSolanaMessageSigner(
  target: SolanaSignerTarget,
  options: SolanaMessageSignerOptions = {},
): (message: string) => Promise<string> {
  const messageFormat = options.messageFormat ?? 'auto';
  return async (message: string): Promise<string> => {
    if (!target) {
      throw new Error('[SATELLITE-SOLANA] Invalid signer target.');
    }

    const wallet = (target.wallet ?? target) as Record<string, unknown>;
    const account = (target.account ?? target) as Record<string, unknown>;

    const offchainSigner = messageFormat === 'message' ? undefined : findOffchainMessageSigner(target, wallet, account);
    const accountAddress = (account as { address?: unknown })?.address;
    if (messageFormat === 'offchainMessage') {
      if (!offchainSigner) throw new Error('[SATELLITE-SOLANA] Signer cannot sign off-chain messages.');
      return signOffchainMessage(offchainSigner, message, accountAddress);
    }
    if (
      offchainSigner &&
      'sign' in offchainSigner &&
      !accountSupports(account, 'solana:signMessage') &&
      accountSupports(account, 'solana:signOffchainMessage')
    ) {
      return signOffchainMessage(offchainSigner, message, accountAddress);
    }

    const messageBytes = new Uint8Array(getUtf8Encoder().encode(message));

    // 1. Check Wallet Standard 'solana:signMessage' feature
    const accountFeatures = (account as { features?: unknown })?.features;
    const walletFeatures = (wallet as { features?: unknown })?.features;
    let signMessageFeature:
      | {
          signMessage: (
            ...inputs: readonly { account: unknown; message: Uint8Array }[]
          ) => Promise<readonly { signature: Uint8Array }[]>;
        }
      | undefined;

    if (walletFeatures && typeof walletFeatures === 'object' && !Array.isArray(walletFeatures)) {
      signMessageFeature = (walletFeatures as Record<string, unknown>)[
        'solana:signMessage'
      ] as typeof signMessageFeature;
    } else if (accountFeatures && typeof accountFeatures === 'object' && !Array.isArray(accountFeatures)) {
      signMessageFeature = (accountFeatures as Record<string, unknown>)[
        'solana:signMessage'
      ] as typeof signMessageFeature;
    }

    if (signMessageFeature?.signMessage) {
      const outputs = await signMessageFeature.signMessage({ account, message: messageBytes });
      const output = outputs[0];
      if (!output || !output.signature) {
        throw new Error('[SATELLITE-SOLANA] Wallet returned invalid signMessage output.');
      }
      return getBase58Decoder().decode(output.signature);
    }

    // 2. Direct signMessages / signMessage fallback (standard adapters)
    const signMessages =
      (wallet as { signMessages?: unknown })?.signMessages ?? (account as { signMessages?: unknown })?.signMessages;
    if (typeof signMessages === 'function') {
      const outputs = await (
        signMessages as (
          inputs: readonly { account: unknown; message: Uint8Array }[],
        ) => Promise<readonly { signature: Uint8Array }[]>
      )([{ account, message: messageBytes }]);
      const output = outputs[0];
      if (!output || !output.signature) {
        throw new Error('[SATELLITE-SOLANA] Wallet returned invalid signMessages output.');
      }
      return getBase58Decoder().decode(output.signature);
    }

    const adapter = (wallet as { adapter?: unknown })?.adapter ?? (account as { adapter?: unknown })?.adapter;
    const legacySignMessage =
      (wallet as { signMessage?: unknown })?.signMessage ??
      (adapter as { signMessage?: unknown })?.signMessage ??
      (account as { signMessage?: unknown })?.signMessage;

    if (typeof legacySignMessage === 'function') {
      const result = await (legacySignMessage as (content: Uint8Array) => Promise<unknown>).call(
        adapter ?? wallet ?? account,
        messageBytes,
      );
      if (result instanceof Uint8Array) {
        return getBase58Decoder().decode(result);
      }
      if (
        result &&
        typeof result === 'object' &&
        'signature' in result &&
        (result as { signature: Uint8Array }).signature instanceof Uint8Array
      ) {
        return getBase58Decoder().decode((result as { signature: Uint8Array }).signature);
      }
    }

    if (offchainSigner && 'sign' in offchainSigner) {
      return signOffchainMessage(offchainSigner, message, accountAddress);
    }

    throw new Error('[SATELLITE-SOLANA] Signer lacks known message signing capabilities.');
  };
}
