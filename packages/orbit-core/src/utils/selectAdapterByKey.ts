/**
 * @file
 * This module provides adapter selection functionality for the Orbit system.
 * Part of the core infrastructure for managing blockchain adapters.
 */

import { OrbitAdapter, OrbitGenericAdapter } from '../types';

/**
 * Selects an appropriate adapter based on the provided key from either a single adapter
 * or an array of adapters.
 *
 * @typeParam A - Type extending basic adapter interface with a key property
 *
 * @param options - Selection configuration object
 * @param options.adapterKey - Target adapter key to search for
 * @param options.adapter - Single adapter or array of adapters to search within
 *
 * @returns Selected adapter or undefined if no suitable adapter found
 *
 * @remarks
 * If an array is provided but no matching adapter is found, falls back to the first adapter
 * in the array with a warning message.
 *
 * @example
 * ```typescript
 * // Single adapter usage
 * const singleResult = selectAdapterByKey({
 *   adapterKey: OrbitAdapter.SOLANA,
 *   adapter: { key: OrbitAdapter.SOLANA, connect: async () => {...} }
 * });
 *
 * // Multiple adapters usage
 * const multiResult = selectAdapterByKey({
 *   adapterKey: OrbitAdapter.EVM,
 *   adapter: [
 *     { key: OrbitAdapter.SOLANA, connect: async () => {...} },
 *     { key: OrbitAdapter.EVM, connect: async () => {...} }
 *   ]
 * });
 * ```
 *
 * @throws {Error} Logs error if adapter array is empty
 * @throws {Warning} Logs warning if requested adapter key not found in array
 */
export const selectAdapterByKey = <A extends { key: OrbitAdapter }>({
  adapterKey,
  adapter,
}: { adapterKey: OrbitAdapter } & OrbitGenericAdapter<A>): A | undefined => {
  if (Array.isArray(adapter)) {
    if (adapter.length === 0) {
      console.error('Adapter selection failed: The provided adapters array is empty.');
      return undefined;
    }

    const foundAdapter = adapter.find((a) => a.key === adapterKey);

    if (foundAdapter) {
      return foundAdapter;
    } else {
      console.warn(
        `No adapter found for key: "${adapterKey}". Falling back to the first available adapter: "${adapter[0].key}".`,
      );
      return adapter[0];
    }
  }
  return adapter;
};
