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
  const { signInWithSiwe } = useSiweAuth();

  return (
    <SatelliteConnectProvider
      adapter={[satelliteEVMAdapter(wagmiConfig, signInWithSiwe), satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls })]}
      autoConnect={false} // should be false when using next-auth-siwe
    >
      <EVMWalletsWatcher wagmiConfig={wagmiConfig} />
      <SolanaWalletsWatcher />
      <StoreProvider>
        <NovaProvider />
        {children}
      </StoreProvider>
    </SatelliteConnectProvider>
  );
}
