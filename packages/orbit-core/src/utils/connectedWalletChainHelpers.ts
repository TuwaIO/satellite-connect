/**
 * Helper utilities for managing impersonated wallet addresses
 *
 * @remarks
 * These utilities are primarily used for development and testing purposes.
 * They provide a way to simulate different wallet addresses without actually connecting a wallet.
 * All data is stored in localStorage with the 'satellite-connect:impersonatedAddress' key.
 * Functions are safe to use in both browser and SSR environments.
 */
export const connectedWalletChainHelpers = {
  /**
   * Currently impersonated address from localStorage
   * Returns empty string if not set or in SSR context
   */
  connectedWalletChain:
    typeof window !== 'undefined' ? (window.localStorage.getItem('orbit-core:connectedWalletChain') ?? '') : '',

  /**
   * Stores an impersonated address in localStorage
   *
   * @example
   * ```typescript
   * // Set impersonated address
   * impersonatedHelpers.setImpersonated('0x1234...5678');
   * ```
   *
   * @param address - Ethereum or Solana address to impersonate
   * @returns undefined in SSR context, void in browser
   */
  setConnectedWalletChain: (chain: string | number) =>
    typeof window !== 'undefined'
      ? window.localStorage.setItem('orbit-core:connectedWalletChain', String(chain))
      : undefined,

  /**
   * Retrieves the current impersonated address from localStorage
   *
   * @example
   * ```typescript
   * // Get current impersonated address
   * const address = impersonatedHelpers.getImpersonated();
   * if (address) {
   *   console.log('Currently impersonating:', address);
   * }
   * ```
   * @returns The impersonated address or undefined if not set or in SSR context
   */
  getConnectedWalletChain: () =>
    typeof window !== 'undefined' ? window.localStorage.getItem('orbit-core:connectedWalletChain') : undefined,

  removeConnectedWalletChain: () =>
    typeof window !== 'undefined' ? window.localStorage.removeItem('orbit-core:connectedWalletChain') : undefined,
};
