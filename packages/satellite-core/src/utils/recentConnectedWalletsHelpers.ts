import { OrbitAdapter } from '@tuwaio/orbit-core/src';

import { getParsedStorageItem } from './getParsedStorageItem';

export type RecentConnectedWallet = Record<OrbitAdapter, Record<string, boolean>>;

/**
 * Helper utilities for managing the last connected wallet state
 *
 * @remarks
 * All data is stored in localStorage with the 'satellite-connect:lastConnectedWallet' key.
 * Functions are safe to use in both browser and SSR environments.
 */
export const recentConnectedWalletsHelpers = {
  // Key used for localStorage
  STORAGE_KEY: 'satellite-connect:recentConnectedWallets',

  /**
   * The value of the last connected wallet, initialized when the module loads.
   * Returns undefined if not set, invalid, or in an SSR context.
   */
  recentConnectedWallets: getParsedStorageItem<RecentConnectedWallet>('satellite-connect:recentConnectedWallets'),

  /**
   * Stores the last connected wallet data in localStorage.
   *
   * @param wallets - RecentConnectedWallet
   * @returns undefined in SSR context, void in browser
   */
  setRecentConnectedWallets: (wallets: RecentConnectedWallet) =>
    typeof window !== 'undefined'
      ? window.localStorage.setItem(recentConnectedWalletsHelpers.STORAGE_KEY, JSON.stringify(wallets))
      : undefined,

  /**
   * Retrieves the current last connected wallet data from localStorage.
   *
   * @returns The LastConnectedWallet object or undefined if not set or in SSR context
   */
  getRecentConnectedWallets: () =>
    getParsedStorageItem<RecentConnectedWallet>(recentConnectedWalletsHelpers.STORAGE_KEY),

  /**
   * Removes the last connected wallet data from localStorage.
   *
   * @returns undefined in SSR context, void in browser
   */
  removeRecentConnectedWallets: () =>
    typeof window !== 'undefined'
      ? window.localStorage.removeItem(recentConnectedWalletsHelpers.STORAGE_KEY)
      : undefined,
};
