/**
 * This file contains utility functions for dynamically importing Solana-specific dependencies.
 * It allows the package to be used in EVM-only environments without requiring Solana dependencies.
 */

// Detect if we're in a bundler environment
export const IS_BUNDLER_ENV = typeof process !== 'undefined' && process.env?.NODE_ENV === 'production';

/**
 * Checks if the required Solana dependencies are available.
 * @returns A promise that resolves to a boolean indicating if the dependencies are available.
 */
export async function checkSolanaDependencies(): Promise<boolean> {
  if (IS_BUNDLER_ENV) {
    try {
      // In a bundler environment, use Function constructor to avoid static analysis
      const checkImport = new Function(
        'try { return Boolean(require("@tuwaio/orbit-solana") && require("@tuwaio/satellite-solana") && require("@wallet-standard/react") && require("gill")); } catch { return false; }',
      );
      return checkImport();
    } catch {
      return false;
    }
  }

  try {
    // In a non-bundler environment, use dynamic imports
    await Promise.all([
      import('@tuwaio/orbit-solana'),
      import('@tuwaio/satellite-solana'),
      import('@wallet-standard/react'),
      import('gill'),
    ]);
    return true;
  } catch {
    return false;
  }
}

/**
 * Dynamically imports and returns the Solana-specific exports.
 * @returns A promise that resolves to the Solana exports or null if the dependencies are not available.
 */
export async function getSolanaExports() {
  try {
    // Check if dependencies are available before attempting to import
    const hasDependencies = await checkSolanaDependencies();
    if (!hasDependencies) {
      console.warn('Solana dependencies are not available. Solana functionality will be disabled.');
      return null;
    }

    // Use Function constructor to avoid static analysis by bundlers
    const importSolanaModule = new Function(
      'return import("./index.js").catch(error => { console.warn("Failed to load Solana exports:", error); return null; })',
    );

    const solanaExports = await importSolanaModule();
    return solanaExports;
  } catch (error) {
    console.warn('Failed to load Solana exports:', error);
    return null;
  }
}
