import { useSatelliteConnectStore } from '../hooks/satteliteHook';
import { useInitializeAppConnectors } from '../hooks/useInitializeConnectors';

/**
 * Props for InitializeConnectorsProvider component
 */
interface InitializeConnectorsProviderProps {
  /** Whether to automatically connect to the last used wallet */
  autoConnect?: boolean;
}

/**
 * Provider component that handles wallet connectors initialization
 *
 * @remarks
 * This is a headless component that initializes wallet connectors when mounted.
 * It integrates with the Satellite Connect store and supports automatic reconnection
 * to the last used wallet via the autoConnect prop.
 *
 * @param props - Component properties
 * @param props.autoConnect - Optional flag to enable automatic wallet reconnection
 *
 * @returns null - This is a headless component
 *
 **/
export function InitializeConnectorsProvider({ autoConnect }: InitializeConnectorsProviderProps) {
  // Get the initialization function from the store
  const initializeAppConnectors = useSatelliteConnectStore((state) => state.initializeAppConnectors);

  // Initialize connectors with autoConnect configuration
  useInitializeAppConnectors({
    initializeAppConnectors: () => initializeAppConnectors({ autoConnect }),
  });

  // This is a headless component
  return null;
}
