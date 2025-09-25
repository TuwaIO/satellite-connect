// --- RPC Client Caching ---

import { createSolanaRpc, Rpc, SolanaClusterMoniker, SolanaRpcApi } from 'gill';

/**
 * Validates whether a string is a properly formatted URL.
 * @param str - The string to validate.
 * @returns True if the string is a valid URL, otherwise false.
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
 * The default RPC URLs for each Solana cluster.
 * Not all clusters need to be defined; undefined ones will fall back to other logic.
 * @internal
 */
const defaultRpcUrlsByMoniker: Partial<Record<SolanaClusterMoniker, string>> = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
};

/**
 * An in-memory cache for RPC clients to avoid redundant instance creation.
 * @internal
 */
const rpcCache = new Map<string, Rpc<SolanaRpcApi>>();

/**
 * Retrieves a cached RPC client for a given URL or cluster moniker.
 * If no cached client exists, it creates a new instance.
 *
 * @param rpcUrlOrMoniker - Either a full RPC URL or a cluster moniker like 'mainnet'.
 * @returns The RPC client instance.
 * @internal
 */
export const createSolanaRPC = (rpcUrlOrMoniker: string): Rpc<SolanaRpcApi> => {
  // Check the cache first for an existing RPC instance.
  if (rpcCache.has(rpcUrlOrMoniker)) {
    return rpcCache.get(rpcUrlOrMoniker)!;
  }
  // Determine the RPC URL: validate if it's a full URL or fall back to default list.
  const rpcUrl = isValidUrl(rpcUrlOrMoniker)
    ? rpcUrlOrMoniker
    : defaultRpcUrlsByMoniker[rpcUrlOrMoniker as SolanaClusterMoniker];

  // If no valid RPC URL could be resolved, default to the mainnet URL.
  if (!rpcUrl) {
    throw new Error(
      `Unable to resolve RPC URL for input: "${rpcUrlOrMoniker}". Ensure it's a valid URL or known moniker.`,
    );
  }

  // Create a new RPC client instance.
  const newRpc = createSolanaRpc(rpcUrl);

  // Cache the new instance and return it.
  rpcCache.set(rpcUrlOrMoniker, newRpc);
  return newRpc;
};
