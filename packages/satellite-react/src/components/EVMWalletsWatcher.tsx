import { OrbitAdapter } from '@tuwaio/orbit-core';
import { WalletType } from '@tuwaio/satellite-core';
import { Config, watchAccount } from '@wagmi/core';

import { useSatelliteConnectStore } from '../hooks/satteliteHook';

/**
 * React component that watches for EVM wallet account changes and updates the Satellite store
 *
 * @remarks
 * This component acts as a bridge between Wagmi account state and Satellite store.
 * It doesn't render anything visible but maintains wallet state synchronization.
 *
 * @param props - Component properties
 * @param props.wagmiConfig - Wagmi configuration instance
 *
 * @returns null - This is a headless component
 **/
export function EVMWalletsWatcher({ wagmiConfig }: { wagmiConfig: Config }) {
  // Get the updateActiveWallet function from the Satellite store
  const updateActiveWallet = useSatelliteConnectStore((state) => state.updateActiveWallet);

  // Set up account change watcher
  watchAccount(wagmiConfig, {
    onChange: async (account) => {
      // Update the Satellite store with the new account information
      updateActiveWallet({
        // Combine EVM adapter key with connector type for wallet identification
        walletType: `${OrbitAdapter.EVM}:${account?.connector?.type}` as WalletType,
        // Update wallet address
        address: account.address,
        // Update chain ID
        chainId: account.chainId,
        // Update RPC URL using the first available HTTP URL
        rpcURL: account.chain?.rpcUrls.default.http[0],
        // Update connection status
        isConnected: account.isConnected,
      });
    },
  });

  // This is a headless component, so return null
  return null;
}
