import { OrbitAdapter } from '@tuwaio/orbit-core';

import { InitialChains } from '../types';

// Default fallback chain IDs
const DEFAULT_CHAIN_IDS = {
  [OrbitAdapter.EVM]: 1, // Ethereum Mainnet
  [OrbitAdapter.SOLANA]: 'mainnet',
  [OrbitAdapter.Starknet]: '0x534e5f4d41494e',
} as const;

/**
 * Basic interface for chain objects to handle the any type safely
 */
interface BasicChain {
  id: number | string;
  [key: string]: any;
}

/**
 * Gets the appropriate chain ID for connecting based on the selected adapter.
 * Returns the first available chain for the adapter, or a sensible default.
 *
 * @param params - Configuration object
 * @param params.selectedAdapter - The blockchain adapter to use
 * @param params.appChains - Available EVM chains
 * @param params.solanaRPCUrls - Available Solana networks
 * @returns Chain ID (number for EVM/Starknet, string for Solana)
 */
export function getConnectChainId({
  selectedAdapter,
  appChains,
  solanaRPCUrls,
}: { selectedAdapter: OrbitAdapter } & InitialChains): number | string {
  switch (selectedAdapter) {
    case OrbitAdapter.EVM: {
      // Return first available EVM chain or default to Ethereum
      const firstChain = appChains?.[0];
      if (firstChain?.id && typeof firstChain.id === 'number') {
        return firstChain.id;
      }

      if (process.env.NODE_ENV === 'development' && !appChains?.length) {
        console.warn('getConnectChainId: No EVM chains configured, using Ethereum Mainnet');
      }

      return DEFAULT_CHAIN_IDS[OrbitAdapter.EVM];
    }

    case OrbitAdapter.SOLANA: {
      // Return first available Solana network or default to mainnet
      if (solanaRPCUrls && typeof solanaRPCUrls === 'object') {
        const networks = Object.keys(solanaRPCUrls);
        if (networks.length > 0) {
          return networks[0];
        }
      }

      if (process.env.NODE_ENV === 'development' && !solanaRPCUrls) {
        console.warn('getConnectChainId: No Solana RPC URLs configured, using mainnet');
      }

      return DEFAULT_CHAIN_IDS[OrbitAdapter.SOLANA];
    }

    case OrbitAdapter.Starknet: {
      if (process.env.NODE_ENV === 'development') {
        console.info('getConnectChainId: Using default Starknet chain ID');
      }

      return DEFAULT_CHAIN_IDS[OrbitAdapter.Starknet];
    }

    default: {
      // Handle unknown adapter types gracefully
      if (process.env.NODE_ENV === 'development') {
        console.error('getConnectChainId: Unknown adapter:', selectedAdapter);
      }

      return DEFAULT_CHAIN_IDS[OrbitAdapter.EVM];
    }
  }
}

/**
 * Helper to get all available chain IDs for an adapter
 */
export function getAvailableChainIds({
  selectedAdapter,
  appChains,
  solanaRPCUrls,
}: { selectedAdapter: OrbitAdapter } & InitialChains): Array<number | string> {
  switch (selectedAdapter) {
    case OrbitAdapter.EVM:
      return appChains?.map((chain: BasicChain) => chain.id).filter(Boolean) ?? [DEFAULT_CHAIN_IDS[OrbitAdapter.EVM]];

    case OrbitAdapter.SOLANA:
      return solanaRPCUrls ? Object.keys(solanaRPCUrls) : [DEFAULT_CHAIN_IDS[OrbitAdapter.SOLANA]];

    case OrbitAdapter.Starknet:
      return [DEFAULT_CHAIN_IDS[OrbitAdapter.Starknet]];

    default:
      return [DEFAULT_CHAIN_IDS[OrbitAdapter.EVM]];
  }
}
