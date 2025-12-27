import { useEffect, useState } from 'react';

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
        // Check if the required dependencies are available
        const checkDependencies = new Function(
          'try { return Boolean(require("@wallet-standard/react")); } catch { return false; }',
        );

        const hasDependencies = checkDependencies();

        if (hasDependencies) {
          // Dynamically import the actual implementation
          const dynamicImport = new Function(
            'return import("./SolanaConnectorsWatcherImpl").then(module => module.SolanaConnectorsWatcherImpl).catch(error => { console.warn("Failed to load SolanaConnectorsWatcherImpl:", error); return null; })',
          );

          const WatcherImpl = await dynamicImport();
          setWatcherComponent(() => WatcherImpl);
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
