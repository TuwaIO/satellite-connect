import { getAdapterFromWalletType, OrbitAdapter, WalletType } from '@tuwaio/orbit-core';

import { ChainIdentifierArray, InitialChains } from '../types';
import { adapterRegistry } from './adapters/registry';

/**
 * Parameters for retrieving chain lists based on wallet configuration.
 *
 * Combines chain configuration with wallet-specific requirements to determine
 * which chains should be available for a given wallet type.
 *
 * @interface GetChainsListParams
 * @extends InitialChains
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const params: GetChainsListParams = {
 *   walletType: WalletType.EVM_METAMASK,
 *   appChains: [
 *     { id: 1, name: 'Ethereum' },
 *     { id: 137, name: 'Polygon' }
 *   ],
 *   chains: [1, 137] // Optional filter
 * };
 * ```
 */
interface GetChainsListParams extends InitialChains {
  /** The wallet type to determine chain compatibility */
  walletType: WalletType;
  /** Optional array of specific chain identifiers to filter or validate */
  chains?: ChainIdentifierArray;
}

/**
 * Type guard that validates if a value represents a valid chain identifier.
 *
 * Chain identifiers can be strings (for Solana clusters) or numbers (for EVM chain IDs).
 * This function filters out null, undefined, and other invalid values.
 *
 * @param id - Value to check for validity as chain identifier
 * @returns True if the value is a valid string or number chain ID
 *
 * @example
 * ```typescript
 * const rawChains = [1, 'mainnet-beta', null, undefined, 137];
 * const validChains = rawChains.filter(isValidChainId);
 * // Result: [1, 'mainnet-beta', 137]
 * ```
 *
 * @since 1.0.0
 */
function isValidChainId(id: unknown): id is string | number {
  return id !== undefined && id !== null && (typeof id === 'string' || typeof id === 'number');
}

/**
 * Retrieves chain list for a specific wallet type with automatic adapter loading.
 *
 * This is the primary function for getting blockchain-compatible chains based on
 * wallet type and configuration. It automatically determines the correct adapter,
 * loads it if necessary, and falls back to safe defaults if loading fails.
 *
 * The function supports all major blockchain types:
 * - EVM chains: Returns numeric chain IDs from app configuration
 * - Solana clusters: Returns string cluster names from RPC configuration
 * - Future blockchains: Extensible through the adapter pattern
 *
 * @param params - Configuration object with wallet type and chain data
 * @returns Promise resolving to array of chain identifiers
 *
 * @example
 * ```typescript
 * // Get EVM chains for MetaMask
 * const evmChains = await getChainsListByWalletType({
 *   walletType: WalletType.EVM_METAMASK,
 *   appChains: [
 *     { id: 1, name: 'Ethereum' },
 *     { id: 137, name: 'Polygon' }
 *   ]
 * });
 * // Returns: [1, 137]
 *
 * // Get Solana clusters for Phantom
 * const solanaClusters = await getChainsListByWalletType({
 *   walletType: WalletType.SOLANA_PHANTOM,
 *   solanaRPCUrls: {
 *     'mainnet-beta': 'https://api.mainnet-beta.solana.com',
 *     'devnet': 'https://api.devnet.solana.com'
 *   }
 * });
 * // Returns: ['mainnet-beta', 'devnet']
 * ```
 *
 * @since 1.0.0
 */
export async function getChainsListByWalletType(params: GetChainsListParams): Promise<(string | number)[]> {
  const { walletType, chains = [], ...config } = params;

  if (!walletType) {
    console.warn('getChainsListByWalletType: walletType is required');
    return [];
  }

  const adapterType = getAdapterFromWalletType(walletType);
  const adapter = await adapterRegistry.getAdapter(adapterType);

  if (!adapter) {
    console.warn(`No adapter available for ${adapterType}, using fallback`);
    return getFallbackChains(adapterType, config);
  }

  try {
    if (adapterType === OrbitAdapter.SOLANA) {
      return adapter.getChains(config.solanaRPCUrls, chains);
    } else {
      return adapter.getChains(config.appChains);
    }
  } catch (error) {
    console.warn(`Error getting chains for ${adapterType}:`, error);
    return getFallbackChains(adapterType, config);
  }
}

