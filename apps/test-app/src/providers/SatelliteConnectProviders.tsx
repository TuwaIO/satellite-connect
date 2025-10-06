'use client';

import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { EVMWalletsWatcher, SatelliteConnectProvider, SolanaWalletsWatcher } from '@tuwaio/satellite-react';
import { initializeSolanaMobileConnectors, satelliteSolanaAdapter } from '@tuwaio/satellite-solana';

import { appConfig, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { NovaProvider } from '@/providers/NovaProvider';
import { StoreProvider } from '@/providers/StoreProvider';
import { useSiweAuth } from '@/satellite-siwe-next-auth/src';

initializeSolanaMobileConnectors({
  rpcUrls: solanaRPCUrls,
  ...appConfig,
});

export function SatelliteConnectProviders({ children }: { children: React.ReactNode }) {
  const { signInWithSiwe, isSignedIn, isRejected, enabled } = useSiweAuth();

  return (
    <SatelliteConnectProvider
      adapter={[
        satelliteEVMAdapter(wagmiConfig, enabled ? signInWithSiwe : undefined),
        satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls }),
      ]}
      autoConnect={true}
    >
      <EVMWalletsWatcher wagmiConfig={wagmiConfig} siwe={{ isSignedIn, isRejected, enabled }} />
      <SolanaWalletsWatcher />
      <StoreProvider>
        <NovaProvider />
        {children}
      </StoreProvider>
    </SatelliteConnectProvider>
  );
}
