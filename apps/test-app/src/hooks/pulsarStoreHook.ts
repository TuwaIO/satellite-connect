'use client';

import { createBoundedUseStore } from '@tuwaio/orbit-core';
import { createPulsarStore } from '@tuwaio/pulsar-core';
import { pulsarEvmAdapter } from '@tuwaio/pulsar-evm';
import { pulsarSolanaAdapter } from '@tuwaio/pulsar-solana';

import { appEVMChains, solanaRPCUrls, wagmiConfig } from '@/configs/appConfig';
import { TransactionUnion } from '@/transactions';

const storageName = 'transactions-tracking-storage';

export const usePulsarStore = createBoundedUseStore(
  createPulsarStore<TransactionUnion>({
    name: storageName,
    adapter: [
      pulsarEvmAdapter(wagmiConfig, appEVMChains),
      pulsarSolanaAdapter({
        rpcUrls: solanaRPCUrls,
      }),
    ],
  }),
);