/**
 * Synchronous version that only works with pre-loaded adapters.
 *
 * This function provides immediate results by using only adapters that have
 * already been loaded into the registry cache. It will not trigger new
 * loading operations, making it safe for synchronous contexts but potentially
 * less complete than the async version.
 *
 * Use this function when:
 * - You've pre-loaded adapters during app initialization
 * - You need immediate results without async overhead
 * - You're in a synchronous context where async calls aren't feasible
 *
 * @param params - Configuration object with wallet type and chain data
 * @returns Array of chain identifiers (empty if adapter not loaded)
 *
 * @example
 * ```typescript
 * // Pre-load adapters first
 * await preloadChainAdapters([OrbitAdapter.EVM, OrbitAdapter.SOLANA]);
 *
 * // Now safe to use sync version
 * const chains = getChainsListByWalletTypeSync({
 *   walletType: WalletType.EVM_METAMASK,
 *   appChains: evmConfiguration
 * });
 * ```
 *
 * @since 1.0.0
 */
export function getChainsListByWalletTypeSync(params: GetChainsListParams): (string | number)[] {
  const { walletType, chains = [], ...config } = params;

  if (!walletType) {
    console.warn('getChainsListByWalletType: walletType is required');
    return [];
  }

  const adapterType = getAdapterFromWalletType(walletType);
  const adapter = adapterRegistry.getLoadedAdapter(adapterType);

  if (adapter) {
    try {
      if (adapterType === OrbitAdapter.SOLANA) {
        return adapter.getChains(config.solanaRPCUrls, chains);
      } else {
        return adapter.getChains(config.appChains);
      }
    } catch (error) {
      console.warn(`Error with loaded adapter for ${adapterType}:`, error);
    }
  }

  return getFallbackChains(adapterType, config);
}

/**
 * Provides fallback chain extraction without external dependencies.
 *
 * This function implements basic chain extraction logic that works without
 * requiring blockchain-specific packages to be installed. It provides a
 * safety net when adapters fail to load or aren't available.
 *
 * Fallback behaviors:
 * - EVM: Extracts `id` field from chain objects or direct identifiers
 * - Solana: Extracts keys from RPC URL configuration objects
 * - Unknown: Returns empty array
 *
 * @private
 * @param adapterType - The blockchain adapter type
 * @param config - Configuration object containing chain data
 * @returns Array of extracted chain identifiers
 *
 * @since 1.0.0
 */
function getFallbackChains(adapterType: OrbitAdapter, config: any): (string | number)[] {
  switch (adapterType) {
    case OrbitAdapter.EVM: {
      const appChains = config.appChains;
      if (!Array.isArray(appChains)) return [];

      return appChains
        .map((chain: any) => {
          // Handle chain objects with id property (e.g., { id: 1, name: 'Ethereum' })
          if (typeof chain === 'object' && chain?.id) return chain.id;
          // Handle direct chain identifiers (numbers or strings)
          if (typeof chain === 'number' || typeof chain === 'string') return chain;
          return null;
        })
        .filter(isValidChainId);
    }
    case OrbitAdapter.SOLANA: {
      const solanaRPCUrls = config.solanaRPCUrls;
      // Extract cluster names from RPC URL configuration
      return solanaRPCUrls && typeof solanaRPCUrls === 'object' ? Object.keys(solanaRPCUrls) : [];
    }
    default:
      return [];
  }
}

// ========================================
// Chain List Validation Functions
// ========================================

/**
 * Validates if a chain list conforms to EVM format (with adapter loading).
 *
 * Uses the EVM adapter to perform comprehensive validation, falling back to
 * basic type checking if the adapter isn't available. EVM chains typically
 * use numeric identifiers.
 *
 * @param chains - Array of chain identifiers to validate
 * @returns Promise resolving to true if chains are valid for EVM
 *
 * @example
 * ```typescript
 * const isEvm = await isEvmChainList([1, 137, 56]); // true
 * const notEvm = await isEvmChainList(['mainnet-beta']); // false
 * ```
 *
 * @since 1.0.0
 */
export async function isEvmChainList(chains: (string | number)[]): Promise<boolean> {
  const adapter = await adapterRegistry.getAdapter(OrbitAdapter.EVM);
  return adapter?.isChainList(chains) ?? chains.every((chain) => typeof chain === 'number');
}

/**
 * Validates if a chain list conforms to Solana format (with adapter loading).
 *
 * Uses the Solana adapter to perform comprehensive validation, falling back to
 * basic type checking if the adapter isn't available. Solana chains typically
 * use string cluster names.
 *
 * @param chains - Array of chain identifiers to validate
 * @returns Promise resolving to true if chains are valid for Solana
 *
 * @example
 * ```typescript
 * const isSolana = await isSolanaChainList(['mainnet-beta', 'devnet']); // true
 * const notSolana = await isSolanaChainList([1, 137]); // false
 * ```
 *
 * @since 1.0.0
 */
