import { getAdapterFromConnectorType, OrbitAdapter } from '@tuwaio/orbit-core';
import { Config, getConnection, watchConnections, WatchConnectionsParameters } from '@wagmi/core';
import { useEffect } from 'react';

import { useSatelliteConnectStore } from '../index';

/**
 * Props for the {@link EVMConnectorsWatcher} component.
 */
interface EVMConnectorsWatcherProps {
  /**
   * The configuration object from `@wagmi/core`.
   * This is required to initialize the account watcher.
   */
  wagmiConfig: Config;

  /**
   * Optional object representing the Sign-In With Ethereum (SIWE) state.
   * If provided, the watcher will use this state to manage updates
   * and disconnections based on SIWE status.
   */
  siwe?: {
    /**
     * Flag indicating if the SIWE authentication request was rejected by the user.
     */
    isRejected: boolean;
    /**
     * Flag indicating if the user is successfully signed in via SIWE.
     */
    isSignedIn: boolean;
    /**
     * Flag indicating if the SIWE flow is enabled.
     */
    enabled?: boolean;
  };
}

/**
 * A headless React component (renders `null`) that synchronizes the EVM connector
 * state from `@wagmi/core` with the global `useSatelliteConnectStore`.
 *
 * It is responsible for:
 * 1. Automatically disconnecting if a SIWE (Sign-In With Ethereum) request is rejected.
 * 2. Listening for account changes (e.g., account switch, chain switch, disconnect)
 * from `wagmi` and updating the global store accordingly.
 *
 * @param props - The component's props. See {@link EVMConnectorsWatcherProps} for details.
 * @returns {null} This component does not render any UI.
 */
export function EVMConnectorsWatcher({ wagmiConfig, siwe }: EVMConnectorsWatcherProps) {
  // --- Global Store State ---
  // Subscribes to parts of the global Zustand store.

  /**
   * The currently active wallet object from the global store.
   */
  /**
   * The currently active wallet object from the global store.
   */
  const activeConnection = useSatelliteConnectStore((store) => store.activeConnection);
  /**
   * The global function to trigger a connector disconnection.
   */
  const disconnect = useSatelliteConnectStore((store) => store.disconnect);
  /**
   * The current connection error state, if any.
   */
  const connectionError = useSatelliteConnectStore((store) => store.connectionError);
  /**
   * The global function to update the active connector's details.
   */
  const updateActiveConnection = useSatelliteConnectStore((store) => store.updateActiveConnection);

  // --- Effects ---

  /**
   * Effect: Handles SIWE rejection.
   *
   * If the SIWE flow is enabled (`siwe.enabled`), the user is not yet
   * signed in (`!siwe.isSignedIn`), and they have explicitly rejected
   * the SIWE signature request (`siwe.isRejected`), this effect
   * will call the global `disconnect` function.
   */
  useEffect(() => {
    if (siwe?.enabled && !siwe?.isSignedIn && siwe?.isRejected) {
      if (activeConnection) {
        disconnect(activeConnection.connectorType);
      }
    }
  }, [siwe, disconnect, activeConnection]);

  /**
   * Effect: Subscribes to wagmi connection changes.
   *
   * This effect initializes `watchConnections` from `@wagmi/core` to listen for
   * any changes in the connected connectors' state (like switching accounts,
   * changing networks, or disconnecting). Supports multiple simultaneous connections.
   */
  useEffect(() => {
    /**
     * Callback function triggered by `watchConnections` whenever the
     * wagmi connections state changes.
     *
     * @param connections - Array of all active connections from wagmi.
     */
    const handleConnectionsChange: WatchConnectionsParameters['onChange'] = (connections) => {
      // Guard: If active connection is not EVM, ignore changes
      if (activeConnection && getAdapterFromConnectorType(activeConnection.connectorType) !== OrbitAdapter.EVM) {
        return;
      }

      // Case 1: No connections means all connectors were disconnected
      if (connections.length === 0) {
        if (activeConnection) {
          disconnect(activeConnection.connectorType);
        }
        return;
      }

      const currentConnection = getConnection(wagmiConfig);

      // --- Guard Clauses ---
      // Stop processing if any of these conditions are true:
      // 1. The currently active connector in our store is NOT an EVM connector
      //    (we don't want this watcher to override a non-EVM connector).
      // 2. The current connection has no accounts.
      // 3. There is already a connection error in our global store.
      if (
        (activeConnection && getAdapterFromConnectorType(activeConnection.connectorType) !== OrbitAdapter.EVM) ||
        !currentConnection ||
        connectionError
      ) {
        return;
      }

      /**
       * Determines if the global store *should* be updated.
       * - If SIWE is enabled, we only update the store if the user is signed in.
       * - If SIWE is not enabled, we always update the store.
       */
      const shouldUpdate = siwe?.enabled ? siwe.isSignedIn : true;

      if (shouldUpdate) {
        // Preserve the `connectorType` if it already exists in the active wallet.
        const connectorType = activeConnection?.connectorType;

        /**
         * The payload to send to the global store update function.
         */
        const updatedConnector = connectorType
          ? {
              // Preserve the connectorType (e.g., 'metamask', 'walletconnect')
              connectorType,
              address: currentConnection.address,
              chainId: currentConnection.chainId,
              rpcURL: currentConnection?.chain?.rpcUrls.default.http[0],
              isConnected: true,
            }
          : {
              // Fallback if activeConnection was null or had no type
              address: currentConnection.address,
              chainId: currentConnection.chainId,
              rpcURL: currentConnection?.chain?.rpcUrls.default.http[0],
              isConnected: true,
            };

        // Update the global store with the new connector state.
        updateActiveConnection(updatedConnector);
      }
    };

    // Activate the watcher
    const unwatch = watchConnections(wagmiConfig, { onChange: handleConnectionsChange });

    // Return the cleanup function.
    // This `unwatch` function will be called when the component unmounts
    // or when the dependencies in the array change, preventing memory leaks.
    return unwatch;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConnection?.connectorType, siwe, connectionError]);

  // This component is "headless" - it performs logic but renders nothing.
  return null;
}
