import {
  ConnectorType,
  formatConnectorName,
  getAdapterFromConnectorType,
  getConnectorTypeFromName,
  OrbitAdapter,
} from '@tuwaio/orbit-core';
import type { SatelliteSiwxState } from '@tuwaio/satellite-core';
import { createSolanaSiwxSigner, SolanaSiwxSignerTarget } from '@tuwaio/siwx-solana';
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
  /** Optional Sign-In With X (SIWX) session state */
  siwx?: SatelliteSiwxState;
}

/**
 * Creates and initializes a Solana connections watcher that monitors wallet standard changes
 * and synchronizes them with the global state store.
 *
 * @param config - Configuration object containing wallets array and optional SIWX settings
 * @param callbacks - Callback functions for interacting with the global state
 * @returns A cleanup function to stop watching connections
 *
 * @example
 * ```typescript
 * const unwatch = createSolanaConnectionsWatcher(
 *   { wallets, siwx: { enabled: true, isSignedIn: true, address: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d' } },
 *   { activeConnection, disconnect, connectionError, updateActiveConnection }
 * );
 *
 * // Unsubscribe when unmounting
 * unwatch();
 * ```
 *
 * @remarks
 * Evaluates session parity on Solana wallet account changes. If `siwx` is enabled and
 * the active session address does not match the newly selected account address,
 * it automatically triggers a `disconnect()` to protect session boundaries.
 */
export function createSolanaConnectionsWatcher(
  config: SolanaWatcherConfig,
  callbacks: SolanaWatcherCallbacks,
): () => void {
  const { wallets, siwx } = config;
  const { activeConnection, disconnect, connectionError, updateActiveConnection } = callbacks;

  /**
   * Handles SIWX rejection scenarios.
   * If SIWX is enabled and the user has rejected signing, this will trigger a disconnect.
   *
   * @internal
   */
  const handleSiwxRejection = (): void => {
    const isRejected = siwx?.isRejected || siwx?.status === 'error';
    const isSignedIn = siwx?.isSignedIn ?? siwx?.isAuthenticated ?? false;
    const isEnabled = siwx?.enabled !== false;

    if (isEnabled && !isSignedIn && isRejected && activeConnection) {
      disconnect(activeConnection.connectorType);
    }
  };

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

    const matchingWallet = wallets.find(
      (wallet) =>
        getConnectorTypeFromName(OrbitAdapter.SOLANA, formatConnectorName(wallet.name)) ===
        activeConnection.connectorType,
    );

    const activeAddress = matchingWallet?.accounts[0]?.address;
    const sessionAddress = siwx?.address ?? siwx?.session?.address;
    const isSignedIn = siwx?.isSignedIn ?? siwx?.isAuthenticated ?? false;

    // Disconnect if address switched without matching SIWX session
    if (
      isSignedIn &&
      activeAddress &&
      sessionAddress &&
      activeAddress !== sessionAddress &&
      !sessionAddress.endsWith(activeAddress)
    ) {
      disconnect(activeConnection.connectorType);
      return;
    }

    // Skip processing if there's a connection error to prevent conflicting updates
    if (!connectionError && matchingWallet) {
      const account = matchingWallet.accounts[0];
      const signerTarget: SolanaSiwxSignerTarget = {
        address: account?.address,
        publicKey: account?.publicKey,
        account,
        wallet: matchingWallet,
        features: (matchingWallet?.features &&
        typeof matchingWallet.features === 'object' &&
        !Array.isArray(matchingWallet.features)
          ? matchingWallet.features
          : (account as unknown as Record<string, unknown>)?.features) as unknown as Record<string, unknown>,
        signMessage: (account as unknown as Record<string, unknown>)?.signMessage as any,
        signMessages: (account as unknown as Record<string, unknown>)?.signMessages as any,
        modifyAndSignMessages: (account as unknown as Record<string, unknown>)?.modifyAndSignMessages as any,
      };
      const newState: Partial<SolanaConnection> = {
        address: matchingWallet.accounts[0]?.address,
        isConnected: matchingWallet.accounts.length > 0,
        connectedAccount: matchingWallet.accounts[0],
        connectedWallet: matchingWallet,
        signMessage: createSolanaSiwxSigner(signerTarget),
      };

      const hasChanged =
        newState.address !== activeConnection.address ||
        newState.isConnected !== activeConnection.isConnected ||
        !activeConnection.signMessage;

      if (hasChanged) {
        updateActiveConnection(newState);
      }
    }

    if (matchingWallet?.accounts.length === 0 && activeConnection.connectorType) {
      disconnect(activeConnection.connectorType);
    }
  };

  // Process initial SIWX rejection state
  handleSiwxRejection();

  // Execute initial wallet state processing
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