export async function isSolanaChainList(chains: (string | number)[]): Promise<boolean> {
  const adapter = await adapterRegistry.getAdapter(OrbitAdapter.SOLANA);
  return adapter?.isChainList(chains) ?? chains.every((chain) => typeof chain === 'string');
}

/**
 * Synchronous EVM chain list validation using pre-loaded adapters.
 *
 * Provides immediate validation results without triggering adapter loading.
 * Falls back to basic type checking if adapter isn't pre-loaded.
 *
 * @param chains - Array of chain identifiers to validate
 * @returns True if chains are valid for EVM
 *
 * @example
 * ```typescript
 * const isEvm = isEvmChainListSync([1, 137, 56]); // true (immediate result)
 * ```
 *
 * @since 1.0.0
 */
export function isEvmChainListSync(chains: (string | number)[]): boolean {
  const adapter = adapterRegistry.getLoadedAdapter(OrbitAdapter.EVM);
  return adapter?.isChainList(chains) ?? chains.every((chain) => typeof chain === 'number');
}

/**
 * Synchronous Solana chain list validation using pre-loaded adapters.
 *
 * Provides immediate validation results without triggering adapter loading.
 * Falls back to basic type checking if adapter isn't pre-loaded.
 *
 * @param chains - Array of chain identifiers to validate
 * @returns True if chains are valid for Solana
 *
 * @example
 * ```typescript
 * const isSolana = isSolanaChainListSync(['mainnet-beta', 'devnet']); // true
 * ```
 *
 * @since 1.0.0
 */
export function isSolanaChainListSync(chains: (string | number)[]): boolean {
  const adapter = adapterRegistry.getLoadedAdapter(OrbitAdapter.SOLANA);
  return adapter?.isChainList(chains) ?? chains.every((chain) => typeof chain === 'string');
}

// ========================================
// Solana-Specific Utilities
// ========================================

/**
 * Retrieves all available Solana clusters from the current configuration.
 *
 * This function loads the Solana adapter and queries it for all configured
 * cluster names. Useful for populating UI dropdowns or validating cluster
 * availability before connection attempts.
 *
 * @returns Promise resolving to array of available cluster names
 *
 * @example
 * ```typescript
 * const clusters = await getAvailableSolanaClusters();
 * console.log('Available clusters:', clusters);
 * // Might log: ['mainnet-beta', 'devnet', 'testnet', 'localnet']
 *
 * // Use for UI population
 * const clusterOptions = clusters.map(cluster => ({
 *   value: cluster,
 *   label: cluster.replace('-', ' ').toUpperCase()
 * }));
 * ```
 *
 * @since 1.0.0
 */
export async function getAvailableSolanaClusters(): Promise<string[]> {
  const adapter = await adapterRegistry.getAdapter(OrbitAdapter.SOLANA);
  return adapter?.getAvailableClusters?.() ?? [];
}

/**
 * Validates whether a cluster name is valid for Solana connections.
 *
 * This function loads the Solana adapter and uses it to validate cluster
 * names against known Solana cluster monikers and custom configurations.
 *
 * @param cluster - Cluster name to validate
 * @returns Promise resolving to true if cluster is valid
 *
 * @example
 * ```typescript
 * const isValid = await isValidSolanaCluster('mainnet-beta'); // true
 * const isInvalid = await isValidSolanaCluster('invalid-cluster'); // false
 *
 * // Use for form validation
 * if (await isValidSolanaCluster(userInput)) {
 *   // Proceed with connection
 * } else {
 *   // Show error message
 * }
 * ```
 *
 * @since 1.0.0
 */
export async function isValidSolanaCluster(cluster: string): Promise<boolean> {
  const adapter = await adapterRegistry.getAdapter(OrbitAdapter.SOLANA);
  return adapter?.isValidCluster?.(cluster) ?? false;
}

// ========================================
// Wallet Chain Extraction Utilities
// ========================================

