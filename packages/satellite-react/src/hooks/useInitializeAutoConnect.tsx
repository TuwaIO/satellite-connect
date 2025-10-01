import { useEffect } from 'react';

/**
 * Props for the useInitializeAutoConnect hook.
 */
interface InitializeAutoConnectProps {
  /** Function to initialize auto connect logic */
  initializeAutoConnect: () => Promise<void>;
  /** Optional error handler callback */
  onError?: (error: Error) => void;
}

/**
 * Custom hook for initializing wallet auto-connection with error handling.
 *
 * @remarks
 * This hook handles the initial connection logic (e.g., checking for a previously
 * connected wallet) when a component mounts.
 * It provides default error handling with console.error if no custom handler is provided.
 * The initialization runs only once when the component mounts.
 *
 * @param props - Hook configuration
 * @param props.initializeAutoConnect - Async function that executes the auto-connect logic
 * @param props.onError - Optional custom error handler
 *
 * @example
 * ```tsx
 * // Basic usage with default error handling
 * useInitializeAutoConnect({
 *  initializeAutoConnect: store.initializeAutoConnect
 * });
 *
 * // With custom error handling
 * useInitializeAutoConnect({
 *  initializeAutoConnect: store.initializeAutoConnect,
 *  onError: (error) => {
 *    toast.error(`Failed to auto-connect: ${error.message}`);
 * }
 * });
 * ```
 */
export const useInitializeAutoConnect = ({ initializeAutoConnect, onError }: InitializeAutoConnectProps): void => {
  useEffect(() => {
    const initializeAutoConnectLocal = async () => {
      try {
        await initializeAutoConnect();
      } catch (error) {
        // Use provided error handler or fallback to default console.error
        const errorHandler = onError ?? ((e: Error) => console.error('Failed to initialize auto connect:', e));
        errorHandler(error as Error);
      }
    };
    // Initialize auto connect when component mounts
    initializeAutoConnectLocal();
  }, []); // Empty dependency array ensures single execution
};
