import { defaultRpcUrlsByMoniker, SolanaRPCUrls } from '@tuwaio/orbit-solana';
import type { SolanaClusterMoniker } from 'gill';

import { ChainIdentifierArray } from '../types';

/**
 * Extracts Solana cluster from chain identifier
 */
function extractSolanaCluster(chainId: string): SolanaClusterMoniker | null {
  const parts = chainId.split(':');
  if (parts.length < 2) return null;

  const cluster = parts[1] as SolanaClusterMoniker;
  // Validate that it's a known cluster
  return cluster in defaultRpcUrlsByMoniker ? cluster : null;
}

/**
 * Builds available Solana RPC URLs from chain identifiers
 */
function buildSolanaRpcUrls(
  chains: ChainIdentifierArray,
  solanaRPCUrls?: SolanaRPCUrls['rpcUrls'],
): SolanaRPCUrls['rpcUrls'] {
  const availableRpcUrls: SolanaRPCUrls['rpcUrls'] = {};

  for (const chainId of chains) {
    if (typeof chainId !== 'string') continue;

    const cluster = extractSolanaCluster(chainId);
    if (!cluster) continue;

    // Get RPC URL with fallback to default
    const rpcUrl = solanaRPCUrls?.[cluster] ?? defaultRpcUrlsByMoniker[cluster];

    if (rpcUrl) {
      availableRpcUrls[cluster] = rpcUrl;
    }
  }

  return availableRpcUrls;
}

/**
 * Get Solana clusters from configuration
 */
export function getSolanaClusters(
  solanaRPCUrls?: Partial<Record<SolanaClusterMoniker, string>>,
  chains?: ChainIdentifierArray,
): string[] {
  if (chains && chains.length > 0) {
    // For Solana, build RPC URLs and return cluster names
    const availableRpcUrls = buildSolanaRpcUrls(chains, solanaRPCUrls);
    return Object.keys(availableRpcUrls);
  }

  // Return configured clusters or defaults
  return Object.keys(solanaRPCUrls || defaultRpcUrlsByMoniker);
}

/**
 * Type guard to check if a chain list contains Solana cluster names
 */
export function isSolanaChainList(chains: (string | number)[]): chains is string[] {
  return chains.length > 0 && chains.every((chain) => typeof chain === 'string');
}

/**
 * Gets available Solana clusters from the default configuration
 */
export function getAvailableSolanaClusters(): SolanaClusterMoniker[] {
  return Object.keys(defaultRpcUrlsByMoniker) as SolanaClusterMoniker[];
}

/**
 * Validates if a string is a valid Solana cluster moniker
 */
export function isValidSolanaCluster(cluster: string): cluster is SolanaClusterMoniker {
  return cluster in defaultRpcUrlsByMoniker;
}
