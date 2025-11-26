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
 * React component that monitors Solana connector connections and updates the Satellite store
 *
 * @remarks
 * This component watches for changes in connected Solana connectors using the Wallet Standard.
 * Currently handles the first active connector only, with multi-connector support planned for future.
 * It's a headless component that manages state synchronization between Wallet Standard and Satellite store.
 *
 * @returns null - This is a headless component
 *
 */
export function SolanaConnectorsWatcher() {
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
        // Update the Satellite store with the active connector information

        updateActiveConnection({
          // Use the first account's address
          address: activeConnection?.accounts[0]?.address,
          // Set connection status
          isConnected: activeConnection?.accounts.length > 0,
          // Store Wallet Standard specific information
          // @ts-expect-error - wallet type is not set fully on the package level
          connectedAccount: activeConnection?.accounts[0],
          connectedWallet: activeConnection,
        });
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
