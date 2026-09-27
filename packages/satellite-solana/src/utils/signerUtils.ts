/**
 * @file Message signer for Solana wallets: Wallet Standard `solana:signMessage`, with fallbacks for wallet adapters.
 */

import { getBase58Decoder, getUtf8Encoder } from '@solana/kit';

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
 * account. The wallet may show a prompt.
 *
 * @param target - The wallet and account to sign with.
 * @returns A function that signs `message` and resolves to the base58-encoded signature. It rejects with
 * `[SATELLITE-SOLANA] Invalid signer target.` when `target` is missing,
 * `[SATELLITE-SOLANA] Signer lacks known message signing capabilities.` when no capability is found, an
 * `... invalid signMessage output.` or `... invalid signMessages output.` error when the wallet returns no signature,
 * and with the wallet's error when the user rejects.
 */
export function createSolanaMessageSigner(target: SolanaSignerTarget): (message: string) => Promise<string> {
  return async (message: string): Promise<string> => {
    if (!target) {
      throw new Error('[SATELLITE-SOLANA] Invalid signer target.');
    }

    const wallet = (target.wallet ?? target) as Record<string, unknown>;
    const account = (target.account ?? target) as Record<string, unknown>;

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

    throw new Error('[SATELLITE-SOLANA] Signer lacks known message signing capabilities.');
  };
}
