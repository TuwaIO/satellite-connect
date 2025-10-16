import { OrbitAdapter } from '@tuwaio/orbit-core';
import { getAdapterFromWalletType, WalletType } from '@tuwaio/orbit-core';
import { defaultRpcUrlsByMoniker, SolanaRPCUrls } from '@tuwaio/orbit-solana'; // TODO: Move to @wallet-standard/solana
import { IdentifierArray } from '@wallet-standard/base';
import { SolanaClusterMoniker } from 'gill';

import { InitialChains } from '../../ui/types';

/**
 * Parameters for getting chains list by wallet type
 */
interface GetChainsListParams extends InitialChains {
  /** The wallet type to get chains for */
  walletType: WalletType;
  /** Optional array of chain identifiers to filter by */
  chains?: IdentifierArray;
}

/**
 * Extracts Solana cluster from chain identifier
 * @param chainId - Chain identifier in format "protocol:cluster"
 * @returns Solana cluster moniker or null if invalid
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
 * @param chains - Array of chain identifiers
 * @param solanaRPCUrls - Custom Solana RPC URLs configuration
 * @returns Object mapping cluster names to RPC URLs
 */
function buildSolanaRpcUrls(
  chains: IdentifierArray,
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
 * Type guard to check if a value is a valid chain ID (string or number, not null/undefined)
 * @param id - Value to check
 * @returns True if the value is a valid chain ID
 */
function isValidChainId(id: unknown): id is string | number {
  return id !== undefined && id !== null && (typeof id === 'string' || typeof id === 'number');
}

/**
 * Gets the list of available chains for a specific wallet type.
 *
 * For EVM wallets, returns chain IDs from the provided appChains.
 * For Solana wallets, processes the chains array to extract valid Solana clusters
 * and returns their names.
 *
 * @param params - Configuration object containing wallet type and chain information
 * @returns Array of chain identifiers available for the given wallet type
 *
 * @example
 * ```typescript
 * // Get EVM chains
 * const evmChains = getChainsListByWalletType({
 *   walletType: 'evm:metamask',
 *   appChains: [{ id: 1 }, { id: 137 }],
 * });
 * // Returns: [1, 137]
 *
 * // Get Solana chains
 * const solanaChains = getChainsListByWalletType({
 *   walletType: 'solana:phantom',
 *   chains: ['solana:mainnet-beta', 'solana:devnet'],
 *   solanaRPCUrls: { 'mainnet-beta': 'https://api.mainnet-beta.solana.com' },
 * });
 * // Returns: ['mainnet-beta', 'devnet']
 * ```
 */
export function getChainsListByWalletType(params: GetChainsListParams): (string | number)[] {
  const { walletType, appChains, solanaRPCUrls, chains = [] } = params;

  // Early validation
  if (!walletType) {
    console.warn('getChainsListByWalletType: walletType is required');
    return [];
  }

  const adapterType = getAdapterFromWalletType(walletType);

  switch (adapterType) {
    case OrbitAdapter.EVM: {
      // For EVM chains, return chain IDs from appChains
      if (!appChains || appChains.length === 0) {
        return [];
      }

      return appChains.map((chain) => chain.id).filter(isValidChainId); // Now using the proper type guard
    }

    case OrbitAdapter.SOLANA: {
      // For Solana, build RPC URLs and return cluster names
      const availableRpcUrls = buildSolanaRpcUrls(chains, solanaRPCUrls);
      return Object.keys(availableRpcUrls);
    }

    case OrbitAdapter.Starknet: {
      // Placeholder for Starknet support
      console.warn('getChainsListByWalletType: Starknet adapter not yet implemented');
      return [];
    }

    default: {
      console.warn(`getChainsListByWalletType: Unknown adapter type: ${adapterType}`);
      return [];
    }
  }
}

/**
 * Type guard to check if a chain list contains EVM chain IDs
 * @param chains - Array of chain identifiers
 * @returns True if the array contains number types (typical for EVM chain IDs)
 */
export function isEvmChainList(chains: (string | number)[]): chains is number[] {
  return chains.length > 0 && chains.every((chain) => typeof chain === 'number');
}

/**
 * Type guard to check if a chain list contains Solana cluster names
 * @param chains - Array of chain identifiers
 * @returns True if the array contains string types (typical for Solana clusters)
 */
export function isSolanaChainList(chains: (string | number)[]): chains is string[] {
  return chains.length > 0 && chains.every((chain) => typeof chain === 'string');
}

/**
 * Gets available Solana clusters from the default configuration
 * @returns Array of all known Solana cluster names
 */
export function getAvailableSolanaClusters(): SolanaClusterMoniker[] {
  return Object.keys(defaultRpcUrlsByMoniker) as SolanaClusterMoniker[];
}

/**
 * Validates if a string is a valid Solana cluster moniker
 * @param cluster - String to validate
 * @returns True if the cluster is a known Solana cluster
 */
export function isValidSolanaCluster(cluster: string): cluster is SolanaClusterMoniker {
  return cluster in defaultRpcUrlsByMoniker;
}
