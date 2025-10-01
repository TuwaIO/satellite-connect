import { WalletType } from '../types';

type LastConnectedWallet = { walletType: WalletType; chainId: number | string };

/**
 * Internal function for safely retrieving and parsing data from localStorage.
 *
 * @param key - The key for localStorage
 * @returns The parsed LastConnectedWallet object or undefined if data is not found/invalid
 */
const getParsedStorageItem = (key: string): LastConnectedWallet | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const item = window.localStorage.getItem(key);

  // If the item is null (not set) or an empty string, return undefined
  if (!item) {
    return undefined;
  }

  try {
    // Safe JSON parsing
    return JSON.parse(item) as LastConnectedWallet;
  } catch (error) {
    // In case of a parsing error (e.g., invalid JSON), log the error and return undefined
    console.error('Error parsing lastConnectedWallet from localStorage:', error);
    return undefined;
  }
};

/**
 * Helper utilities for managing the last connected wallet state
 *
 * @remarks
 * All data is stored in localStorage with the 'satellite-connect:lastConnectedWallet' key.
 * Functions are safe to use in both browser and SSR environments.
 */
export const lastConnectedWalletHelpers = {
  // Key used for localStorage
  STORAGE_KEY: 'satellite-connect:lastConnectedWallet',

  /**
   * The value of the last connected wallet, initialized when the module loads.
   * Returns undefined if not set, invalid, or in an SSR context.
   */
  lastConnectedWallet: getParsedStorageItem('satellite-connect:lastConnectedWallet'),

  /**
   * Stores the last connected wallet data in localStorage.
   *
   * @param data - Object containing the wallet type and chain ID.
   * @returns undefined in SSR context, void in browser
   */
  setLastConnectedWallet: ({ walletType, chainId }: LastConnectedWallet) =>
    typeof window !== 'undefined'
      ? window.localStorage.setItem(lastConnectedWalletHelpers.STORAGE_KEY, JSON.stringify({ walletType, chainId }))
      : undefined,

  /**
   * Retrieves the current last connected wallet data from localStorage.
   *
   * @returns The LastConnectedWallet object or undefined if not set or in SSR context
   */
  getLastConnectedWallet: () => getParsedStorageItem(lastConnectedWalletHelpers.STORAGE_KEY),

  /**
   * Removes the last connected wallet data from localStorage.
   *
   * @returns undefined in SSR context, void in browser
   */
  removeLastConnectedWallet: () =>
    typeof window !== 'undefined' ? window.localStorage.removeItem(lastConnectedWalletHelpers.STORAGE_KEY) : undefined,
};
