'use client';

import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { EVMWalletsWatcher, SatelliteConnectProvider, SolanaWalletsWatcher } from '@tuwaio/satellite-react';
import { useSiweAuth } from '@tuwaio/satellite-siwe-next-auth';
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';

import { NovaConnectProvider } from '@/components/ui/providers/NovaConnectProvider';
import { solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';

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
      <NovaConnectProvider withBalance withChain withImpersonated>
        {children}
      </NovaConnectProvider>
    </SatelliteConnectProvider>
  );
}
