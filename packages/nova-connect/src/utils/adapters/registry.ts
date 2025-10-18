import { OrbitAdapter } from '@tuwaio/orbit-core';

import type { AdapterInfo, AdapterLoadStatus, ChainAdapter } from './types';

/**
 * Registry for blockchain adapters with lazy loading and intelligent caching.
 *
 * This class manages the lifecycle of blockchain adapters, providing:
 * - Lazy loading of adapters only when needed
 * - Intelligent caching to avoid redundant loads
 * - Graceful error handling and retry logic
 * - Thread-safe loading with concurrent request handling
 *
 * @internal
 * @since 1.0.0
 */
class LazyAdapterRegistry {
  /**
   * Internal cache mapping adapter types to their loading information.
   * @private
   */
  private adapters = new Map<OrbitAdapter, AdapterInfo>();

  /**
   * Gets an adapter with automatic loading and caching.
   *
   * This method implements intelligent loading logic:
   * - Returns immediately if adapter is already loaded
   * - Waits for completion if adapter is currently loading
   * - Retries loading if previous attempt failed
   * - Initiates new load if adapter hasn't been requested before
   *
   * @param type The blockchain adapter type to retrieve
   * @returns Promise resolving to the loaded adapter or null if unavailable
   *
   * @example
   * ```typescript
   * const evmAdapter = await registry.getAdapter(OrbitAdapter.EVM);
   * if (evmAdapter) {
   *   const chains = evmAdapter.getChains(appChains);
   * }
   * ```
   *
   * @since 1.0.0
   */
  async getAdapter(type: OrbitAdapter): Promise<ChainAdapter | null> {
    const info = this.adapters.get(type);

    // Return cached adapter if already loaded
    if (info?.status === 'loaded' && info.adapter) {
      return info.adapter;
    }

    // Wait for completion if currently loading
    if (info?.status === 'loading') {
      return this.waitForAdapter(type);
    }

    // Retry loading if previous attempt failed
    if (info?.status === 'error') {
      console.warn(`Retrying to load ${type} adapter after previous error`);
    }

    // Start new loading process
    return this.loadAdapter(type);
  }

  /**
   * Loads a specific adapter with error handling and state management.
   *
   * @private
   * @param type The adapter type to load
   * @returns Promise resolving to the loaded adapter or null on failure
   *
   * @since 1.0.0
   */
  private async loadAdapter(type: OrbitAdapter): Promise<ChainAdapter | null> {
    // Set loading status to prevent concurrent loads
    this.adapters.set(type, { status: 'loading' });

    try {
      let adapter: ChainAdapter;

      switch (type) {
        case OrbitAdapter.EVM: {
          const { createEvmAdapter } = await import('./evm');
          adapter = await createEvmAdapter();
          break;
        }
        case OrbitAdapter.SOLANA: {
          const { createSolanaAdapter } = await import('./solana');
          adapter = await createSolanaAdapter();
          break;
        }
        case OrbitAdapter.Starknet: {
          // Future implementation placeholder
          console.warn('Starknet adapter not implemented yet');
          this.adapters.set(type, {
            status: 'error',
            error: new Error('Starknet adapter not yet implemented'),
          });
          return null;
        }
        default: {
          const error = new Error(`Unknown adapter type: ${type}`);
          this.adapters.set(type, { status: 'error', error });
          return null;
        }
      }

      // Mark as successfully loaded
      this.adapters.set(type, { status: 'loaded', adapter });
      return adapter;
    } catch (error) {
      const err = error instanceof Error ? error : new Error(`Failed to load ${type} adapter`);
      console.warn(`Failed to load ${type} adapter:`, err);
      this.adapters.set(type, { status: 'error', error: err });
      return null;
    }
  }

