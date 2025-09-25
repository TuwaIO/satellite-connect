import { useWallets } from '@wallet-standard/react';
import { useEffect } from 'react';

import { useSatelliteConnectStore } from '../hooks/satteliteHook';

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
  // Get all connected Solana wallets
  const wallets = useWallets();

  // Get the updateActiveWallet function from the Satellite store
  const updateActiveWallet = useSatelliteConnectStore((state) => state.updateActiveWallet);

  // Watch for changes in connected wallets
  useEffect(() => {
    // Currently only handling the first wallet with active accounts
    const activeWallet = wallets.filter((wallet) => wallet.accounts.length > 0)[0];

    if (activeWallet) {
      // Update the Satellite store with the active wallet information
      updateActiveWallet({
        // Use the first account's address
        // TODO: Implement support for multiple connected wallets
        address: activeWallet.accounts[0].address,
        // Set connection status
        isConnected: true,
        // Store Wallet Standard specific information
        connectedAccount: activeWallet.accounts[0],
        connectedWallet: activeWallet,
      });
    }
  }, [wallets]); // Re-run effect when wallets array changes

  // This is a headless component, so return null
  return null;
}
