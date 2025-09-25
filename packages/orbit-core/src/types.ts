/**
 * @file
 * Core type definitions for the Orbit blockchain adapter system.
 * This file contains fundamental enums and types that define the supported blockchain architectures
 * and their adapter interfaces.
 */

// =================================================================================================
// 1. ENUMS AND CORE TRANSACTION TYPES
// =================================================================================================

/**
 * Defines the supported blockchain adapters in the Orbit system.
 * Each adapter corresponds to a specific blockchain architecture and implements
 * the necessary interfaces for that chain's functionality.
 *
 * @enum {string}
 *
 * @example
 * ```typescript
 * // Using adapter types in configuration
 * const config = {
 *   chainType: OrbitAdapter.EVM,
 *   // other configuration...
 * };
 *
 * // Checking adapter compatibility
 * if (chainType === OrbitAdapter.SOLANA) {
 *   // Solana-specific logic
 * }
 * ```
 */
export enum OrbitAdapter {
  /**
   * For Ethereum Virtual Machine (EVM) compatible chains.
   * Supports networks like:
   * - Ethereum Mainnet
   * - Polygon
   * - Binance Smart Chain
   * - Avalanche
   * - Other EVM-compatible L1/L2 chains
   */
  EVM = 'evm',

  /**
   * For the Solana blockchain.
   * Supports:
   * - Solana Mainnet
   * - Devnet
   * - Testnet
   */
  SOLANA = 'solana',

  /**
   * For the Starknet L2 network.
   * Supports:
   * - Starknet Mainnet
   * - Testnet (Goerli)
   * - Other Starknet deployments
   */
  Starknet = 'starknet',
}

/**
 * Generic type for creating blockchain adapters with type safety.
 * This type ensures that all adapters implement the required interface
 * and are properly keyed by their blockchain type.
 *
 * @typeParam A - Type that extends the base adapter interface with a key property
 *
 * @property {A | A[]} adapter - Single adapter instance or array of adapters
 *
 * @example
 * ```typescript
 * // Single adapter implementation
 * interface EVMAdapter extends BaseAdapter {
 *   key: OrbitAdapter.EVM;
 *   // EVM-specific methods...
 * }
 * const evmConfig: OrbitGenericAdapter<EVMAdapter> = {
 *   adapter: {
 *     key: OrbitAdapter.EVM,
 *     // implementation...
 *   }
 * };
 *
 * // Multiple adapters
 * const multiChainConfig: OrbitGenericAdapter<BaseAdapter> = {
 *   adapter: [
 *     { key: OrbitAdapter.EVM, ... },
 *     { key: OrbitAdapter.SOLANA, ... }
 *   ]
 * };
 * ```
 */
export type OrbitGenericAdapter<A extends { key: OrbitAdapter }> = {
  adapter: A | A[];
};
