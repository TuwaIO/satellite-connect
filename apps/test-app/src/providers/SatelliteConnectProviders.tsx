'use client';

import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { EVMWalletsWatcher, SatelliteConnectProvider, SolanaWalletsWatcher } from '@tuwaio/satellite-react';
import { useSiweAuth } from '@tuwaio/satellite-siwe-next-auth';
import { initializeSolanaMobileConnectors, satelliteSolanaAdapter } from '@tuwaio/satellite-solana';

import { NovaConnectProviderProps } from '@/components/ui/hooks/useNovaConnect';
import { NovaConnectProvider } from '@/components/ui/providers/NovaConnectProvider';
import { appConfig, appEVMChains, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';

initializeSolanaMobileConnectors({
  rpcUrls: solanaRPCUrls,
  ...appConfig,
});

export function SatelliteConnectProviders({ children }: { children: React.ReactNode }) {
  const { signInWithSiwe, isSignedIn, isRejected, enabled } = useSiweAuth();

  const transactionPool = usePulsarStore((state) => state.transactionsPool);
  const getAdapter = usePulsarStore((state) => state.getAdapter);

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
      <NovaConnectProvider
        appChains={appEVMChains}
        solanaRPCUrls={solanaRPCUrls}
        transactionPool={transactionPool}
        pulsarAdapter={getAdapter() as NovaConnectProviderProps['pulsarAdapter']}
        withBalance
        withChain
        withImpersonated
      >
        {children}
      </NovaConnectProvider>
    </SatelliteConnectProvider>
  );
}
