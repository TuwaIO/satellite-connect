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
        // Use a browser-compatible way to detect bundler environment
        const isBundlerEnv = typeof window === 'undefined' || 
                            (typeof window !== 'undefined' && 
                             typeof window.document !== 'undefined' && 
                             typeof window.document.createElement !== 'undefined');

        let hasDependencies = false;

        if (isBundlerEnv) {
          // In bundler environment, use require
          try {
            // Use globalThis to access global scope
            const checkImport = new Function(
              'try { return typeof require !== "undefined" && Boolean(require("@wallet-standard/react")); } catch (e) { return false; }'
            );
            hasDependencies = checkImport();
          } catch {
            hasDependencies = false;
          }
        } else {
          // In non-bundler environment, use dynamic imports
          try {
            await import('@wallet-standard/react');
            hasDependencies = true;
          } catch {
            hasDependencies = false;
          }
        }

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
