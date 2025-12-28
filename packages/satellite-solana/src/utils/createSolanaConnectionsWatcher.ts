import {
  ConnectorType,
  formatConnectorName,
  getAdapterFromConnectorType,
  getConnectorTypeFromName,
  OrbitAdapter,
} from '@tuwaio/orbit-core';
import type { UiWallet } from '@wallet-standard/ui';

import { SolanaConnection } from '../types';

/**
 * Callback functions interface for the Solana connections watcher.
 * These callbacks are used to interact with the global state store.
 */
export interface SolanaWatcherCallbacks {
  /** The currently active Solana connection from the global store */
  activeConnection: SolanaConnection | undefined;
  /** Function to disconnect a specific connector type */
  disconnect: (connectorType: ConnectorType) => void;
  /** Current connection error state, if any */
  connectionError: string | undefined;
  /** Function to update the active connection's properties */
  updateActiveConnection: (connection: Partial<SolanaConnection>) => void;
}

/**
 * Configuration interface for the Solana connections watcher.
 */
export interface SolanaWatcherConfig {
  /** Array of available Solana wallets from the Wallet Standard */
  wallets: UiWallet[];
}

/**
 * Creates and initializes a Solana connections watcher that monitors wallet standard changes
 * and synchronizes them with the global state store.
 *
 * This function provides a pure, framework-agnostic way to watch Solana wallet connections
 * without being tied to React hooks or components.
 *
 * Unlike EVM connections, Solana uses the Wallet Standard which doesn't provide
 * native watchers, so this function implements the watching logic directly.
 *
 * @param config - Configuration object containing wallets array from Wallet Standard
 * @param callbacks - Callback functions for interacting with the global state
 * @returns A cleanup function to stop watching connections (currently a no-op as Wallet Standard doesn't provide native watchers)
 *
 * @example
 * ```typescript
 * const unwatch = createSolanaConnectionsWatcher(
 *   { wallets },
 *   { activeConnection, disconnect, connectionError, updateActiveConnection }
 * );
 *
 * // Later, when you need to stop watching (currently no cleanup needed):
 * unwatch();
 * ```
 *
 * @remarks
 * The Solana watcher works differently from the EVM watcher because:
 * - It relies on the Wallet Standard's wallets array changes
 * - It doesn't have native connection event listeners like wagmi
 * - The watching is done by comparing wallet state changes in the wallets array
 */
export function createSolanaConnectionsWatcher(
  config: SolanaWatcherConfig,
  callbacks: SolanaWatcherCallbacks,
): () => void {
  const { wallets } = config;
  const { activeConnection, disconnect, connectionError, updateActiveConnection } = callbacks;

  /**
   * Processes Solana wallet changes and updates the global store accordingly.
   * This function handles the core logic of monitoring Solana wallet state changes.
   *
   * @internal
   */
  const handleSolanaWalletChanges = (): void => {
    // Early return: Only process if we have an active Solana connection
    if (!activeConnection || getAdapterFromConnectorType(activeConnection.connectorType) !== OrbitAdapter.SOLANA) {
      return;
    }

    /**
     * Find the wallet that matches our active connection.
     * We compare by connector type which is derived from the wallet name.
     */
    const matchingWallet = wallets.find(
      (wallet) =>
        getConnectorTypeFromName(OrbitAdapter.SOLANA, formatConnectorName(wallet.name)) ===
        activeConnection.connectorType,
    );

    // Skip processing if there's a connection error to prevent conflicting updates
    if (!connectionError && matchingWallet) {
      /**
       * Build new connection state from the matching wallet.
       * We extract the first account as the active account.
       */
      const newState: Partial<SolanaConnection> = {
        // Use the first account's address as the primary address
        address: matchingWallet.accounts[0]?.address,
        // Determine connection status based on account availability
        isConnected: matchingWallet.accounts.length > 0,
        // Store Wallet Standard specific information for future use
        connectedAccount: matchingWallet.accounts[0],
        connectedWallet: matchingWallet,
      };

      /**
       * Prevent infinite update loops by only updating when state actually changes.
       * We only compare address and isConnected because connectedAccount/connectedWallet
       * might be new object references on every call, causing infinite loops.
       */
      const hasChanged =
        newState.address !== activeConnection.address || newState.isConnected !== activeConnection.isConnected;

      if (hasChanged) {
        // Update the global store with the new wallet state
        updateActiveConnection(newState);
      }
    }

    /**
     * Handle disconnection scenario:
     * If the wallet no longer has accounts but we still have an active connection,
     * we need to clean up the connection in our store.
     */
    if (matchingWallet?.accounts.length === 0 && activeConnection.connectorType) {
      // Trigger disconnection in the global store
      disconnect(activeConnection.connectorType);
    }
  };

  // Execute the initial wallet state processing
  handleSolanaWalletChanges();

  /**
   * Return a cleanup function.
   * Note: Unlike EVM watchers, Solana/Wallet Standard doesn't provide native
   * connection watchers, so we don't have any active subscriptions to clean up.
   * This function is provided for API consistency.
   */
  return (): void => {
    // Currently no cleanup is needed for Solana watchers
    // This is kept for future extensibility and API consistency
  };
}
