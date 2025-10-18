'use client';

import { SatelliteStoreContext } from '@tuwaio/satellite-react';
import { EVMWalletsWatcher } from '@tuwaio/satellite-react/evm';
import { SolanaWalletsWatcher } from '@tuwaio/satellite-react/solana';
import { useSiweAuth } from '@tuwaio/satellite-siwe-next-auth';
import { useContext } from 'react';

import { wagmiConfig } from '@/configs/appConfig';

export function SatelliteWatchers() {
  const { isSignedIn, isRejected, enabled } = useSiweAuth();
  const store = useContext(SatelliteStoreContext);

  if (!store) return null;

  return (
    <>
      <EVMWalletsWatcher
        store={{
          activeWallet: store.getState().activeWallet,
          updateActiveWallet: store.getState().updateActiveWallet,
          walletConnectionError: store.getState().walletConnectionError,
          disconnect: store.getState().disconnect,
        }}
        wagmiConfig={wagmiConfig}
        siwe={{ isSignedIn, isRejected, enabled }}
      />
      <SolanaWalletsWatcher
        store={{
          activeWallet: store.getState().activeWallet,
          updateActiveWallet: store.getState().updateActiveWallet,
          walletConnectionError: store.getState().walletConnectionError,
          disconnect: store.getState().disconnect,
        }}
      />
    </>
  );
}
