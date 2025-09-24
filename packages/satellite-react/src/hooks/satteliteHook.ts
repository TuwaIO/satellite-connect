import { ISatelliteConnectStore } from '@tuwaio/satellite-core';
import { createContext, useContext } from 'react';
import { StoreApi, useStore } from 'zustand';

export const SatelliteStoreContext = createContext<StoreApi<ISatelliteConnectStore> | null>(null);

export const useSatelliteConnectStore = <T>(selector: (state: ISatelliteConnectStore) => T): T => {
  const store = useContext(SatelliteStoreContext);
  if (!store) {
    throw new Error('useSatelliteConnectStore must be used within a SatelliteConnectProvider');
  }
  return useStore(store, selector);
};
