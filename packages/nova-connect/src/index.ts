import { OrbitAdapter } from '@tuwaio/orbit-core';

// Re-export core modules
export * from './components';
export {
  ConnectButtonCustomization,
  ConnectButtonData,
  ConnectButtonProps,
} from './components/ConnectButton/ConnectButton';
export * from './components/ConnectButton/ConnectedContent';
export * from './components/ConnectButton/StatusIcon';
export * from './components/ConnectButton/WaitForConnectionContent';
export * from './i18n/en';
export * from './i18n/types';
export * from './i18n/ua';
export * from './types';
export * from './utils';

// ========================================
// Modern Conditional Export System
// ========================================

/**
 * Information about available blockchain-specific utilities and their status.
 *
 * @interface BlockchainUtilities
 * @since 1.0.0
 *
 * @example
 * ```typescript
 * const utilities = await getBlockchainUtilities();
 *
 * if (utilities.hasEvmUtils) {
 *   console.log('EVM utilities are available');
 * }
 *
 * console.log('Adapter statuses:', utilities.adaptersStatus);
 * ```
 */
export interface BlockchainUtilities {
  /** Whether EVM utilities are available and loaded */
  hasEvmUtils: boolean;
  /** Whether Solana utilities are available and loaded */
  hasSolanaUtils: boolean;
  /** Current loading status of all registered adapters */
  adaptersStatus: Record<string, string>;
}

/**
 * Gets comprehensive information about available blockchain utilities and their loading status.
 * This function dynamically checks which blockchain adapters are available and their current state.
 *
 * @returns Promise resolving to blockchain utilities information
 *
 * @example
 * ```typescript
 * // Check what's available in your current setup
 * const info = await getBlockchainUtilities();
 *
 * if (info.hasEvmUtils && info.hasSolanaUtils) {
 *   console.log('Full multi-chain support available');
 * } else {
 *   console.log('Limited blockchain support:', info.adaptersStatus);
 * }
 * ```
 *
 * @since 1.0.0
 */
export async function getBlockchainUtilities(): Promise<BlockchainUtilities> {
  const { getAllAdaptersStatus } = await import('./utils/getChainsListByWalletType');

  return {
    hasEvmUtils: await checkEvmUtils(),
    hasSolanaUtils: await checkSolanaUtils(),
    adaptersStatus: getAllAdaptersStatus(),
  };
}

/**
 * Checks if EVM utilities are available by attempting to import them.
 * This function performs a dynamic import to determine availability without throwing errors.
 *
 * @internal
 * @returns Promise resolving to true if EVM utilities can be imported
 *
 * @since 1.0.0
 */
async function checkEvmUtils(): Promise<boolean> {
  try {
    await import('./evm/utils');
    return true;
  } catch {
    return false;
  }
}

/**
 * Checks if Solana utilities are available by attempting to import them.
 * This function performs a dynamic import to determine availability without throwing errors.
 *
 * @internal
 * @returns Promise resolving to true if Solana utilities can be imported
 *
 * @since 1.0.0
 */
async function checkSolanaUtils(): Promise<boolean> {
  try {
    await import('./solana/utils');
    return true;
  } catch {
    return false;
  }
}

// ========================================
// Blockchain-Specific Utility Exports
// ========================================

/**
 * Result type for blockchain utility loading operations.
 *
 * @template T The type of utilities being loaded
 *
 * @since 1.0.0
 */
export type BlockchainUtilityResult<T = any> = ({ available: true } & T) | { available: false; error: string };

/**
 * Dynamically loads EVM utilities if available in the current environment.
 * Returns the utilities along with their availability status.
 *
 * @returns Promise resolving to EVM utilities or error information
 *
 * @example
 * ```typescript
 * const evmUtils = await getEvmUtils();
 *
 * if (evmUtils.available) {
 *   // Use EVM-specific functions
 *   const chains = evmUtils.getEvmChains(appChains);
 *   console.log('Available EVM chains:', chains);
 * } else {
 *   console.warn('EVM not supported:', evmUtils.error);
 * }
 * ```
 *
 * @since 1.0.0
 */
export async function getEvmUtils(): Promise<BlockchainUtilityResult> {
  try {
    const evmModule = await import('./evm');
    return {
      available: true,
      ...evmModule,
    };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : 'EVM utilities not available',
    };
  }
}

