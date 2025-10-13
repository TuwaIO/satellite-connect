import { getAdapterFromWalletType, lastConnectedWalletHelpers, OrbitAdapter } from '@tuwaio/orbit-core';
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
  const disconnect = useSatelliteConnectStore((state) => state.disconnect);

  const lastConnectedWallet = lastConnectedWalletHelpers.getLastConnectedWallet();

  useEffect(() => {
    if (siwe?.enabled && !siwe?.isSignedIn && siwe?.isRejected) {
      disconnect();
    }
  }, [siwe, disconnect]);

  useEffect(() => {
    const handleAccountChange: WatchAccountParameters['onChange'] = (account) => {
      if (
        (lastConnectedWallet && getAdapterFromWalletType(lastConnectedWallet.walletType) !== OrbitAdapter.EVM) ||
        !account.address ||
        walletConnectionError
      ) {
        return;
      }

      const shouldUpdate = siwe?.enabled ? siwe.isSignedIn : true;

      if (shouldUpdate) {
        const walletType = lastConnectedWallet?.walletType;
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
  }, [lastConnectedWallet?.walletType, wagmiConfig, siwe, updateActiveWallet, walletConnectionError]);

  return null;
}
