import { getAdapterFromWalletType, OrbitAdapter, WalletType } from '@tuwaio/orbit-core';

import { ChainIdentifierArray, InitialChains } from '../types';

/**
 * Parameters for getting chains list by wallet type
 */
interface GetChainsListParams extends InitialChains {
  /** The wallet type to get chains for */
  walletType: WalletType;
  /** Optional array of chain identifiers to filter by */
  chains?: ChainIdentifierArray;
}

/**
 * Type guard to check if a value is a valid chain ID (string or number, not null/undefined)
 */
function isValidChainId(id: unknown): id is string | number {
  return id !== undefined && id !== null && (typeof id === 'string' || typeof id === 'number');
}

/**
 * Safe type guard to check if a value is an array
 */
function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

/**
 * Safe type guard to check if a value is an array of strings
 */
function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

/**
 * Safe type guard to check if a value is a non-null object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object';
}

/**
 * Safely extracts chains from active wallet with proper type checking
 * @param activeWallet - The wallet object to extract chains from
 * @returns Array of chain identifiers or undefined if not found
 */
export function getWalletChains(activeWallet: any): (string | number)[] | undefined {
  // Check if wallet has connectedWallet property and it has chains
  if (
    activeWallet &&
    typeof activeWallet === 'object' &&
    'connectedWallet' in activeWallet &&
    activeWallet.connectedWallet &&
    typeof activeWallet.connectedWallet === 'object' &&
    'chains' in activeWallet.connectedWallet
  ) {
    const chains = activeWallet.connectedWallet.chains;
    // Validate chains is an array
    if (Array.isArray(chains)) {
      return chains;
    }
  }
  return undefined;
}

/**
 * Gets the list of available chains for a specific wallet type.
 * Automatically handles different blockchain adapters based on wallet type.
 * Now with enhanced safety for any types.
 *
 * @param params - Configuration object containing wallet type and chain information
 * @returns Array of chain identifiers available for the given wallet type
 */
export function getChainsListByWalletType(params: GetChainsListParams): (string | number)[] {
  const { walletType, chains = [], ...config } = params;

  // Early validation
  if (!walletType) {
    console.warn('getChainsListByWalletType: walletType is required');
    return [];
  }

  const adapterType = getAdapterFromWalletType(walletType);

  switch (adapterType) {
    case OrbitAdapter.EVM: {
      // Try to use EVM utils if available
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { getEvmChains } = require('./evm/utils');
        return getEvmChains(config.appChains);
      } catch {
        // Fallback for backward compatibility with safe type checking
        const appChains = config.appChains;
        if (!isArray(appChains) || appChains.length === 0) {
          return [];
        }

        return appChains
          .map((chain: unknown) => {
            // Safe extraction of chain ID
            if (isObject(chain) && 'id' in chain) {
              return chain.id;
            }
            // If it's already a valid chain ID, return as is
            if (isValidChainId(chain)) {
              return chain;
            }
            return null;
          })
          .filter(isValidChainId);
      }
    }

    case OrbitAdapter.SOLANA: {
      // Try to use Solana utils if available
      try {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { getSolanaClusters } = require('./solana/utils');
        return getSolanaClusters(config.solanaRPCUrls, chains);
      } catch {
        // Fallback for backward compatibility with safe type checking
        const solanaRPCUrls = config.solanaRPCUrls;
        if (isObject(solanaRPCUrls)) {
          return Object.keys(solanaRPCUrls);
        }
        return [];
      }
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

// Legacy compatibility functions with enhanced safety
export function isEvmChainList(chains: (string | number)[]): chains is number[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { isEvmChainList: evmCheck } = require('./evm/utils');
    return evmCheck(chains);
  } catch {
    return chains.length > 0 && chains.every((chain) => typeof chain === 'number');
  }
}

export function isSolanaChainList(chains: (string | number)[]): chains is string[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { isSolanaChainList: solanaCheck } = require('./solana/utils');
    return solanaCheck(chains);
  } catch {
    return chains.length > 0 && chains.every((chain) => typeof chain === 'string');
  }
}

// Re-export Solana utilities for backward compatibility
export function getAvailableSolanaClusters(): string[] {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getAvailableSolanaClusters } = require('./solana/utils');
    const result = getAvailableSolanaClusters();

    // Use the specific string array type guard
    if (isStringArray(result)) {
      return result;
    }

    // Fallback: if it's an array but not strings, try to convert
    if (isArray(result)) {
      return result.map(String).filter((item) => typeof item === 'string');
    }

    return [];
  } catch {
    return [];
  }
}

export function isValidSolanaCluster(cluster: string): boolean {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { isValidSolanaCluster } = require('./solana/utils');
    return Boolean(isValidSolanaCluster(cluster));
  } catch {
    return false;
  }
}
