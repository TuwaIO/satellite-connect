import type {
  StandardConnectFeature,
  StandardConnectMethod,
  StandardDisconnectFeature,
} from '@wallet-standard/features';
import { StandardConnect, StandardDisconnect } from '@wallet-standard/features';
import { getWalletFeature, type UiWallet, type UiWalletAccount } from '@wallet-standard/ui';
import {
  getOrCreateUiWalletAccountForStandardWalletAccount_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as getOrCreateUiWalletAccountForStandardWalletAccount,
  getWalletForHandle_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as getWalletForHandle,
} from '@wallet-standard/ui-registry';

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
): Promise<readonly UiWalletAccount[]> {
  // Get the connect feature from the wallet
  const connectFeature = getWalletFeature(uiWallet, StandardConnect) as StandardConnectFeature[typeof StandardConnect];

  // Initiate connection and get accounts
  const { accounts } = await connectFeature.connect(input);

  // Convert accounts to UI wallet accounts
  return accounts.map((account) =>
    getOrCreateUiWalletAccountForStandardWalletAccount(getWalletForHandle(uiWallet), account),
  );
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
    | StandardDisconnectFeature[typeof StandardDisconnect]
    | undefined;

  // Attempt disconnection if feature is supported
  await disconnectFeature?.disconnect();
}