/**
 * Safely extracts chain information from a wallet object.
 *
 * This utility function handles the complex nested structure of wallet objects
 * and safely extracts chain information without throwing errors. It performs
 * comprehensive type checking to ensure data integrity.
 *
 * The function expects wallet objects with this structure:
 * ```
 * {
 *   connectedWallet: {
 *     chains: [chain1, chain2, ...]
 *   }
 * }
 * ```
 *
 * @param activeWallet - Wallet object to extract chains from
 * @returns Array of chain identifiers or undefined if not found/invalid
 *
 * @example
 * ```typescript
 * // With valid wallet structure
 * const wallet = {
 *   connectedWallet: {
 *     chains: [1, 137, 56]
 *   }
 * };
 * const chains = getWalletChains(wallet); // [1, 137, 56]
 *
 * // With invalid/missing structure
 * const invalidWallet = { someOtherProperty: true };
 * const noChains = getWalletChains(invalidWallet); // undefined
 *
 * // Use in conditional logic
 * const walletChains = getWalletChains(activeWallet);
 * if (walletChains) {
 *   console.log('Wallet supports chains:', walletChains);
 * }
 * ```
 *
 * @since 1.0.0
 */
export function getWalletChains(activeWallet: any): (string | number)[] | undefined {
  if (
    activeWallet &&
    typeof activeWallet === 'object' &&
    'connectedWallet' in activeWallet &&
    activeWallet.connectedWallet &&
    typeof activeWallet.connectedWallet === 'object' &&
    'chains' in activeWallet.connectedWallet
  ) {
    const chains = activeWallet.connectedWallet.chains;
    if (Array.isArray(chains)) {
      return chains;
    }
  }
  return undefined;
}

// ========================================
// Adapter Management Utilities
// ========================================

/**
 * Pre-loads blockchain adapters for improved application performance.
 *
 * This function should be called during application initialization to load
 * commonly used adapters ahead of time. This eliminates loading delays when
 * users first interact with wallet connections.
 *
 * All loading operations run concurrently for maximum efficiency, and the
 * function completes even if some adapters fail to load (partial success).
 *
 * @param types - Array of adapter types to preload (defaults to EVM and Solana)
 * @returns Promise that resolves when all loading attempts complete
 *
 * @example
 * ```typescript
 * // During app initialization
 * export async function initializeApp() {
 *   // Preload common adapters
 *   await preloadChainAdapters([OrbitAdapter.EVM, OrbitAdapter.SOLANA]);
 *
 *   // Continue with other initialization
 *   // ...
 * }
 *
 * // Later usage will be instant for loaded adapters
 * const evmChains = getChainsListByWalletTypeSync({
 *   walletType: WalletType.EVM_METAMASK,
 *   appChains: configuration
 * }); // Instant result since adapter is pre-loaded
 * ```
 *
 * @since 1.0.0
 */
export async function preloadChainAdapters(
  types: OrbitAdapter[] = [OrbitAdapter.EVM, OrbitAdapter.SOLANA],
): Promise<void> {
  await adapterRegistry.preloadAdapters(types);
}

/**
 * Gets the current loading status of a specific adapter.
 *
 * Returns the current state of an adapter in the loading lifecycle. Useful
 * for UI indicators, debugging, or conditional logic based on adapter
 * availability.
 *
 * @param type - The adapter type to check
 * @returns Current loading status of the adapter
 *
 * @example
 * ```typescript
 * const evmStatus = getAdapterStatus(OrbitAdapter.EVM);
 *
 * switch (evmStatus) {
 *   case 'idle':
 *     console.log('EVM adapter not yet requested');
 *     break;
 *   case 'loading':
 *     // Show loading spinner
 *     break;
 *   case 'loaded':
 *     // Enable EVM features
 *     break;
 *   case 'error':
 *     // Show fallback UI
 *     break;
 * }
 * ```
 *
 * @since 1.0.0
 */
export function getAdapterStatus(type: OrbitAdapter) {
  return adapterRegistry.getAdapterStatus(type);
}

/**
 * Gets comprehensive status information for all registered adapters.
 *
 * Returns a complete overview of all adapter states, useful for debugging,
 * monitoring, or displaying system status in admin interfaces.
 *
 * @returns Record mapping adapter types to their current loading status
 *
 * @example
 * ```typescript
 * const allStatuses = getAllAdaptersStatus();
 * console.log('System overview:', allStatuses);
 * // Output: { "evm": "loaded", "solana": "loading", "starknet": "idle" }
 *
 * // Use for system health monitoring
 * const loadedAdapters = Object.entries(allStatuses)
 *   .filter(([_, status]) => status === 'loaded')
 *   .map(([type, _]) => type);
 *
 * console.log('Available blockchain support:', loadedAdapters);
 * ```
 *
 * @since 1.0.0
 */
export function getAllAdaptersStatus() {
  return adapterRegistry.getAdaptersInfo();
}
