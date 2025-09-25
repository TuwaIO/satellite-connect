import { createSatelliteConnectStore, SatelliteConnectStoreInitialParameters } from '@tuwaio/satellite-core';
import { useMemo } from 'react';

import { SatelliteStoreContext } from '../hooks/satteliteHook';
import { InitializeConnectorsProvider } from './InitializeConnectorsProvider';

/**
 * Props for SatelliteConnectProvider component
 */
interface SatelliteConnectProviderProps extends SatelliteConnectStoreInitialParameters {
  /** React child components */
  children: React.ReactNode;
  /** Whether to automatically connect to last used wallet */
  autoConnect?: boolean;
}

/**
 * Provider component that manages wallet connections and state
 *
 * @remarks
 * This component creates and provides the Satellite Connect store context to its children.
 * It handles wallet connections, state management, and automatic reconnection functionality.
 * The store is memoized to ensure stable reference across renders.
 *
 * @param props - Component properties including store parameters and children
 * @param props.children - Child components that will have access to the store
 * @param props.autoConnect - Optional flag to enable automatic wallet reconnection
 * @param props.adapter - Blockchain adapter(s) for wallet interactions
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
    return createSatelliteConnectStore({
      ...parameters,
    });
  }, []); // Empty dependency array as store should be created only once

  return (
    <SatelliteStoreContext.Provider value={store}>
      <InitializeConnectorsProvider autoConnect={autoConnect} />
      {children}
    </SatelliteStoreContext.Provider>
  );
}
