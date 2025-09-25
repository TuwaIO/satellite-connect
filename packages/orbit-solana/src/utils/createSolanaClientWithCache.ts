/**
 * RPC Client Caching Module
 *
 * This module provides a caching mechanism for Solana RPC clients to optimize
 * performance and resource usage by reusing existing client instances.
 *
 * @module RpcClientCache
 */

import { createSolanaClient, SolanaClient, SolanaClusterMoniker } from 'gill';

import { defaultRpcUrlsByMoniker } from './defaultRpcUrlsByMoniker';

/**
 * Validates if a string represents a properly formatted URL
 *
 * @param str - String to validate as URL
 * @returns Boolean indicating if the string is a valid URL
 *
 * @example
 * ```typescript
 * isValidUrl('https://api.mainnet-beta.solana.com') // returns true
 * isValidUrl('not-a-url') // returns false
 * ```
 */
function isValidUrl(str: string): boolean {
  try {
    new URL(str);
    return true;
  } catch {
    return false;
  }
}

/**
 * In-memory cache storage for Solana client instances
 * Maps Solana URLs or monikers to their corresponding client instances
 *
 * @internal
 */
const clientsCache = new Map<string, SolanaClient>();

/**
 * Creates or retrieves a cached Solana RPC client instance
 *
 * This function implements a caching mechanism for Solana RPC clients to:
 * - Avoid redundant client instance creation
 * - Optimize memory usage
 * - Maintain consistent client instances throughout the application
 *
 * @param rpcUrlOrMoniker - RPC endpoint URL or cluster moniker (e.g., 'mainnet', 'devnet')
 * @returns Cached or newly created Solana RPC client instance
 * @throws Error if unable to resolve a valid RPC URL
 *
 * @example
 * ```typescript
 * // Using cluster moniker
 * const mainnetClient = createSolanaClientWithCache('mainnet');
 *
 * // Using custom RPC URL
 * const customClient = createSolanaClientWithCache('https://my-rpc.example.com');
 * ```
 */
export const createSolanaClientWithCache = (rpcUrlOrMoniker: string): SolanaClient => {
  // Return existing client instance if available in cache
  if (clientsCache.has(rpcUrlOrMoniker)) {
    return clientsCache.get(rpcUrlOrMoniker)!;
  }

  // Resolve RPC URL from input: direct URL or cluster moniker
  const rpcUrl = isValidUrl(rpcUrlOrMoniker)
    ? rpcUrlOrMoniker
    : defaultRpcUrlsByMoniker[rpcUrlOrMoniker as SolanaClusterMoniker];

  // Validate resolved RPC URL
  if (!rpcUrl) {
    throw new Error(
      `Unable to resolve RPC URL for input: "${rpcUrlOrMoniker}". Ensure it's a valid URL or known moniker.`,
    );
  }

  // Create new client instance with resolved URL
  const newClient = createSolanaClient({ urlOrMoniker: rpcUrl });

  // Cache and return the new instance
  clientsCache.set(rpcUrlOrMoniker, newClient);
  return newClient;
};
