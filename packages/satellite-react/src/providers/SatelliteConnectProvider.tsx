import { createSatelliteConnectStore, SatelliteConnectStoreInitialParameters } from '@tuwaio/satellite-core';
import { useEffect, useMemo } from 'react';

import { SatelliteStoreContext } from '../hooks/satelliteHook';
import { useInitializeAutoConnect } from '../hooks/useInitializeAutoConnect';
import { Connection, Connector } from '../types';

/**
 * Props for SatelliteConnectProvider component
 */
export interface SatelliteConnectProviderProps extends SatelliteConnectStoreInitialParameters<Connector, Connection> {
  /** React child components */
  children: React.ReactNode;
  /** Whether to automatically connect to last used connector */
  autoConnect?: boolean;
}

/**
 * Provider component that manages connector connections and state
 *
 * @remarks
 * This component creates and provides the Satellite Connect store context to its children.
 * It handles connector connections, state management, and automatic reconnection functionality.
 * The store is memoized to ensure stable reference across renders.
 *
 * @param props - Component properties including store parameters and children
 * @param props.children - Child components that will have access to the store
 * @param props.autoConnect - Optional flag to enable automatic connector reconnection
 * @param props.adapter - Blockchain adapter(s) for connector interactions
 * @param props.callbackAfterConnected - Optional callback for successful connections
 *
 * @example
 * ```tsx
 * // Basic usage with single adapter
 * <SatelliteConnectProvider adapter={solanaAdapter}>
 *   <App />
 * </SatelliteConnectProvider>
 *
 * // With auto-connect and multiple adapters
 * <SatelliteConnectProvider
 *   adapter={[solanaAdapter, evmAdapter]}
 *   autoConnect={true}
 *   callbackAfterConnected={(wallet) => {
 *     console.log('Wallet connected:', wallet.address);
 *   }}
 * >
 *   <App />
 * </SatelliteConnectProvider>
 * ```
 */
export function SatelliteConnectProvider({ children, autoConnect, ...parameters }: SatelliteConnectProviderProps) {
  // Create and memoize the store instance
  const store = useMemo(() => {
    return createSatelliteConnectStore<Connector, Connection>({
      ...parameters,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array as store should be created only once

  // Disconnect from any existing connectors on mount
  useEffect(() => {
    store.getState().disconnectAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useInitializeAutoConnect({
    initializeAutoConnect: () => store.getState().initializeAutoConnect(autoConnect ?? false),
  });

  return <SatelliteStoreContext.Provider value={store}>{children}</SatelliteStoreContext.Provider>;
}
