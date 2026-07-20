import { useEffect, useState } from 'react';

import { useSatelliteConnectStore } from '../index';

/**
 * Props for the {@link EVMConnectorsWatcher} component.
 */
export interface EVMConnectorsWatcherProps {
  /**
   * The configuration object from `@wagmi/core`.
   * This is required to initialize the account watcher.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wagmiConfig: any; // Using 'any' to avoid direct import of @wagmi/core types

  /**
   * Optional object representing the Sign-In With Ethereum (SIWE) state.
   * If provided, the watcher will use this state to manage updates
   * and disconnections based on SIWE status.
   */
  siwe?: {
    /**
     * Flag indicating if the SIWE authentication request was rejected by the user.
     */
    isRejected: boolean;
    /**
     * Flag indicating if the user is successfully signed in via SIWE.
     */
    isSignedIn: boolean;
    /**
     * Flag indicating if the SIWE flow is enabled.
     */
    enabled?: boolean;
  };
}

/**
 * A dynamic version of the EVMConnectorsWatcher component that avoids static imports.
 * This component dynamically imports the dependencies only when they are available.
 *
 * @param props - The component's props. See {@link EVMConnectorsWatcherProps} for details.
 * @returns {null} This component does not render any UI.
 */
export function EVMConnectorsWatcher(props: EVMConnectorsWatcherProps) {
  const [WatcherComponent, setWatcherComponent] = useState<React.ComponentType<EVMConnectorsWatcherProps> | null>(null);

  // Load the actual watcher component dynamically
  useEffect(() => {
    const loadWatcher = async () => {
      try {
        let hasDependencies = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let createEVMConnectionsWatcher: any = null;

        // Use dynamic imports
        try {
          const [satelliteEVM] = await Promise.all([
            import('@tuwaio/satellite-evm'),
            import('@wagmi/core'),
            import('viem'),
          ]);
          createEVMConnectionsWatcher = satelliteEVM.createEVMConnectionsWatcher;
          hasDependencies = true;
        } catch {
          hasDependencies = false;
        }

        if (hasDependencies) {
          const Watcher = () => {
            const activeConnection = useSatelliteConnectStore((store) => store.activeConnection);
            const disconnect = useSatelliteConnectStore((store) => store.disconnect);
            const connectionError = useSatelliteConnectStore((store) => store.connectionError);
            const updateActiveConnection = useSatelliteConnectStore((store) => store.updateActiveConnection);

            useEffect(() => {
              const unwatch = createEVMConnectionsWatcher(
                { wagmiConfig: props.wagmiConfig, siwe: props.siwe },
                { activeConnection, disconnect, connectionError, updateActiveConnection },
              );

              return unwatch;
              // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [
              activeConnection?.connectorType,
              props.siwe,
              connectionError,
              props.wagmiConfig,
              disconnect,
              updateActiveConnection,
            ]);
            return null;
          };
          setWatcherComponent(() => Watcher);
        }
      } catch (error) {
        console.warn('Failed to load EVM watcher:', error);
      }
    };

    loadWatcher();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Render the actual watcher if it's loaded
  if (WatcherComponent) {
    return <WatcherComponent {...props} />;
  }

  // This is a headless component, so return null
  return null;
}
