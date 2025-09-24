'use client';

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { WalletType } from '@tuwaio/satellite-core';
import { Config, watchAccount } from '@wagmi/core';

import { useSatelliteConnectStore } from '../hooks/satteliteHook';

export function EVMWalletsWatcherProvider({ wagmiConfig }: { wagmiConfig: Config }) {
  const updateActiveWallet = useSatelliteConnectStore((state) => state.updateActiveWallet);

  watchAccount(wagmiConfig, {
    onChange: async (account) => {
      updateActiveWallet({
        walletType: `${OrbitAdapter.EVM}:${account?.connector?.type}` as WalletType,
        address: account.address,
        chainId: account.chainId,
        rpcURL: account.chain?.rpcUrls.default.http[0],
        isConnected: account.isConnected,
      });
    },
  });

  return null;
}
