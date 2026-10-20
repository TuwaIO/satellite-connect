/**
 * @file Message signer of Solana connections: the shared signer of `@tuwaio/orbit-solana` with the errors of Satellite
 * Connect.
 */

import {
  createSolanaMessageSigner as createSharedSolanaMessageSigner,
  type SolanaMessageFormat as SharedSolanaMessageFormat,
  type SolanaMessageSignerTarget,
} from '@tuwaio/orbit-solana/signer';

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
 * `@tuwaio/siwx-solana` and `@tuwaio/siwx-server` accept both for SIWX. The same type as `SolanaMessageFormat` of
 * `@tuwaio/orbit-solana`.
 */
export type SolanaMessageFormat = SharedSolanaMessageFormat;

/**
 * Options of {@link createSolanaMessageSigner}.
 */
export interface SolanaMessageSignerOptions {
  /** How the wallet signs. Defaults to `'auto'`; see {@link SolanaMessageFormat}. */
  messageFormat?: SolanaMessageFormat;
}

/**
 * What {@link createSolanaMessageSigner} signs with: the Wallet Standard `Wallet` and `WalletAccount` (see
 * {@link unwrapUiWalletHandles}), a wallet adapter, or the value of `useWallet()` from `@solana/wallet-adapter-react`
 * (v1) or `@solana/wallet-adapter` (v3):
 * [`SolanaMessageSignerTarget`](https://orbit.docs.tuwa.io/packages/orbit-solana/interfaces/SolanaMessageSignerTarget)
 * of `@tuwaio/orbit-solana` (its fields are described there). When `wallet` or `account` is missing or `null`, the
 * target object itself is used in its place.
 *
 * Every field may be missing or `null`, as in `useWallet()` before a wallet connects: the signer looks for a signing
 * capability only when it is called, and rejects when it finds none.
 */
export type SolanaSignerTarget = SolanaMessageSignerTarget;

/**
 * Creates a function that signs UTF-8 messages with a Solana wallet and returns base58 signatures. The adapter and the
 * watcher use it as `signMessage` of a Solana connection. It is `createSolanaMessageSigner` of `@tuwaio/orbit-solana`,
 * the signer `@tuwaio/siwx-solana` uses too, with the `[SATELLITE-SOLANA]` prefix on its errors.
 *
 * The signer uses the first capability it finds: the Wallet Standard `solana:signMessage` feature of the wallet (or
 * of the account), a `signMessages` method, then a legacy `signMessage` method of the wallet, its `adapter`, the
 * account or the target itself (so a wallet adapter and `useWallet()` of `@solana/wallet-adapter` v1 and v3 can be
 * passed as is); methods are called on the object that has them. Accounts that list `solana:signOffchainMessage` but
 * not `solana:signMessage` (hardware wallet accounts may) sign the version 1 off-chain message of the text instead;
 * `options.messageFormat` changes the choice ({@link SolanaMessageFormat}). The wallet may show a prompt.
 *
 * @param target - The wallet and account to sign with, a wallet adapter or `useWallet()`; see {@link SolanaSignerTarget}.
 * @param options - `messageFormat`: `'auto'` (default), `'message'` or `'offchainMessage'`.
 * @returns A function that signs `message` and resolves to the base58-encoded signature. It rejects with
 * `[SATELLITE-SOLANA] Invalid signer target.` when `target` is missing,
 * `[SATELLITE-SOLANA] Signer lacks known message signing capabilities.` when no capability is found,
 * `... Signer cannot sign off-chain messages.` for `'offchainMessage'` without one, an
 * `... invalid signMessage output.`, `... invalid signMessages output.` or `... invalid signOffchainMessage output.`
 * error when the wallet returns no signature, `... Unexpected legacy signMessage result format.` when a legacy
 * `signMessage` returns neither bytes nor `{ signature }`, `... cannot sign version 1 off-chain messages.` or
 * `... signed a different off-chain message than requested.` for off-chain messages, and with the wallet's error when
 * the user rejects.
 */
export function createSolanaMessageSigner(
  target: SolanaSignerTarget,
  options: SolanaMessageSignerOptions = {},
): (message: string) => Promise<string> {
  return createSharedSolanaMessageSigner(target, { ...options, errorPrefix: '[SATELLITE-SOLANA]' });
}
