import type { SatelliteSiwxState } from '@tuwaio/satellite-core';
import { useEffect, useState } from 'react';

import { useSatelliteConnectStore } from '../hooks/satelliteHook';

/**
 * Props for the {@link SolanaConnectorsWatcher} component.
 */
export interface SolanaConnectorsWatcherProps {
  /**
   * Optional Sign-In With X (SIWX) session state.
   * If provided, the watcher will manage updates and disconnections based on SIWX status.
   * Directly compatible with `useSiwxSession()` from `@tuwaio/siwx-react`.
   */
  siwx?: SatelliteSiwxState;
}

/**
 * A dynamic version of the SolanaConnectorsWatcher component that avoids static imports.
 * This component dynamically imports the dependencies only when they are available.
 *
 * @param props - Component props containing optional SIWX session state.
 * @returns null - This is a headless component
 *
 * @example
 * ```tsx
 * import { useSiwxSession } from '@tuwaio/siwx-react';
 * import { SolanaConnectorsWatcher } from '@tuwaio/satellite-react/solana';
 *
 * function WatcherContainer() {
 *   const siwxSession = useSiwxSession();
 *   return <SolanaConnectorsWatcher siwx={siwxSession} />;
 * }
 * ```
 *
 * @remarks
 * Monitors Wallet Standard account changes. Automatically disconnects wallet state if SIWX
 * session validation fails or is rejected.
 */
export function SolanaConnectorsWatcher(props: SolanaConnectorsWatcherProps = {}) {
  const [WatcherComponent, setWatcherComponent] = useState<React.ComponentType<SolanaConnectorsWatcherProps> | null>(
    null,
  );

  // Load the actual watcher component dynamically
  useEffect(() => {
    const loadWatcher = async () => {
      try {
        let hasDependencies = false;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let createSolanaConnectionsWatcher: any = null;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let useWallets: any = null;
        // Use dynamic imports
        try {
          const [satelliteSolana, wallets] = await Promise.all([
            import('@tuwaio/satellite-solana'),
            import('@wallet-standard/react'),
          ]);
          createSolanaConnectionsWatcher = satelliteSolana.createSolanaConnectionsWatcher;
          useWallets = wallets.useWallets;
          hasDependencies = true;
        } catch {
          hasDependencies = false;
        }

        if (hasDependencies) {
          const Watcher = () => {
            const wallets = useWallets();
            const activeConnection = useSatelliteConnectStore((store) => store.activeConnection);
            const updateActiveConnection = useSatelliteConnectStore((store) => store.updateActiveConnection);
            const connectionError = useSatelliteConnectStore((store) => store.connectionError);
            const disconnect = useSatelliteConnectStore((store) => store.disconnect);
            useEffect(() => {
              const unwatch = createSolanaConnectionsWatcher(
                { wallets, siwx: props.siwx },
                { activeConnection, disconnect, connectionError, updateActiveConnection },
              );
              return unwatch;
              // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [
              activeConnection?.connectorType,
              wallets,
              props.siwx,
              connectionError,
              updateActiveConnection,
              disconnect,
            ]);
            return null;
          };
          setWatcherComponent(() => Watcher);
        }
      } catch (error) {
        console.warn('Failed to load Solana watcher:', error);
      }
    };

    loadWatcher();
  }, [props.siwx]);

  // Render the actual watcher if it's loaded
  if (WatcherComponent) {
    return <WatcherComponent {...props} />;
  }

  // This is a headless component, so return null
  return null;
}
