/**
 * @fileoverview Native Solana message signer utility for Wallet Standard wallets.
 * Eliminates external dependencies on SIWX adapters by leveraging @solana/kit directly.
 */

import { getBase58Decoder, getUtf8Encoder } from '@solana/kit';

/**
 * Target input containing wallet and account handles for Solana message signing.
 */
export interface SolanaSignerTarget {
  account?: unknown;
  wallet?: unknown;
  [key: string]: unknown;
}

/**
 * Creates a native signer callback for Solana using standard Wallet Standard features.
 * Decodes the signature to a Base58 string using @solana/kit.
 *
 * @param target - Object containing wallet and account handles
 * @returns Function accepting a string message and returning the Base58 signature string
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
