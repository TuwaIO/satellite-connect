import { getAdapterFromWalletType, OrbitAdapter } from '@tuwaio/orbit-core';
import { Config, watchAccount, WatchAccountParameters } from '@wagmi/core';
import { useEffect } from 'react';

import { useSatelliteConnectStore } from '../index';

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
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);
  const disconnect = useSatelliteConnectStore((store) => store.disconnect);
  const walletConnectionError = useSatelliteConnectStore((store) => store.walletConnectionError);
  const updateActiveWallet = useSatelliteConnectStore((store) => store.updateActiveWallet);

  useEffect(() => {
    if (siwe?.enabled && !siwe?.isSignedIn && siwe?.isRejected) {
      disconnect();
    }
  }, [siwe, disconnect]);

  useEffect(() => {
    const handleAccountChange: WatchAccountParameters['onChange'] = (account) => {
      if (account?.status === 'disconnected') {
        disconnect();
      }

      if (
        (activeWallet && getAdapterFromWalletType(activeWallet.walletType) !== OrbitAdapter.EVM) ||
        !account.address ||
        walletConnectionError
      ) {
        return;
      }

      const shouldUpdate = siwe?.enabled ? siwe.isSignedIn : true;

      if (shouldUpdate) {
        const walletType = activeWallet?.walletType;
        const walletUpdate = walletType
          ? {
              walletType,
              address: account.address,
              chainId: account.chainId,
              rpcURL: account.chain?.rpcUrls.default.http[0],
              isConnected: account.isConnected,
            }
          : {
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
  }, [activeWallet?.walletType, siwe, walletConnectionError]);

  return null;
}
