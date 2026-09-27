import {
  ConnectorType,
  formatConnectorName,
  getAdapterFromConnectorType,
  OrbitAdapter,
  TuwaErrorState,
} from '@tuwaio/orbit-core';
import type { SatelliteSiwxState } from '@tuwaio/satellite-core';
import { Config, getConnection, signMessage, watchConnections, WatchConnectionsParameters } from '@wagmi/core';

import { EVMConnection } from '../types';

/**
 * Store state and actions used by {@link createEVMConnectionsWatcher}. Pass the store's `disconnect` and
 * `updateActiveConnection` and its `getState`, so the watcher always reads the current state. Instead of `getState`
 * you can pass the current `activeConnection` and `connectionError`; they are then read once, when the watcher is
 * created.
 */
export interface EVMWatcherCallbacks {
  /** The active connection when the watcher is created. Ignored when `getState` is passed. */
  activeConnection?: EVMConnection;
  /**
   * Disconnects a connection; the store's `disconnect`.
   *
   * @param connectorType - The connector to disconnect.
   */
  disconnect: (connectorType: ConnectorType) => void;
  /**
   * The store's `connectionError` when the watcher is created. While it is set, wallet changes are not copied to the
   * store. Ignored when `getState` is passed.
   */
  connectionError?: TuwaErrorState | string;
  /**
   * Merges fields into the active connection; the store's `updateActiveConnection`.
   *
   * @param connection - Fields to merge.
   */
  updateActiveConnection: (connection: Partial<EVMConnection>) => void;
  /**
   * Returns the current store state, for example the store's `getState`. The watcher calls it when it starts and on
   * every wagmi event, so it does not have to be recreated when the active connection or the error changes.
   *
   * @returns The current `activeConnection` and `connectionError`.
   */
  getState?: () => {
    /** The active connection. */
    activeConnection?: EVMConnection;
    /** The connection error. */
    connectionError?: TuwaErrorState | string;
  };
}

/**
 * Configuration of {@link createEVMConnectionsWatcher}.
 */
export interface EVMWatcherConfig {
  /** The wagmi config used by the EVM adapter. Its connections are watched. */
  wagmiConfig: Config;
  /** Optional SIWX session state. See `SatelliteSiwxState` from `@tuwaio/satellite-core`. */
  siwx?: SatelliteSiwxState;
  /**
   * Legacy SIWE state, used only when `siwx` is not passed.
   *
   * @deprecated Pass `siwx` instead.
   */
  siwe?: {
    /** `false` turns off the disconnect after a rejected sign-in. */
    enabled?: boolean;
    /** Whether the user is signed in. */
    isSignedIn?: boolean;
    /** Whether the sign-in was rejected. */
    isRejected?: boolean;
  };
}

/**
 * Keeps the Satellite Connect store in sync with wagmi, without a UI framework. `EVMConnectorsWatcher` from
 * `@tuwaio/satellite-react/evm` runs it in React apps.
 *
 * When created, it disconnects the active connection if the SIWX sign-in was rejected or failed (see
 * `SatelliteSiwxState` from `@tuwaio/satellite-core`), and sets `signMessage` on an active EVM connection that wagmi
 * reports as connected. Then it subscribes to wagmi's `watchConnections`. On every change, unless the active connection
 * belongs to another chain family:
 * - when wagmi has no connection left, the active connection is disconnected;
 * - otherwise, unless `connectionError` is set: while the user is signed in with SIWX, the active connection is
 *   disconnected when the wallet account or chain no longer matches the session; in all other cases the connector
 *   type, address, chain, RPC URL and `signMessage` of the wagmi connection are merged into the store.
 *
 * Pass the store's `getState` as `callbacks.getState`, so the active connection and the error are read on every event.
 * `config.siwx` is read when the watcher is created: create a new watcher when the SIWX state changes.
 *
 * @param config - The wagmi config and the optional SIWX state.
 * @param callbacks - Store state and actions.
 * @returns A function that unsubscribes from wagmi.
 *
 * @example
 * ```ts
 * import { createSatelliteConnectStore } from '@tuwaio/satellite-core';
 * import {
 *   type ConnectorEVM,
 *   createEVMConnectionsWatcher,
 *   type EVMConnection,
 *   satelliteEVMAdapter,
 * } from '@tuwaio/satellite-evm';
 * import { type Config } from '@wagmi/core';
 * import { mainnet } from 'viem/chains';
 *
 * declare const wagmiConfig: Config;
 *
 * const store = createSatelliteConnectStore<ConnectorEVM, EVMConnection>({
 *   adapter: satelliteEVMAdapter(wagmiConfig, [mainnet]),
 * });
 *
 * const { disconnect, updateActiveConnection } = store.getState();
 * export const unwatch = createEVMConnectionsWatcher(
 *   { wagmiConfig },
 *   { disconnect, updateActiveConnection, getState: store.getState },
 * );
 * ```
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
  const { disconnect, updateActiveConnection } = callbacks;
  // The current store state when `getState` is passed, otherwise the values passed when the watcher was created
  const readState = () => callbacks.getState?.() ?? callbacks;

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
      const { activeConnection } = readState();
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
    const { activeConnection, connectionError } = readState();

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

  // Execute initial sync to ensure signMessage is present on active connection
  const { activeConnection } = readState();
  if (activeConnection && getAdapterFromConnectorType(activeConnection.connectorType) === OrbitAdapter.EVM) {
    const currentConnection = getConnection(wagmiConfig);
    if (currentConnection && currentConnection.isConnected) {
      updateActiveConnection({
        signMessage: (message: string) => signMessage(wagmiConfig, { message }),
      });
    }
  }

  // Start watching wagmi connections for changes
  const unwatch = watchConnections(wagmiConfig, {
    onChange: handleConnectionsChange,
  });

  // Return cleanup function
  return unwatch;
}
