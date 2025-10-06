import { OrbitAdapter } from '@tuwaio/orbit-core';
import { formatWalletName, WalletType } from '@tuwaio/satellite-core';
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

  useEffect(() => {
    if (siwe?.enabled && !siwe?.isSignedIn && siwe?.isRejected) {
      disconnect();
    }
  }, [siwe, disconnect]);

  useEffect(() => {
    const handleAccountChange: WatchAccountParameters['onChange'] = (account) => {
      if (!account.address || walletConnectionError) {
        return;
      }

      const shouldUpdate = siwe?.enabled ? siwe.isSignedIn : true;

      if (shouldUpdate) {
        const walletUpdate = {
          walletType: `${OrbitAdapter.EVM}:${formatWalletName(account?.connector?.name ?? '')}` as WalletType,
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
  }, [wagmiConfig, siwe, updateActiveWallet, walletConnectionError]);

  return null;
}