/**
 * Dynamically loads Solana utilities if available in the current environment.
 * Returns the utilities along with their availability status.
 *
 * @returns Promise resolving to Solana utilities or error information
 *
 * @example
 * ```typescript
 * const solanaUtils = await getSolanaUtils();
 *
 * if (solanaUtils.available) {
 *   // Use Solana-specific functions
 *   const clusters = solanaUtils.getSolanaClusters(rpcUrls);
 *   console.log('Available Solana clusters:', clusters);
 * } else {
 *   console.warn('Solana not supported:', solanaUtils.error);
 * }
 * ```
 *
 * @since 1.0.0
 */
export async function getSolanaUtils(): Promise<BlockchainUtilityResult> {
  try {
    const solanaModule = await import('./solana');
    return {
      available: true,
      ...solanaModule,
    };
  } catch (error) {
    return {
      available: false,
      error: error instanceof Error ? error.message : 'Solana utilities not available',
    };
  }
}

// ========================================
// Initialization and Preloading
// ========================================

/**
 * Result of blockchain support initialization.
 *
 * @interface InitializationResult
 * @since 1.0.0
 */
export interface InitializationResult {
  /** Whether EVM support was successfully initialized */
  evm: boolean;
  /** Whether Solana support was successfully initialized */
  solana: boolean;
  /** Array of error messages encountered during initialization */
  errors: string[];
}

/**
 * Preloads and initializes all available blockchain adapters.
 * This function should be called during application startup for optimal performance.
 * It attempts to load both EVM and Solana adapters and reports which ones are available.
 *
 * @returns Promise resolving to initialization results
 *
 * @example
 * ```typescript
 * // Call during app initialization
 * const initResult = await initializeBlockchainSupport();
 *
 * if (initResult.evm && initResult.solana) {
 *   console.log('Full blockchain support initialized');
 * } else {
 *   console.log('Partial support:', initResult);
 *   if (initResult.errors.length > 0) {
 *     console.warn('Initialization errors:', initResult.errors);
 *   }
 * }
 * ```
 *
 * @since 1.0.0
 */
export async function initializeBlockchainSupport(): Promise<InitializationResult> {
  const results: InitializationResult = {
    evm: false,
    solana: false,
    errors: [],
  };

  try {
    const { preloadChainAdapters } = await import('./utils/getChainsListByWalletType');
    await preloadChainAdapters([OrbitAdapter.EVM, OrbitAdapter.SOLANA]);

    // Check what was successfully loaded
    results.evm = await checkEvmUtils();
    results.solana = await checkSolanaUtils();
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown initialization error';
    results.errors.push(errorMsg);
  }

  return results;
}

// ========================================
// Adapter Support Utilities
// ========================================

/**
 * Checks whether a specific blockchain adapter is supported in the current environment.
 * This function performs runtime checks to determine adapter availability.
 *
 * @param adapter The blockchain adapter to check for support
 * @returns Promise resolving to true if the adapter is supported
 *
 * @example
 * ```typescript
 * // Check individual adapter support
 * const evmSupported = await isAdapterSupported(OrbitAdapter.EVM);
 * const solanaSupported = await isAdapterSupported(OrbitAdapter.SOLANA);
 * const starknetSupported = await isAdapterSupported(OrbitAdapter.Starknet);
 *
 * console.log('Adapter support:', {
 *   evm: evmSupported,
 *   solana: solanaSupported,
 *   starknet: starknetSupported, // Currently always false
 * });
 * ```
 *
 * @since 1.0.0
 */
export async function isAdapterSupported(adapter: OrbitAdapter): Promise<boolean> {
  switch (adapter) {
    case OrbitAdapter.EVM:
      return checkEvmUtils();
    case OrbitAdapter.SOLANA:
      return checkSolanaUtils();
    case OrbitAdapter.Starknet:
      return false; // Not yet implemented
    default:
      return false;
  }
}

// ========================================
// Type Exports
// ========================================

/**
 * Re-export all blockchain-specific configuration types.
 * These types are enhanced through module augmentation when specific packages are installed.
 *
 * @since 1.0.0
 */
export type {
  AllChainConfigs,
  AllConnectors,
  AllWallets,
  ChainIdentifierArray,
  Connector,
  InitialChains,
  Wallet,
} from './types';
