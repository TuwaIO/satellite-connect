import { WalletType } from '../types';
import { getParsedStorageItem } from './getParsedStorageItem';

type LastConnectedWallet = { walletType: WalletType; chainId: number | string; address?: string };

/**
 * Helper utilities for managing the last connected wallet state
 *
 * @remarks
 * All data is stored in localStorage with the 'orbit-core:lastConnectedWallet' key.
 * Functions are safe to use in both browser and SSR environments.
 */
export const lastConnectedWalletHelpers = {
  // Key used for localStorage
  STORAGE_KEY: 'orbit-core:lastConnectedWallet',

  /**
   * The value of the last connected wallet, initialized when the module loads.
   * Returns undefined if not set, invalid, or in an SSR context.
   */
  lastConnectedWallet: getParsedStorageItem<LastConnectedWallet>('orbit-core:lastConnectedWallet'),

  /**
   * Stores the last connected wallet data in localStorage.
   *
   * @param data - Object containing the wallet type and chain ID.
   * @returns undefined in SSR context, void in browser
   */
  setLastConnectedWallet: ({ walletType, chainId, address }: LastConnectedWallet) =>
    typeof window !== 'undefined'
      ? window.localStorage.setItem(
          lastConnectedWalletHelpers.STORAGE_KEY,
          JSON.stringify({ walletType, chainId, address }),
        )
      : undefined,

  /**
   * Retrieves the current last connected wallet data from localStorage.
   *
   * @returns The LastConnectedWallet object or undefined if not set or in SSR context
   */
  getLastConnectedWallet: () => getParsedStorageItem<LastConnectedWallet>(lastConnectedWalletHelpers.STORAGE_KEY),

  /**
   * Removes the last connected wallet data from localStorage.
   *
   * @returns undefined in SSR context, void in browser
   */
  removeLastConnectedWallet: () =>
    typeof window !== 'undefined' ? window.localStorage.removeItem(lastConnectedWalletHelpers.STORAGE_KEY) : undefined,
};
