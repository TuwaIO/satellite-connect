import type { SatelliteSiwxState } from '@tuwaio/satellite-core';
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
   * Optional Sign-In With X (SIWX) session state.
   * If provided, the watcher will manage updates and disconnections based on SIWX status.
   * Directly compatible with `useSiwxSession()` from `@tuwaio/siwx-react`.
   */
  siwx?: SatelliteSiwxState;

  /**
   * @deprecated Legacy SIWE prop alias for backwards compatibility
   */
  siwe?: {
    isRejected?: boolean;
    isSignedIn?: boolean;
    enabled?: boolean;
  };
}

/**
 * A dynamic version of the EVMConnectorsWatcher component that avoids static imports.
 * This component dynamically imports the dependencies only when they are available.
 *
 * @param props - The component's props. See {@link EVMConnectorsWatcherProps} for details.
 * @returns {null} This component does not render any UI.
 *
 * @example
 * ```tsx
 * import { useSiwxSession } from '@tuwaio/siwx-react';
 * import { EVMConnectorsWatcher } from '@tuwaio/satellite-react/evm';
 *
 * function WatcherContainer() {
 *   const siwxSession = useSiwxSession();
 *   return <EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwx={siwxSession} />;
 * }
 * ```
 *
 * @remarks
 * Monitors Wagmi account and network changes. Automatically disconnects wallet state if SIWX
 * session validation fails or is rejected.
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
                { wagmiConfig: props.wagmiConfig, siwx: props.siwx, siwe: props.siwe },
                { activeConnection, disconnect, connectionError, updateActiveConnection },
              );

              return unwatch;
              // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [
              activeConnection?.connectorType,
              props.siwx,
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
