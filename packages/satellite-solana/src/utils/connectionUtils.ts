import { getAvailableSolanaConnectors } from '@tuwaio/orbit-solana';
import type { Wallet, WalletAccount } from '@wallet-standard/base';
import type {
  StandardConnectFeature,
  StandardConnectMethod,
  StandardDisconnectFeature,
} from '@wallet-standard/features';
import { StandardConnect, StandardDisconnect } from '@wallet-standard/features';
import { getWalletFeature, type UiWallet, UiWalletAccount } from '@wallet-standard/ui';
import {
  getOrCreateUiWalletAccountForStandardWalletAccount as getOrCreateUiWalletAccountForStandardWalletAccount,
  getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,
  getWalletForHandle as getWalletForHandle,
} from '@wallet-standard/ui-registry';

/**
 * Returns the Wallet Standard `Wallet` and `WalletAccount` behind UI handles, which carry the feature implementations
 * (for example `solana:signMessage`). Uses the registry of `@wallet-standard/ui-registry`.
 *
 * @param uiWallet - The UI wallet handle.
 * @param uiAccount - The UI account handle.
 * @returns The underlying wallet and account, or the handles themselves when they are not registered.
 */
export function unwrapUiWalletHandles(
  uiWallet: UiWallet,
  uiAccount: UiWalletAccount,
): {
  /** The Wallet Standard wallet, or `uiWallet` when it is not registered. */
  wallet: Wallet | UiWallet;
  /** The Wallet Standard account, or `uiAccount` when it is not registered. */
  account: WalletAccount | UiWalletAccount;
} {
  try {
    const rawWallet = getWalletForHandle(uiWallet);
    const rawAccount = getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(uiAccount);
    return { wallet: rawWallet, account: rawAccount };
  } catch {
    return { wallet: uiWallet, account: uiAccount };
  }
}

/**
 * Connects a Wallet Standard wallet with its `standard:connect` feature. The wallet may show a prompt.
 *
 * @param uiWallet - The wallet to connect.
 * @param input - Options of `standard:connect`, without `silent`.
 * @returns `uiWallet`: the current UI handle of the same wallet (a handle is a snapshot, and the new one lists the
 * connected accounts); `accounts`: UI handles of the accounts the wallet returned.
 * @throws {Error} A `WalletStandardError` when the wallet does not implement `standard:connect`, the wallet's error
 * when the user rejects, or `[SATELLITE-SOLANA] The wallet did not return any accounts.`
 *
 * @example
 * ```ts
 * import { getAvailableSolanaConnectors } from '@tuwaio/orbit-solana';
 * import { connect } from '@tuwaio/satellite-solana';
 *
 * const [wallet] = getAvailableSolanaConnectors();
 * if (wallet) {
 *   const { accounts } = await connect(wallet);
 *   console.log('Connected account:', accounts[0].address);
 * }
 * ```
 */
export async function connect(
  uiWallet: UiWallet,
  input?: Omit<NonNullable<Parameters<StandardConnectMethod>[0]>, 'silent'>,
): Promise<{ uiWallet: UiWallet; accounts: UiWalletAccount[] }> {
  // Get the connect feature from the wallet
  const connectFeature = getWalletFeature(uiWallet, StandardConnect) as StandardConnectFeature[typeof StandardConnect];
  // Initiate connection and get accounts
  const { accounts } = await connectFeature.connect(input);
  if (accounts.length === 0) {
    throw new Error('[SATELLITE-SOLANA] The wallet did not return any accounts.');
  }
  const rawWallet = getWalletForHandle(uiWallet);
  // UI handles are snapshots: take the current handle of the same wallet, which lists the connected accounts.
  // Matching by account address instead could pick another wallet that holds the same account.
  const connectedUiWallet =
    getAvailableSolanaConnectors().find((wallet) => getWalletForHandle(wallet) === rawWallet) ?? uiWallet;
  // Convert accounts to UI wallet accounts
  return {
    uiWallet: connectedUiWallet,
    accounts: accounts.map((account) => getOrCreateUiWalletAccountForStandardWalletAccount(rawWallet, account)),
  };
}

/**
 * Disconnects a Wallet Standard wallet with its `standard:disconnect` feature.
 *
 * @param uiWallet - The wallet to disconnect.
 * @returns Resolves when the wallet has disconnected.
 * @throws {Error} A `WalletStandardError` when the wallet does not implement `standard:disconnect` (the wallets of
 * `getAvailableSolanaConnectors` from `@tuwaio/orbit-solana` always do), or the wallet's error.
 */
export async function disconnect(uiWallet: UiWallet): Promise<void> {
  // Get the disconnect feature if available
  const disconnectFeature = getWalletFeature(uiWallet, StandardDisconnect) as
    StandardDisconnectFeature[typeof StandardDisconnect] | undefined;

  await disconnectFeature?.disconnect();
}