  /**
   * Waits for an adapter that's currently loading to complete.
   *
   * Implements polling with timeout to handle concurrent loading requests.
   * Multiple calls to getAdapter() for the same type will wait for a single
   * loading operation to complete rather than starting multiple loads.
   *
   * @private
   * @param type The adapter type to wait for
   * @returns Promise resolving to the loaded adapter or null on timeout/error
   *
   * @since 1.0.0
   */
  private async waitForAdapter(type: OrbitAdapter): Promise<ChainAdapter | null> {
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds with 100ms intervals
    const pollInterval = 100; // milliseconds

    while (attempts < maxAttempts) {
      const info = this.adapters.get(type);

      if (info?.status === 'loaded' && info.adapter) {
        return info.adapter;
      }

      if (info?.status === 'error') {
        return null;
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
      attempts++;
    }

    console.warn(`Timeout waiting for ${type} adapter to load after ${maxAttempts * pollInterval}ms`);
    return null;
  }

  /**
   * Synchronously retrieves an already loaded adapter.
   *
   * This method only returns adapters that have been successfully loaded
   * and cached. It will not trigger loading of new adapters.
   *
   * @param type The adapter type to retrieve
   * @returns The loaded adapter or null if not available/loaded
   *
   * @example
   * ```typescript
   * // Check if adapter is already loaded
   * const adapter = registry.getLoadedAdapter(OrbitAdapter.EVM);
   * if (adapter) {
   *   // Use immediately without waiting
   *   const isValid = adapter.isChainList([1, 137]);
   * }
   * ```
   *
   * @since 1.0.0
   */
  getLoadedAdapter(type: OrbitAdapter): ChainAdapter | null {
    const info = this.adapters.get(type);
    return info?.status === 'loaded' ? info.adapter || null : null;
  }

  /**
   * Gets the current loading status of a specific adapter.
   *
   * @param type The adapter type to check
   * @returns Current status of the adapter
   *
   * @example
   * ```typescript
   * const status = registry.getAdapterStatus(OrbitAdapter.EVM);
   * console.log(`EVM adapter status: ${status}`);
   * // Possible values: 'idle', 'loading', 'loaded', 'error'
   * ```
   *
   * @since 1.0.0
   */
  getAdapterStatus(type: OrbitAdapter): AdapterLoadStatus {
    return this.adapters.get(type)?.status || 'idle';
  }

  /**
   * Checks if an adapter is available by attempting to load it.
   *
   * @param type The adapter type to check for availability
   * @returns Promise resolving to true if adapter can be loaded successfully
   *
   * @example
   * ```typescript
   * const hasEvm = await registry.isAdapterAvailable(OrbitAdapter.EVM);
   * const hasSolana = await registry.isAdapterAvailable(OrbitAdapter.SOLANA);
   *
   * if (hasEvm && hasSolana) {
   *   console.log('Multi-chain support available');
   * }
   * ```
   *
   * @since 1.0.0
   */
  async isAdapterAvailable(type: OrbitAdapter): Promise<boolean> {
    const adapter = await this.getAdapter(type);
    return adapter !== null;
  }

  /**
   * Preloads multiple adapters for improved performance.
   *
   * This method is useful for application initialization to load commonly
   * used adapters ahead of time. All loading operations run concurrently.
   *
   * @param types Array of adapter types to preload (defaults to EVM and Solana)
   * @returns Promise that resolves when all loading attempts complete
   *
   * @example
   * ```typescript
   * // Preload during app startup
   * await registry.preloadAdapters([OrbitAdapter.EVM, OrbitAdapter.SOLANA]);
   *
   * // Later usage will be instant for loaded adapters
   * const evmAdapter = registry.getLoadedAdapter(OrbitAdapter.EVM);
   * ```
   *
   * @since 1.0.0
   */
  async preloadAdapters(types: OrbitAdapter[] = [OrbitAdapter.EVM, OrbitAdapter.SOLANA]): Promise<void> {
    // Use Promise.allSettled to continue even if some adapters fail
    await Promise.allSettled(types.map((type) => this.getAdapter(type)));
  }

  /**
   * Clears all cached adapters and resets the registry state.
   *
   * This method is useful for testing scenarios or when you need to
   * force reload of all adapters (e.g., after configuration changes).
   *
   * @example
   * ```typescript
   * // Clear cache to force reload
   * registry.clearCache();
   *
   * // Next getAdapter() call will reload from scratch
   * const adapter = await registry.getAdapter(OrbitAdapter.EVM);
   * ```
   *
   * @since 1.0.0
   */
  clearCache(): void {
    this.adapters.clear();
  }

  /**
   * Gets comprehensive information about all registered adapters.
   *
   * @returns Record mapping adapter types to their current loading status
   *
   * @example
   * ```typescript
   * const info = registry.getAdaptersInfo();
   * console.log('Adapter status overview:', info);
   * // Output: { "evm": "loaded", "solana": "loading", "starknet": "idle" }
   *
   * // Check specific status
   * if (info.evm === 'loaded') {
   *   console.log('EVM adapter ready for use');
   * }
   * ```
   *
   * @since 1.0.0
   */
  getAdaptersInfo(): Record<string, AdapterLoadStatus> {
    const info: Record<string, AdapterLoadStatus> = {};
    for (const [type, adapterInfo] of this.adapters.entries()) {
      info[type] = adapterInfo.status;
    }
    return info;
  }
}

/**
 * Global singleton instance of the adapter registry.
 *
 * This is the primary interface for accessing blockchain adapters throughout
 * the application. The registry handles all loading, caching, and lifecycle
 * management automatically.
 *
 * @example
 * ```typescript
 * import { adapterRegistry } from './registry';
 *
 * // Get an adapter (loads if needed)
 * const evmAdapter = await adapterRegistry.getAdapter(OrbitAdapter.EVM);
 *
 * // Check loading status
 * const status = adapterRegistry.getAdapterStatus(OrbitAdapter.EVM);
 *
 * // Preload adapters during initialization
 * await adapterRegistry.preloadAdapters();
 * ```
 *
 * @since 1.0.0
 */
export const adapterRegistry = new LazyAdapterRegistry();
