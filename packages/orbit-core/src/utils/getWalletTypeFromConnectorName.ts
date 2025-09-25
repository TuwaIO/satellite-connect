import { OrbitAdapter } from '../types';

/**
 * Generates a standardized wallet type identifier from adapter type and connector name
 *
 * @example
 * ```typescript
 * // Returns "evm:metamask"
 * getWalletTypeFromConnectorName(OrbitAdapter.EVM, "MetaMask");
 *
 * // Returns "solana:phantom"
 * getWalletTypeFromConnectorName(OrbitAdapter.SOLANA, "Phantom");
 *
 * // Returns "evm:coinbasewallet" (removes spaces)
 * getWalletTypeFromConnectorName(OrbitAdapter.EVM, "Coinbase Wallet");
 * ```
 *
 * @param adapter - The blockchain adapter type (e.g. EVM, SOLANA)
 * @param name - The wallet connector name (e.g. "MetaMask", "Phantom")
 * @returns A formatted wallet type string in format "chain:wallet"
 *
 * @remarks
 * The function:
 * 1. Combines adapter type with connector name using ":" as separator
 * 2. Removes all whitespace from connector name
 * 3. Converts connector name to lowercase
 * This ensures consistent wallet type identifiers across the application
 */
export function getWalletTypeFromConnectorName(adapter: OrbitAdapter, name: string): string {
  return `${adapter}:${name.replace(/\s+/g, '').toLowerCase()}`;
}
