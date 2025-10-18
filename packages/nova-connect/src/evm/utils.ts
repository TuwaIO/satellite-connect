import type { Chain } from 'viem/chains';

/**
 * Type guard to check if a value is a valid EVM chain ID
 */
function isValidEvmChainId(id: unknown): id is number {
  return id !== undefined && id !== null && typeof id === 'number' && id > 0;
}

/**
 * Get EVM chain IDs from app chains configuration
 */
export function getEvmChains(appChains?: readonly [Chain, ...Chain[]]): number[] {
  if (!appChains || appChains.length === 0) {
    return [];
  }

  return appChains.map((chain) => chain.id).filter(isValidEvmChainId);
}

/**
 * Type guard to check if a chain list contains EVM chain IDs
 */
export function isEvmChainList(chains: (string | number)[]): chains is number[] {
  return chains.length > 0 && chains.every((chain) => typeof chain === 'number');
}
