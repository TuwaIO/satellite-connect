'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { EVMWalletsWatcher, SatelliteConnectProvider, SolanaWalletsWatcher } from '@tuwaio/satellite-react';
import { initializeSolanaMobileConnectors, satelliteSolanaAdapter } from '@tuwaio/satellite-solana';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { appConfig, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { PulsarProvider } from '@/providers/PulsarProvider';
import { StoreProvider } from '@/providers/StoreProvider';

import { NovaProvider } from './NovaProvider';

const queryClient = new QueryClient();

initializeSolanaMobileConnectors({
  rpcUrls: solanaRPCUrls,
  ...appConfig,
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SatelliteConnectProvider
          adapter={[satelliteEVMAdapter(wagmiConfig), satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls })]}
          autoConnect={false}
        >
          <EVMWalletsWatcher wagmiConfig={wagmiConfig} />
          <SolanaWalletsWatcher />
          <StoreProvider>
            <PulsarProvider>
              <NovaProvider />
              {children}
            </PulsarProvider>
          </StoreProvider>
        </SatelliteConnectProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
