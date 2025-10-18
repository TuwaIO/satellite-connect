'use client';

import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { SatelliteConnectProvider } from '@tuwaio/satellite-react';
import { useSiweAuth } from '@tuwaio/satellite-siwe-next-auth';
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';

import { solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { SatelliteWatchers } from '@/providers/SatelliteWatchers';

export function SatelliteConnectProviders({ children }: { children: React.ReactNode }) {
  const { signInWithSiwe, enabled } = useSiweAuth();

  return (
    <SatelliteConnectProvider
      adapter={[
        satelliteEVMAdapter(wagmiConfig, enabled ? signInWithSiwe : undefined),
        satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls }),
      ]}
      autoConnect={true}
    >
      <SatelliteWatchers />
      {children}
    </SatelliteConnectProvider>
  );
}
