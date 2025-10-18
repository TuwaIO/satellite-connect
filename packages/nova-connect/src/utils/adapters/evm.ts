import type { ChainAdapter } from './types';

/**
 * EVM utilities module interface for dynamic imports.
 *
 * @internal
 * @since 1.0.0
 */
interface EvmUtilsModule {
  getEvmChains?: (appChains: any) => (string | number)[];
  isEvmChainList?: (chains: (string | number)[]) => boolean;
}

/**
 * Dynamically imports and checks availability of EVM utilities.
 * This function attempts to load EVM-specific utilities without throwing errors
 * if the EVM package is not installed in the current environment.
 *
 * @internal
 * @returns Promise resolving to EVM utilities module or null if not available
 *
 * @example
 * ```typescript
 * const evmUtils = await getEvmUtils();
 * if (evmUtils?.getEvmChains) {
 *   const chains = evmUtils.getEvmChains(appChains);
 * }
 * ```
 *
 * @since 1.0.0
 */
async function getEvmUtils(): Promise<EvmUtilsModule | null> {
  try {
    // Dynamic import of EVM utilities - fails gracefully if package not installed
    const evmUtils = await import('../../evm/utils');
    return evmUtils;
  } catch (error) {
    console.warn('EVM utilities not available:', error);
    return null;
  }
}

/**
 * Creates an EVM chain adapter with dynamic loading and fallback support.
 *
 * This adapter provides EVM-specific functionality while gracefully handling
 * environments where EVM utilities are not available. It uses intelligent
 * fallbacks to ensure basic functionality even without the full EVM package.
 *
 * @returns Promise resolving to a configured EVM ChainAdapter
 *
 * @example
 * ```typescript
 * const adapter = await createEvmAdapter();
 *
 * // Get EVM chain IDs from app configuration
 * const chainIds = adapter.getChains([
 *   { id: 1, name: 'Ethereum' },
 *   { id: 137, name: 'Polygon' }
 * ]);
 * console.log(chainIds); // [1, 137]
 *
 * // Validate chain list format
 * const isValid = adapter.isChainList([1, 137, 56]);
 * console.log(isValid); // true (numeric IDs are valid for EVM)
 * ```
 *
 * @since 1.0.0
 */
export async function createEvmAdapter(): Promise<ChainAdapter> {
  const evmUtils = await getEvmUtils();

  return {
    /**
     * Extracts chain IDs from EVM app chain configuration.
     *
     * @param appChains Array of chain configurations or chain identifiers
     * @returns Array of chain IDs (numbers or strings)
     */
    getChains(appChains: any): (string | number)[] {
      // Use imported EVM utilities if available
      if (evmUtils?.getEvmChains) {
        return evmUtils.getEvmChains(appChains);
      }

      // Fallback implementation for basic chain extraction
      if (!Array.isArray(appChains) || appChains.length === 0) {
        return [];
      }

      return appChains
        .map((chain: any) => {
          // Handle chain objects with id property
          if (typeof chain === 'object' && chain?.id !== undefined) {
            return chain.id;
          }
          // Handle direct chain identifiers
          if (typeof chain === 'number' || typeof chain === 'string') {
            return chain;
          }
          return null;
        })
        .filter((id: any): id is string | number => id !== null && (typeof id === 'string' || typeof id === 'number'));
    },

    /**
     * Validates whether the provided chains list conforms to EVM chain format.
     * EVM chains are typically identified by numeric IDs.
     *
     * @param chains Array of chain identifiers to validate
     * @returns True if the chain list is valid for EVM
     */
    isChainList(chains: (string | number)[]): boolean {
      if (evmUtils?.isEvmChainList) {
        return evmUtils.isEvmChainList(chains);
      }

      // Fallback validation: EVM chains should be numbers
      return chains.length > 0 && chains.every((chain) => typeof chain === 'number');
    },
  };
}

/**
 * Checks if the EVM adapter can be created in the current environment.
 * This function verifies that the required EVM utilities are available
 * by attempting to import them.
 *
 * @returns Promise resolving to true if EVM adapter is available
 *
 * @example
 * ```typescript
 * const hasEvm = await isEvmAdapterAvailable();
 * if (hasEvm) {
 *   const adapter = await createEvmAdapter();
 *   // Use EVM functionality
 * } else {
 *   console.log('EVM support not available in this build');
 * }
 * ```
 *
 * @since 1.0.0
 */
export async function isEvmAdapterAvailable(): Promise<boolean> {
  try {
    await import('../../evm/utils');
    return true;
  } catch {
    return false;
  }
}
