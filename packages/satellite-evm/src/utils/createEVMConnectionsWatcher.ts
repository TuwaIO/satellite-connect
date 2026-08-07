import { ConnectorType, formatConnectorName, getAdapterFromConnectorType, OrbitAdapter } from '@tuwaio/orbit-core';
import type { SatelliteSiwxState } from '@tuwaio/satellite-core';
import { Config, getConnection, signMessage, watchConnections, WatchConnectionsParameters } from '@wagmi/core';

import { EVMConnection } from '../types';

/**
 * Callback functions interface for the EVM connections watcher.
 * These callbacks are used to interact with the global state store.
 */
export interface EVMWatcherCallbacks {
  /** The currently active EVM connection from the global store */
  activeConnection: EVMConnection | undefined;
  /** Function to disconnect a specific connector type */
  disconnect: (connectorType: ConnectorType) => void;
  /** Current connection error state, if any */
  connectionError: string | undefined;
  /** Function to update the active connection's properties */
  updateActiveConnection: (connection: Partial<EVMConnection>) => void;
}

/**
 * Configuration interface for the EVM connections watcher.
 */
export interface EVMWatcherConfig {
  /** Wagmi configuration object required for connection monitoring */
  wagmiConfig: Config;
  /** Optional Sign-In With X (SIWX) session state */
  siwx?: SatelliteSiwxState;
  /** @deprecated Legacy SIWE prop alias for backwards compatibility */
  siwe?: {
    enabled?: boolean;
    isSignedIn?: boolean;
    isRejected?: boolean;
  };
}

/**
 * Creates and initializes an EVM connections watcher that monitors wagmi connection changes
 * and synchronizes them with the global state store.
 *
 * This function provides a pure, framework-agnostic way to watch EVM connections
 * without being tied to React hooks or components.
 *
 * @param config - Configuration object containing wagmi config and optional SIWX session settings
 * @param callbacks - Callback functions for interacting with the global state
 * @returns A cleanup function to stop watching connections
 *
 * @example
 * ```typescript
 * const unwatch = createEVMConnectionsWatcher(
 *   { wagmiConfig, siwx: { enabled: true, isSignedIn: true, isRejected: false } },
 *   { activeConnection, disconnect, connectionError, updateActiveConnection }
 * );
 *
 * // Later, when you need to stop watching:
 * unwatch();
 * ```
 *
 * @remarks
 * Evaluates session parity on account and network switches. If `siwx` is enabled and
 * the active session address or chainId does not match the newly connected wallet state,
 * it automatically triggers a `disconnect()` to prevent stale session attacks.
 */
export function createEVMConnectionsWatcher(config: EVMWatcherConfig, callbacks: EVMWatcherCallbacks): () => void {
  const { wagmiConfig } = config;
  const siwx =
    config.siwx ??
    (config.siwe
      ? {
          enabled: config.siwe.enabled,
          isSignedIn: config.siwe.isSignedIn,
          isRejected: config.siwe.isRejected,
        }
      : undefined);
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

    if (isEnabled && !isSignedIn && isRejected) {
      if (activeConnection) {
        disconnect(activeConnection.connectorType);
      }
    }
  };

  /**
   * Handles changes in wagmi connection state.
   * This function is called whenever wagmi detects connection changes
   * such as account switches, network changes, or disconnections.
   *
   * @param connections - Array of all active connections from wagmi
   * @internal
   */
  const handleConnectionsChange: WatchConnectionsParameters['onChange'] = (connections): void => {
    // Early return: Skip processing if the active connection is not an EVM connector
    if (activeConnection && getAdapterFromConnectorType(activeConnection.connectorType) !== OrbitAdapter.EVM) {
      return;
    }

    // Handle disconnection: If no connections exist, disconnect the active connector
    if (connections.length === 0) {
      if (activeConnection) {
        disconnect(activeConnection.connectorType);
      }
      return;
    }

    // Get current wagmi connection state
    const currentConnection = getConnection(wagmiConfig);

    // Guard clauses: Skip processing under certain conditions
    if (
      (activeConnection && getAdapterFromConnectorType(activeConnection.connectorType) !== OrbitAdapter.EVM) ||
      !currentConnection ||
      connectionError
    ) {
      return;
    }

    const sessionAddress = siwx?.address ?? siwx?.session?.address;
    const sessionChainId = siwx?.chainId ?? siwx?.session?.chainId;
    const isSignedIn = siwx?.isSignedIn ?? siwx?.isAuthenticated ?? false;

    // Disconnect if address or network switched without a matching SIWX session
    if (isSignedIn && activeConnection) {
      const addressChanged =
        currentConnection.address &&
        sessionAddress &&
        currentConnection.address.toLowerCase() !== sessionAddress.toLowerCase() &&
        !sessionAddress.toLowerCase().endsWith(currentConnection.address.toLowerCase());

      const chainIdChanged =
        currentConnection.chainId &&
        sessionChainId &&
        String(currentConnection.chainId) !== String(sessionChainId) &&
        !sessionChainId.endsWith(`:${currentConnection.chainId}`);

      if (addressChanged || chainIdChanged) {
        disconnect(activeConnection.connectorType);
        return;
      }
    }

    const currentConnector = currentConnection.connector;

    // Determine the connector type, fallback to existing if connector is unavailable
    const currentConnectorType = currentConnector
      ? (`${OrbitAdapter.EVM}:${formatConnectorName(currentConnector.name)}` as ConnectorType)
      : activeConnection?.connectorType;

    // Build the updated connector object with current connection data
    const updatedConnector: Partial<EVMConnection> = {
      connectorType: currentConnectorType,
      address: currentConnection.address,
      chainId: currentConnection.chainId,
      rpcURL: currentConnection?.chain?.rpcUrls.default.http[0],
      isConnected: true,
      signMessage: (message: string) => signMessage(wagmiConfig, { message }),
    };

    // Update the global store with the new connector state
    updateActiveConnection(updatedConnector);
  };

  // Process initial SIWX rejection state
  handleSiwxRejection();

  // Start watching wagmi connections for changes
  const unwatch = watchConnections(wagmiConfig, {
    onChange: handleConnectionsChange,
  });

  // Return cleanup function
  return unwatch;
}
