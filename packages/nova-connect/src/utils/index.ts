/**
 * @fileoverview Central export hub for blockchain utility functions and types.
 *
 * This module provides a unified interface for accessing blockchain-related utilities,
 * offering both synchronous and asynchronous versions of functions to support different
 * usage patterns and performance requirements.
 *
 * Export Strategy:
 * - Synchronous functions by default for backward compatibility
 * - Asynchronous versions with "Async" suffix for better performance
 * - Adapter management functions for system control
 * - Type exports for TypeScript integration
 *
 * @example
 * ```typescript
 * // Import synchronous version (backward compatible)
 * import { getChainsListByWalletType, isEvmChainList } from './utils';
 *
 * // Import asynchronous version (better performance)
 * import {
 *   getChainsListByWalletTypeAsync,
 *   isEvmChainListAsync
 * } from './utils';
 *
 * // Import adapter management
 * import { preloadChainAdapters, getAdapterStatus } from './utils';
 *
 * // Import types
 * import type { ChainAdapter, AdapterLoadStatus } from './utils';
 * ```
 *
 * @since 1.0.0
 */

// ========================================
// Core Chain Utilities (Re-exports)
// ========================================

/**
 * Re-export all functions from the main chain utilities module.
 * This includes both sync and async versions with proper naming.
 */
export * from './getChainsListByWalletType';

// ========================================
// Type Exports
// ========================================

/**
 * Export adapter-related types for TypeScript integration.
 * These types enable proper type checking when working with adapters.
 */
export type { AdapterInfo, AdapterLoadStatus, ChainAdapter } from './adapters/types';

// ========================================
// Adapter Management Functions
// ========================================

/**
 * Export adapter management utilities from the main utilities module.
 * These functions provide control over adapter loading and status monitoring.
 */
export { getAdapterStatus, getAllAdaptersStatus, preloadChainAdapters } from './getChainsListByWalletType';

// ========================================
// Backward Compatibility Layer
// ========================================

/**
 * Export synchronous versions with original names for backward compatibility.
 * This ensures existing code continues to work without modifications.
 *
 * Mapping:
 * - getChainsListByWalletType -> getChainsListByWalletTypeSync
 * - isEvmChainList -> isEvmChainListSync
 * - isSolanaChainList -> isSolanaChainListSync
 */
export {
  getChainsListByWalletTypeSync as getChainsListByWalletType,
  getWalletChains,
  isEvmChainListSync as isEvmChainList,
  isSolanaChainListSync as isSolanaChainList,
} from './getChainsListByWalletType';

// ========================================
// Async Versions with Explicit Naming
// ========================================

/**
 * Export asynchronous versions with "Async" suffix for clarity and performance.
 * These versions should be preferred for new code as they provide better
 * functionality through dynamic adapter loading.
 *
 * Benefits of async versions:
 * - Automatic adapter loading when needed
 * - More comprehensive validation logic
 * - Better error handling and fallbacks
 * - Future-proof architecture
 */
export {
  getAvailableSolanaClusters as getAvailableSolanaClustersAsync,
  getChainsListByWalletType as getChainsListByWalletTypeAsync,
  isEvmChainList as isEvmChainListAsync,
  isSolanaChainList as isSolanaChainListAsync,
  isValidSolanaCluster as isValidSolanaClusterAsync,
} from './getChainsListByWalletType';

// ========================================
// Fallback Implementations
// ========================================

/**
 * Synchronous fallback for getting available Solana clusters.
 *
 * This function provides immediate results but with limited functionality.
 * It serves as a compatibility layer for synchronous contexts where the
 * async version cannot be used.
 *
 * @returns Empty array with warning (use async version for real results)
 *
 * @example
 * ```typescript
 * // Synchronous fallback (limited functionality)
 * const clusters = getAvailableSolanaClusters(); // []
 *
 * // Preferred async version (full functionality)
 * const clustersAsync = await getAvailableSolanaClustersAsync();
 * ```
 *
 * @since 1.0.0
 * @deprecated Use getAvailableSolanaClustersAsync for full functionality
 */
export function getAvailableSolanaClusters(): string[] {
  console.warn(
    'getAvailableSolanaClusters: Using synchronous fallback with limited functionality. ' +
      'Use getAvailableSolanaClustersAsync for complete cluster detection.',
  );
  return [];
}

/**
 * Synchronous fallback for Solana cluster validation.
 *
 * This function provides basic validation against known cluster names but
 * lacks the comprehensive validation logic of the async version. It performs
 * a simple lookup against standard Solana cluster monikers.
 *
 * @param cluster - Cluster name to validate
 * @returns True if cluster name matches known standard clusters
 *
 * @example
 * ```typescript
 * // Synchronous fallback (basic validation)
 * const isValid = isValidSolanaCluster('mainnet-beta'); // true
 * const isCustom = isValidSolanaCluster('custom-cluster'); // false
 *
 * // Preferred async version (comprehensive validation)
 * const isValidAsync = await isValidSolanaClusterAsync('custom-cluster');
 * ```
 *
 * @since 1.0.0
 * @deprecated Use isValidSolanaClusterAsync for comprehensive validation
 */
export function isValidSolanaCluster(cluster: string): boolean {
  console.warn(
    'isValidSolanaCluster: Using synchronous fallback with basic validation. ' +
      'Use isValidSolanaClusterAsync for comprehensive cluster validation.',
  );

  // Basic validation against known standard clusters
  const knownClusters = ['mainnet', 'devnet', 'testnet', 'localnet'];
  return knownClusters.includes(cluster);
}

// ========================================
// Additional Utility Exports
// ========================================

/**
 * Export additional utility functions that don't require blockchain-specific adapters.
 * These utilities provide general functionality for wallet and network management.
 */
export * from './getConnectedChainId';
export * from './getFilteredConnectors';
export * from './getGroupedConnectors';
export * from './getNetworIcon';
export * from './networksLinks';
