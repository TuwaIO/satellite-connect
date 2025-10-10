import { OrbitAdapter } from '../types';
import { getParsedStorageItem } from './getParsedStorageItem';

export type RecentConnectedWallet = Record<OrbitAdapter, Record<string, boolean>>;

/**
 * Helper utilities for managing the last connected wallet state
 *
 * @remarks
 * All data is stored in localStorage with the 'orbit-core:lastConnectedWallet' key.
 * Functions are safe to use in both browser and SSR environments.
 */
export const recentConnectedWalletHelpers = {
  // Key used for localStorage
  STORAGE_KEY: 'orbit-core:recentConnectedWallet',

  /**
   * The value of the last connected wallet, initialized when the module loads.
   * Returns undefined if not set, invalid, or in an SSR context.
   */
  recentConnectedWallet: getParsedStorageItem<RecentConnectedWallet>('orbit-core:recentConnectedWallets'),

  /**
   * Stores the last connected wallet data in localStorage.
   *
   * @param wallets - RecentConnectedWallet
   * @returns undefined in SSR context, void in browser
   */
  setRecentConnectedWallet: (wallets: RecentConnectedWallet) =>
    typeof window !== 'undefined'
      ? window.localStorage.setItem(recentConnectedWalletHelpers.STORAGE_KEY, JSON.stringify(wallets))
      : undefined,

  /**
   * Retrieves the current last connected wallet data from localStorage.
   *
   * @returns The LastConnectedWallet object or undefined if not set or in SSR context
   */
  getRecentConnectedWallet: () => getParsedStorageItem<RecentConnectedWallet>(recentConnectedWalletHelpers.STORAGE_KEY),

  /**
   * Removes the last connected wallet data from localStorage.
   *
   * @returns undefined in SSR context, void in browser
   */
  removeRecentConnectedWallet: () =>
    typeof window !== 'undefined'
      ? window.localStorage.removeItem(recentConnectedWalletHelpers.STORAGE_KEY)
      : undefined,
};
