import {
  formatWalletName,
  getAdapterFromWalletType,
  getWalletTypeFromConnectorName,
  OrbitAdapter,
} from '@tuwaio/orbit-core';
import { useWallets } from '@wallet-standard/react';
import { useEffect } from 'react';

import { useSatelliteConnectStore } from '../index';

/**
 * React component that monitors Solana wallet connections and updates the Satellite store
 *
 * @remarks
 * This component watches for changes in connected Solana wallets using the Wallet Standard.
 * Currently handles the first active wallet only, with multi-wallet support planned for future.
 * It's a headless component that manages state synchronization between Wallet Standard and Satellite store.
 *
 * @returns null - This is a headless component
 *
 */
export function SolanaWalletsWatcher() {
  const wallets = useWallets();

  const activeConnectionFromStore = useSatelliteConnectStore((store) => store.activeConnection);
  const updateActiveConnection = useSatelliteConnectStore((store) => store.updateActiveConnection);
  const walletConnectionError = useSatelliteConnectStore((store) => store.walletConnectionError);
  const disconnect = useSatelliteConnectStore((store) => store.disconnect);

  // Watch for changes in connected wallets
  useEffect(() => {
    if (
      activeConnectionFromStore &&
      getAdapterFromWalletType(activeConnectionFromStore.walletType) === OrbitAdapter.SOLANA
    ) {
      const activeWallet = wallets.filter(
        (w) =>
          getWalletTypeFromConnectorName(OrbitAdapter.SOLANA, formatWalletName(w.name)) ===
          activeConnectionFromStore.walletType,
      )[0];

      if (!walletConnectionError) {
        // Update the Satellite store with the active wallet information

        updateActiveConnection({
          // Use the first account's address
          address: activeWallet?.accounts[0]?.address,
          // Set connection status
          isConnected: activeWallet?.accounts.length > 0,
          // Store Wallet Standard specific information
          // @ts-expect-error - wallet type is not set fully on the package level
          connectedAccount: activeWallet?.accounts[0],
          connectedWallet: activeWallet,
        });
      }
      if (activeWallet?.accounts.length === 0) {
        // If the wallet is disconnected from the wallet provider, disconnect from Satellite store as well
        disconnect(activeConnectionFromStore.walletType);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConnectionFromStore?.walletType, wallets, walletConnectionError, updateActiveConnection, disconnect]); // Re-run effect when wallets array changes

  // This is a headless component, so return null
  return null;
}
