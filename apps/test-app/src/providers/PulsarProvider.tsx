'use client';

import { createPulsarStore } from '@tuwaio/pulsar-core';
import { evmAdapter } from '@tuwaio/pulsar-evm';
import { solanaAdapter } from '@tuwaio/pulsar-solana';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { SolanaClusterMoniker } from 'gill';
import { PropsWithChildren, useMemo } from 'react';
import { Chain } from 'viem/chains';

import { appEVMChains, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { PulsarStoreContext } from '@/hooks/txTrackingHooks';
import { TransactionUnion } from '@/transactions';

const storageName = 'transactions-tracking-storage';

export function PulsarProvider({ children }: PropsWithChildren) {
  const activeWallet = useSatelliteConnectStore((state) => state.activeWallet);

  const store = useMemo(() => {
    return createPulsarStore<TransactionUnion>({
      name: storageName,
      adapter: [
        evmAdapter(wagmiConfig, appEVMChains as never as Chain[]),
        solanaAdapter({
          wallet: {
            walletAddress: activeWallet?.address ?? '',
            walletType: activeWallet?.walletType ?? 'mainnet',
            walletActiveChain: (typeof activeWallet?.chainId === 'number'
              ? 'mainnet'
              : (activeWallet?.chainId ?? 'mainnet')) as SolanaClusterMoniker,
          },
          rpcUrls: solanaRPCUrls,
        }),
      ],
    });
  }, [activeWallet]);

  return <PulsarStoreContext.Provider value={store}>{children}</PulsarStoreContext.Provider>;
}
