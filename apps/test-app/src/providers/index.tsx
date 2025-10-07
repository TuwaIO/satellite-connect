'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SiweNextAuthProvider } from '@tuwaio/satellite-siwe-next-auth';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { wagmiConfig } from '@/configs/appConfig';
import { SatelliteConnectProviders } from '@/providers/SatelliteConnectProviders';

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SiweNextAuthProvider
          enabled={false}
          onSignOut={() => console.log('sign out')}
          onSignIn={(session) => console.log('sign in', session)}
        >
          <SatelliteConnectProviders>{children}</SatelliteConnectProviders>
        </SiweNextAuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
