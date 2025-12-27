import {
  formatConnectorName,
  getAdapterFromConnectorType,
  getConnectorTypeFromName,
  OrbitAdapter,
} from '@tuwaio/orbit-core';
import { useWallets } from '@wallet-standard/react';
import { useEffect } from 'react';

import { useSatelliteConnectStore } from '../index';

/**
 * The actual implementation of the SolanaConnectorsWatcher component.
 * This component is dynamically imported only when the required dependencies are available.
 *
 * @returns null - This is a headless component
 */
export function SolanaConnectorsWatcherImpl() {
  const wallets = useWallets();

  const activeConnectionFromStore = useSatelliteConnectStore((store) => store.activeConnection);
  const updateActiveConnection = useSatelliteConnectStore((store) => store.updateActiveConnection);
  const connectionError = useSatelliteConnectStore((store) => store.connectionError);
  const disconnect = useSatelliteConnectStore((store) => store.disconnect);

  // Watch for changes in connected connectors
  useEffect(() => {
    if (
      activeConnectionFromStore &&
      getAdapterFromConnectorType(activeConnectionFromStore.connectorType) === OrbitAdapter.SOLANA
    ) {
      const activeConnection = wallets.filter(
        (w) =>
          getConnectorTypeFromName(OrbitAdapter.SOLANA, formatConnectorName(w.name)) ===
          activeConnectionFromStore.connectorType,
      )[0];

      if (!connectionError) {
        const newState = {
          // Use the first account's address
          address: activeConnection?.accounts[0]?.address,
          // Set connection status
          isConnected: activeConnection?.accounts.length > 0,
          // Store Wallet Standard specific information
          connectedAccount: activeConnection?.accounts[0],
          connectedWallet: activeConnection,
        };

        // Check if anything actually changed to prevent infinite loops
        // We only check address and isConnected because connectedAccount/connectedWallet
        // might be new references on every render, causing infinite loops if checked.
        const hasChanged =
          newState.address !== activeConnectionFromStore.address ||
          newState.isConnected !== activeConnectionFromStore.isConnected;

        if (hasChanged) {
          // Update the Satellite store with the active connector information
          updateActiveConnection(newState);
        }
      }
      if (activeConnection?.accounts.length === 0 && activeConnectionFromStore.connectorType) {
        // If the connector is disconnected from the wallet provider, disconnect from Satellite store as well
        disconnect(activeConnectionFromStore.connectorType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConnectionFromStore?.connectorType, wallets, connectionError, updateActiveConnection, disconnect]); // Re-run effect when wallets array changes

  // This is a headless component, so return null
  return null;
}
