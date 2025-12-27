import { useEffect, useState } from 'react';

/**
 * Props for the {@link EVMConnectorsWatcher} component.
 */
export interface EVMConnectorsWatcherProps {
  /**
   * The configuration object from `@wagmi/core`.
   * This is required to initialize the account watcher.
   */
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
              'try { return typeof require !== "undefined" && Boolean(require("@wagmi/core") && require("viem")); } catch (e) { return false; }',
            );
            hasDependencies = checkImport();
          } catch {
            hasDependencies = false;
          }
        } else {
          // In non-bundler environment, use dynamic imports
          try {
            await Promise.all([import('@wagmi/core'), import('viem')]);
            hasDependencies = true;
          } catch {
            hasDependencies = false;
          }
        }

        if (hasDependencies) {
          // Dynamically import the actual implementation
          const dynamicImport = new Function(
            'return import("./EVMConnectorsWatcherImpl").then(module => module.EVMConnectorsWatcherImpl).catch(error => { console.warn("Failed to load EVMConnectorsWatcherImpl:", error); return null; })',
          );

          const WatcherImpl = await dynamicImport();
          setWatcherComponent(() => WatcherImpl);
        }
      } catch (error) {
        console.warn('Failed to load EVM watcher:', error);
      }
    };

    loadWatcher();
  }, []);

  // Render the actual watcher if it's loaded
  if (WatcherComponent) {
    return <WatcherComponent {...props} />;
  }

  // This is a headless component, so return null
  return null;
}
