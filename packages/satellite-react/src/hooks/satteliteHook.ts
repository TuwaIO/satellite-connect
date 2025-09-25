import { ISatelliteConnectStore } from '@tuwaio/satellite-core';
import { createContext, useContext } from 'react';
import { StoreApi, useStore } from 'zustand';

/**
 * React Context for providing Satellite Connect store throughout the application
 * @internal
 */
export const SatelliteStoreContext = createContext<StoreApi<ISatelliteConnectStore> | null>(null);

/**
 * Custom hook for accessing the Satellite Connect store state
 *
 * @remarks
 * This hook provides type-safe access to the Satellite store state and must be used
 * within a component that is wrapped by SatelliteConnectProvider.
 *
 * @typeParam T - The type of the selected state slice
 * @param selector - Function that selects a slice of the store state
 * @returns Selected state slice
 *
 * @throws Error if used outside of SatelliteConnectProvider
 *
 * @example
 * ```tsx
 * // Get the active wallet
 * const activeWallet = useSatelliteConnectStore((state) => state.activeWallet);
 * ```
 */
export const useSatelliteConnectStore = <T>(selector: (state: ISatelliteConnectStore) => T): T => {
  // Get store instance from context
  const store = useContext(SatelliteStoreContext);

  // Ensure hook is used within provider
  if (!store) {
    throw new Error('useSatelliteConnectStore must be used within a SatelliteConnectProvider');
  }

  // Return selected state using Zustand's useStore
  return useStore(store, selector);
};
