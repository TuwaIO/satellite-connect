import { useEffect } from 'react';

/**
 * Props for useInitializeAppConnectors hook
 */
interface InitializeConnectorsProps {
  /** Function to initialize wallet connectors */
  initializeAppConnectors: () => Promise<void>;
  /** Optional error handler callback */
  onError?: (error: Error) => void;
}

/**
 * Custom hook for initializing wallet connectors with error handling
 *
 * @remarks
 * This hook handles the initialization of blockchain wallet connectors when a component mounts.
 * It provides default error handling with console.error if no custom handler is provided.
 * The initialization runs only once when the component mounts.
 *
 * @param props - Hook configuration
 * @param props.initializeAppConnectors - Async function that initializes the connectors
 * @param props.onError - Optional custom error handler
 *
 * @example
 * ```tsx
 * // Basic usage with default error handling
 * useInitializeAppConnectors({
 *   initializeAppConnectors: store.initializeAppConnectors
 * });
 *
 * // With custom error handling
 * useInitializeAppConnectors({
 *   initializeAppConnectors: store.initializeAppConnectors,
 *   onError: (error) => {
 *     toast.error(`Failed to initialize wallets: ${error.message}`);
 *   }
 * });
 * ```
 */
export const useInitializeAppConnectors = ({ initializeAppConnectors, onError }: InitializeConnectorsProps): void => {
  useEffect(() => {
    const initializeConnectors = async () => {
      try {
        await initializeAppConnectors();
      } catch (error) {
        // Use provided error handler or fallback to default console.error
        const errorHandler = onError ?? ((e: Error) => console.error('Failed to initialize connectors:', e));
        errorHandler(error as Error);
      }
    };

    // Initialize connectors when component mounts
    initializeConnectors();
  }, []); // Empty dependency array ensures single execution
};
