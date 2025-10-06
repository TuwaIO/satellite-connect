'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';

import { wagmiConfig } from '@/configs/appConfig';
import { SatelliteConnectProviders } from '@/providers/SatelliteConnectProviders';
import { SiweNextAuthProvider } from '@/satellite-siwe-next-auth/src';

const queryClient = new QueryClient();

export function Providers({ children, session }: { children: ReactNode; session: Session | null }) {
  return (
    <SessionProvider session={session}>
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          <SiweNextAuthProvider
            enabled={true}
            onSignOut={() => console.log('sign out')}
            onSignIn={(session) => console.log('sign in', session)}
          >
            <SatelliteConnectProviders>{children}</SatelliteConnectProviders>
          </SiweNextAuthProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
}
