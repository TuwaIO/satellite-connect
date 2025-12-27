/**
 * This file contains utility functions for dynamically importing EVM-specific dependencies.
 * It allows the package to be used in Solana-only environments without requiring EVM dependencies.
 */

// Detect if we're in a bundler environment
export const IS_BUNDLER_ENV = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';

/**
 * Checks if the required EVM dependencies are available.
 * @returns A promise that resolves to a boolean indicating if the dependencies are available.
 */
export async function checkEvmDependencies(): Promise<boolean> {
  if (IS_BUNDLER_ENV) {
    try {
      // In a bundler environment, use Function constructor to avoid static analysis
      const checkImport = new Function(
        'try { return Boolean(require("@tuwaio/orbit-evm") && require("@tuwaio/satellite-evm") && require("@wagmi/core") && require("viem")); } catch { return false; }',
      );
      return checkImport();
    } catch {
      return false;
    }
  }

  try {
    // In a non-bundler environment, use dynamic imports
    await Promise.all([
      import('@tuwaio/orbit-evm'),
      import('@tuwaio/satellite-evm'),
      import('@wagmi/core'),
      import('viem'),
    ]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Dynamically imports and returns the EVM-specific exports.
 * @returns A promise that resolves to the EVM exports or null if the dependencies are not available.
 */
export async function getEvmExports() {
  try {
    // Check if dependencies are available before attempting to import
    const hasDependencies = await checkEvmDependencies();
    if (!hasDependencies) {
      console.warn('EVM dependencies are not available. EVM functionality will be disabled.');
      return null;
    }

    // Use Function constructor to avoid static analysis by bundlers
    const importEvmModule = new Function(
      'return import("./index.js").catch(error => { console.warn("Failed to load EVM exports:", error); return null; })',
    );

    const evmExports = await importEvmModule();
    return evmExports;
  } catch (error) {
    console.warn('Failed to load EVM exports:', error);
    return null;
  }
}
