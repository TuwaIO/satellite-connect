'use client';

import { ITxTrackingStore } from '@tuwaio/pulsar-core';
import { createContext, useContext } from 'react';
import { StoreApi, useStore } from 'zustand';

import { TransactionUnion } from '@/transactions';

type PulsarStore = ITxTrackingStore<TransactionUnion>;

export const PulsarStoreContext = createContext<StoreApi<PulsarStore> | null>(null);

export const usePulsarStore = <T>(selector: (state: PulsarStore) => T): T => {
  const store = useContext(PulsarStoreContext);
  if (!store) {
    throw new Error('usePulsarStore must be used within a PulsarProvider');
  }
  return useStore(store, selector);
};
