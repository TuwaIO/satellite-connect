// Core exports that are always available
export * from './hooks/satelliteHook';
export * from './hooks/useInitializeAutoConnect';
export * from './providers/SatelliteConnectProvider';
export * from './types';

// Dynamic imports for blockchain-specific modules
import { getEvmExports } from './evm/dynamicImports';
import { getSolanaExports } from './solana/dynamicImports';

// Detect if we're in a bundler environment
export const IS_BUNDLER_ENV = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';

/**
 * Dynamically loads and initializes blockchain-specific modules.
 * This function should be called at the application entry point.
 *
 * @returns A promise that resolves when all modules are loaded.
 */
export async function initializeSatelliteReact() {
  try {
    // Load EVM module if dependencies are available
    const evmExports = await getEvmExports();
    if (evmExports) {
      Object.assign(exports, evmExports);
    }

    // Load Solana module if dependencies are available
    const solanaExports = await getSolanaExports();
    if (solanaExports) {
      Object.assign(exports, solanaExports);
    }
  } catch (error) {
    console.warn('Error initializing satellite-react:', error);
  }
}

// Auto-initialize in non-bundler environments
if (!IS_BUNDLER_ENV) {
  initializeSatelliteReact().catch(console.error);
}
