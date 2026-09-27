import { ISatelliteConnectStore } from '@tuwaio/satellite-core';
import { createContext, useContext } from 'react';
import { StoreApi, useStore } from 'zustand';

import { Connection, Connector } from '../types';

// The context is stored on `globalThis` under a global symbol, so several copies of this package share one context.
const CONTEXT_SYMBOL = Symbol.for('tuwaio.satellite.context');

/**
 * Value of {@link SatelliteStoreContext}: the store created by {@link SatelliteConnectProvider}, or `null` outside the
 * provider.
 */
export type SatelliteContextType = StoreApi<ISatelliteConnectStore<Connector, Connection>> | null;

interface CustomGlobal {
  [CONTEXT_SYMBOL]?: React.Context<SatelliteContextType>;
}

const _global = globalThis as unknown as CustomGlobal;

/**
 * React context that holds the store of {@link SatelliteConnectProvider}. Use {@link useSatelliteConnectStore} to read
 * it in components; read the context directly to call `getState()` or `subscribe` without re-rendering.
 *
 * The context object is created once and saved on `globalThis` (`Symbol.for('tuwaio.satellite.context')`), so
 * packages that bundle their own copy of `@tuwaio/satellite-react` share the same context.
 */
export const SatelliteStoreContext =
  _global[CONTEXT_SYMBOL] || (_global[CONTEXT_SYMBOL] = createContext<SatelliteContextType>(null));

/**
 * Reads a value from the store of {@link SatelliteConnectProvider} and re-renders the component when it changes
 * (compared with `Object.is`, through `useStore` from `zustand`). Return stable values from the selector: a new
 * object or array on every call causes endless re-renders (use `useShallow` from `zustand/react/shallow`).
 *
 * @typeParam T - Type of the selected value.
 * @param selector - Selects a value from the store state (`ISatelliteConnectStore` from `@tuwaio/satellite-core`).
 * @returns The selected value.
 * @throws {Error} `useSatelliteConnectStore must be used within a SatelliteConnectProvider` outside the provider.
 *
 * @example
 * ```tsx
 * import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
 *
 * export function ActiveAddress() {
 *   const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);
 *   return <span>{activeConnection?.address ?? 'Not connected'}</span>;
 * }
 * ```
 */
export const useSatelliteConnectStore = <T>(
  selector: (state: ISatelliteConnectStore<Connector, Connection>) => T,
): T => {
  // Get store instance from context
  const store = useContext(SatelliteStoreContext);

  // Ensure hook is used within provider
  if (!store) {
    throw new Error('useSatelliteConnectStore must be used within a SatelliteConnectProvider');
  }

  // Return selected state using Zustand's useStore
  return useStore(store, selector);
};
