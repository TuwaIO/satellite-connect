import { ConnectorType, formatConnectorName, getAdapterFromConnectorType, OrbitAdapter } from '@tuwaio/orbit-core';
import { Config, getConnection, watchConnections, WatchConnectionsParameters } from '@wagmi/core';

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
  /** Optional Sign-In With Ethereum (SIWE) configuration */
  siwe?: {
    /** Whether SIWE authentication is enabled */
    enabled: boolean;
    /** Whether the user is currently signed in via SIWE */
    isSignedIn: boolean;
    /** Whether the user has rejected the SIWE signature request */
    isRejected: boolean;
  };
}

/**
 * Creates and initializes an EVM connections watcher that monitors wagmi connection changes
 * and synchronizes them with the global state store.
 *
 * This function provides a pure, framework-agnostic way to watch EVM connections
 * without being tied to React hooks or components.
 *
 * @param config - Configuration object containing wagmi config and optional SIWE settings
 * @param callbacks - Callback functions for interacting with the global state
 * @returns A cleanup function to stop watching connections
 *
 * @example
 * ```typescript
 * const unwatch = createEVMConnectionsWatcher(
 *   { wagmiConfig, siwe: { enabled: true, isSignedIn: true, isRejected: false } },
 *   { activeConnection, disconnect, connectionError, updateActiveConnection }
 * );
 *
 * // Later, when you need to stop watching:
 * unwatch();
 * ```
 */
export function createEVMConnectionsWatcher(config: EVMWatcherConfig, callbacks: EVMWatcherCallbacks): () => void {
  const { wagmiConfig, siwe } = config;
  const { activeConnection, disconnect, connectionError, updateActiveConnection } = callbacks;

  /**
   * Handles SIWE (Sign-In With Ethereum) rejection scenarios.
   * If SIWE is enabled and the user has rejected signing, this will trigger a disconnect.
   *
   * @internal
   */
  const handleSIWERejection = (): void => {
    if (siwe?.enabled && !siwe?.isSignedIn && siwe?.isRejected) {
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

    console.log('currentConnection from watcher', currentConnection);

    // Guard clauses: Skip processing under certain conditions
    if (
      // Active connection exists but is not an EVM connector
      (activeConnection && getAdapterFromConnectorType(activeConnection.connectorType) !== OrbitAdapter.EVM) ||
      // No current connection from wagmi
      !currentConnection ||
      // There's already a connection error in the store
      connectionError
    ) {
      return;
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
    };

    // Update the global store with the new connector state
    updateActiveConnection(updatedConnector);
  };

  // Process initial SIWE rejection state
  handleSIWERejection();

  // Start watching wagmi connections for changes
  const unwatch = watchConnections(wagmiConfig, {
    onChange: handleConnectionsChange,
  });

  // Return cleanup function
  return unwatch;
}
