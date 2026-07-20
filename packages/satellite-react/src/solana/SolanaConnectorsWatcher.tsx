import { useEffect, useState } from 'react';

import { useSatelliteConnectStore } from '../hooks/satelliteHook';

/**
 * A dynamic version of the SolanaConnectorsWatcher component that avoids static imports.
 * This component dynamically imports the dependencies only when they are available.
 *
 * @returns null - This is a headless component
 */
export function SolanaConnectorsWatcher() {
  const [WatcherComponent, setWatcherComponent] = useState<React.ComponentType | null>(null);

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
                { wallets },
                { activeConnection, disconnect, connectionError, updateActiveConnection },
              );
              return unwatch;
              // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [activeConnection?.connectorType, wallets, connectionError, updateActiveConnection, disconnect]);
            return null;
          };
          setWatcherComponent(() => Watcher);
        }
      } catch (error) {
        console.warn('Failed to load Solana watcher:', error);
      }
    };

    loadWatcher();
  }, []);

  // Render the actual watcher if it's loaded
  if (WatcherComponent) {
    return <WatcherComponent />;
  }

  // This is a headless component, so return null
  return null;
}
