'use client';

import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { EVMWalletsWatcher, SatelliteConnectProvider, SolanaWalletsWatcher } from '@tuwaio/satellite-react';
import { useSiweAuth } from '@tuwaio/satellite-siwe-next-auth';
import { initializeSolanaMobileConnectors, satelliteSolanaAdapter } from '@tuwaio/satellite-solana';

import { ErrorsProvider } from '@/components/ui/Errors/ErrorsProvider';
import { appConfig, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { NovaProvider } from '@/providers/NovaProvider';
import { StoreProvider } from '@/providers/StoreProvider';

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
      autoConnect={false}
    >
      <EVMWalletsWatcher wagmiConfig={wagmiConfig} siwe={{ isSignedIn, isRejected, enabled }} />
      <SolanaWalletsWatcher />
      <StoreProvider>
        <NovaProvider />
        <ErrorsProvider />
        {children}
      </StoreProvider>
    </SatelliteConnectProvider>
  );
}
