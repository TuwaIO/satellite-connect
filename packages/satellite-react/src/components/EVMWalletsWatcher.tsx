import { OrbitAdapter } from '@tuwaio/orbit-core';
import { getAdapterFromWalletType } from '@tuwaio/satellite-core';
import { Config, watchAccount, WatchAccountParameters } from '@wagmi/core';
import { useEffect } from 'react';

import { useSatelliteConnectStore } from '../hooks/satteliteHook';

export function EVMWalletsWatcher({
  wagmiConfig,
  siwe,
}: {
  wagmiConfig: Config;
  siwe?: {
    isRejected: boolean;
    isSignedIn: boolean;
    enabled?: boolean;
  };
}) {
  const updateActiveWallet = useSatelliteConnectStore((state) => state.updateActiveWallet);
  const walletConnectionError = useSatelliteConnectStore((state) => state.walletConnectionError);
  const activeWallet = useSatelliteConnectStore((state) => state.activeWallet);
  const disconnect = useSatelliteConnectStore((state) => state.disconnect);

  useEffect(() => {
    if (siwe?.enabled && !siwe?.isSignedIn && siwe?.isRejected) {
      disconnect();
    }
  }, [siwe, disconnect]);

  useEffect(() => {
    const handleAccountChange: WatchAccountParameters['onChange'] = (account) => {
      if (
        (activeWallet && getAdapterFromWalletType(activeWallet.walletType) !== OrbitAdapter.EVM) ||
        !account.address ||
        walletConnectionError
      ) {
        return;
      }

      const shouldUpdate = siwe?.enabled ? siwe.isSignedIn : true;

      if (shouldUpdate) {
        const walletUpdate = {
          address: account.address,
          chainId: account.chainId,
          rpcURL: account.chain?.rpcUrls.default.http[0],
          isConnected: account.isConnected,
        };

        updateActiveWallet(walletUpdate);
      }
    };

    const unwatch = watchAccount(wagmiConfig, { onChange: handleAccountChange });

    return unwatch;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeWallet?.walletType, wagmiConfig, siwe, updateActiveWallet, walletConnectionError]);

  return null;
}
