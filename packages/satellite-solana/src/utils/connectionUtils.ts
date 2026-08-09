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
 * Extracts raw Wallet Standard objects from UI handles.
 * This is necessary to access actual feature implementations like signMessage.
 *
 * @param uiWallet - The UI wallet handle
 * @param uiAccount - The UI wallet account handle
 * @returns The raw underlying Wallet Standard objects, or the original handles if extraction fails
 */
export function unwrapUiWalletHandles(
  uiWallet: UiWallet,
  uiAccount: UiWalletAccount,
): { wallet: Wallet | UiWallet; account: WalletAccount | UiWalletAccount } {
  try {
    const rawWallet = getWalletForHandle(uiWallet);
    const rawAccount = getWalletAccountForUiWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED(uiAccount);
    return { wallet: rawWallet, account: rawAccount };
  } catch {
    return { wallet: uiWallet, account: uiAccount };
  }
}

/**
 * Establishes connection with a wallet using Wallet Standard
 *
 * @remarks
 * Connects to a wallet that implements the Wallet Standard interface.
 * Uses the StandardConnect feature to establish connection and retrieve accounts.
 * Converts standard wallet accounts to UI wallet accounts.
 *
 * @param uiWallet - Wallet instance implementing the UI Wallet interface
 * @param input - Optional connection parameters (excluding silent flag)
 * @returns Promise resolving to array of connected wallet accounts
 *
 * @throws {Error} If wallet doesn't support StandardConnect feature
 * @throws {Error} If connection attempt fails
 *
 * @example
 * ```typescript
 * const accounts = await connect(wallet, {
 *   // Optional connection parameters
 * });
 * const firstAccount = accounts[0];
 * console.log('Connected account:', firstAccount.address);
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
  const wallets = getAvailableSolanaConnectors();
  // Convert accounts to UI wallet accounts
  return {
    uiWallet: wallets.filter((w) =>
      w.accounts.find((a) => a.address.toLowerCase() === accounts[0].address.toLowerCase()),
    )[0],
    accounts: accounts.map((account) =>
      getOrCreateUiWalletAccountForStandardWalletAccount(getWalletForHandle(uiWallet), account),
    ),
  };
}

/**
 * Disconnects from a connected wallet
 *
 * @remarks
 * Safely disconnects from a wallet if it supports the StandardDisconnect feature.
 * If the wallet doesn't support disconnection, the operation is silently ignored.
 *
 * @param uiWallet - Wallet instance implementing the UI Wallet interface
 * @returns Promise that resolves when disconnection is complete
 *
 * @example
 * ```typescript
 * await disconnect(wallet);
 * console.log('Wallet disconnected');
 * ```
 */
export async function disconnect(uiWallet: UiWallet): Promise<void> {
  // Get the disconnect feature if available
  const disconnectFeature = getWalletFeature(uiWallet, StandardDisconnect) as
    StandardDisconnectFeature[typeof StandardDisconnect] | undefined;

  await disconnectFeature?.disconnect();
}
