import { createSatelliteConnectStore, SatelliteConnectStoreInitialParameters } from '@tuwaio/satellite-core';
import { useEffect, useMemo } from 'react';

import { SatelliteStoreContext } from '../hooks/satelliteHook';
import { useInitializeAutoConnect } from '../hooks/useInitializeAutoConnect';
import { Connection, Connector } from '../types';

/**
 * Props of {@link SatelliteConnectProvider}: the store parameters (`adapter`, one adapter or an array, and the optional
 * `callbackAfterConnected`, see `SatelliteConnectStoreInitialParameters` from `@tuwaio/satellite-core`) plus the
 * fields below.
 */
export interface SatelliteConnectProviderProps extends SatelliteConnectStoreInitialParameters<Connector, Connection> {
  /** Components that can read the store. */
  children: React.ReactNode;
  /**
   * Whether to reconnect the last connected wallet after a page load (read on the first render only). Defaults to
   * `false`. See `initializeAutoConnect` of the store.
   */
  autoConnect?: boolean;
}

/**
 * Creates the Satellite Connect store (`createSatelliteConnectStore` from `@tuwaio/satellite-core`) and provides it to
 * its children through {@link SatelliteStoreContext}. Read it with {@link useSatelliteConnectStore}.
 *
 * The store is created once, on the first render. When `adapter` or `callbackAfterConnected` changes, the new value
 * is passed to the store's `updateParameters`; the state is kept. Define adapters outside the component (or memoize
 * them), so a render does not create new adapter objects. After mount the provider
 * calls the store's `initializeAutoConnect(autoConnect ?? false)` once, which disconnects the wallets of every adapter,
 * cleans the recently connected list in `localStorage` and, with `autoConnect`, reconnects the last connected wallet.
 * Inside Safe{Wallet} it connects the Safe connector instead, with or without `autoConnect`.
 * Render the chain watchers (`EVMConnectorsWatcher` from `@tuwaio/satellite-react/evm`, `SolanaConnectorsWatcher`
 * from `@tuwaio/satellite-react/solana`) inside it to follow wallet changes.
 *
 * @param props - The store parameters, `autoConnect` and `children`. See {@link SatelliteConnectProviderProps}.
 * @returns The context provider.
 *
 * @example
 * ```tsx
 * 'use client';
 *
 * import { SatelliteConnectProvider } from '@tuwaio/satellite-react';
 * import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';
 * import type { ReactNode } from 'react';
 *
 * const solanaAdapter = satelliteSolanaAdapter({ rpcUrls: { devnet: 'https://api.devnet.solana.com' } });
 *
 * export function Providers({ children }: { children: ReactNode }) {
 *   return (
 *     <SatelliteConnectProvider
 *       adapter={solanaAdapter}
 *       autoConnect
 *       callbackAfterConnected={(connection) => console.log('Connected:', connection.address)}
 *     >
 *       {children}
 *     </SatelliteConnectProvider>
 *   );
 * }
 * ```
 */
export function SatelliteConnectProvider({
  children,
  autoConnect,
  adapter,
  callbackAfterConnected,
}: SatelliteConnectProviderProps) {
  // Create and memoize the store instance
  const store = useMemo(() => {
    return createSatelliteConnectStore<Connector, Connection>({ adapter, callbackAfterConnected });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array as store should be created only once

  // Update store parameters when they change externally (not on every render)
  useEffect(() => {
    store.getState().updateParameters({ adapter, callbackAfterConnected });
  }, [store, adapter, callbackAfterConnected]);

  useInitializeAutoConnect({
    initializeAutoConnect: () => store.getState().initializeAutoConnect(autoConnect ?? false),
  });

  return <SatelliteStoreContext.Provider value={store}>{children}</SatelliteStoreContext.Provider>;
}
