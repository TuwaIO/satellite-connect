import { useWallets } from '@wallet-standard/react';
import { useEffect } from 'react';

import { useSatelliteConnectStore } from '../hooks/satteliteHook';

export function SolanaWalletsWatcher() {
  const wallets = useWallets();
  const updateActiveWallet = useSatelliteConnectStore((state) => state.updateActiveWallet);

  useEffect(() => {
    // TODO: handle multiple wallets
    const activeWallet = wallets.filter((wallet) => wallet.accounts.length > 0)[0];
    if (activeWallet) {
      updateActiveWallet({
        address: activeWallet.accounts[0].address,
        isConnected: true,
        connectedAccount: activeWallet.accounts[0],
        connectedWallet: activeWallet,
      });
    }
  }, [wallets]);

  return null;
}
