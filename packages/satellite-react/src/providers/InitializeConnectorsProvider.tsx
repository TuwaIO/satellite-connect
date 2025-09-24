import { useSatelliteConnectStore } from '../hooks/satteliteHook';
import { useInitializeAppConnectors } from '../hooks/useInitializeConnectors';

export function InitializeConnectorsProvider({ autoConnect }: { autoConnect?: boolean }) {
  const initializeAppConnectors = useSatelliteConnectStore((state) => state.initializeAppConnectors);
  useInitializeAppConnectors({ initializeAppConnectors: () => initializeAppConnectors({ autoConnect }) });
  return null;
}
