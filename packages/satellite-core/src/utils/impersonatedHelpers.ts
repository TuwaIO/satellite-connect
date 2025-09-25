/**
 * Helper utilities for managing impersonated wallet addresses
 *
 * @remarks
 * These utilities are primarily used for development and testing purposes.
 * They provide a way to simulate different wallet addresses without actually connecting a wallet.
 * All data is stored in localStorage with the 'satellite-connect:impersonatedAddress' key.
 * Functions are safe to use in both browser and SSR environments.
 */
export const impersonatedHelpers = {
  /**
   * Currently impersonated address from localStorage
   * Returns empty string if not set or in SSR context
   */
  impersonatedAddress:
    typeof window !== 'undefined' ? (window.localStorage.getItem('satellite-connect:impersonatedAddress') ?? '') : '',

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
  setImpersonated: (address: string) =>
    typeof window !== 'undefined'
      ? window.localStorage.setItem('satellite-connect:impersonatedAddress', address)
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
  getImpersonated: () =>
    typeof window !== 'undefined' ? window.localStorage.getItem('satellite-connect:impersonatedAddress') : undefined,
};
