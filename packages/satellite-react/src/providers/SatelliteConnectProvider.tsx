import { createSatelliteConnectStore, SatelliteConnectStoreInitialParameters } from '@tuwaio/satellite-core';
import { useMemo } from 'react';

import { SatelliteStoreContext } from '../hooks/satteliteHook';
import { InitializeConnectorsProvider } from './InitializeConnectorsProvider';

export function SatelliteConnectProvider({
  children,
  autoConnect,
  ...parameters
}: SatelliteConnectStoreInitialParameters & { children: React.ReactNode; autoConnect?: boolean }) {
  const store = useMemo(() => {
    return createSatelliteConnectStore({
      ...parameters,
    });
  }, []);

  return (
    <SatelliteStoreContext.Provider value={store}>
      <InitializeConnectorsProvider autoConnect={autoConnect} />
      {children}
    </SatelliteStoreContext.Provider>
  );
}
