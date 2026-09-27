import { useEffect, useEffectEvent } from 'react';

/**
 * Parameters of {@link useInitializeAutoConnect}.
 */
export interface InitializeAutoConnectProps {
  /**
   * Restores the connection, for example `() => store.getState().initializeAutoConnect(true)`.
   *
   * @returns Resolves when done.
   */
  initializeAutoConnect: () => Promise<void>;
  /**
   * Called when `initializeAutoConnect` rejects; the function of the latest render is used. Defaults to
   * `console.error`.
   *
   * @param error - The rejection reason.
   */
  onError?: (error: Error) => void;
}

/**
 * Calls `initializeAutoConnect` once, in an effect after the component mounts (so only in the browser).
 * {@link SatelliteConnectProvider} already uses it; call it yourself only with a store you create with
 * `createSatelliteConnectStore` from `@tuwaio/satellite-core`.
 *
 * It runs once: later renders do not call `initializeAutoConnect` again. If it rejects, the error goes to the `onError`
 * of the latest render, so an inline `onError` needs no memoization. In development, React Strict Mode runs the
 * effect twice.
 *
 * @param props - The initializer and the optional error handler. See {@link InitializeAutoConnectProps}.
 *
 * @example
 * ```tsx
 * import { createSatelliteConnectStore } from '@tuwaio/satellite-core';
 * import { useInitializeAutoConnect } from '@tuwaio/satellite-react';
 * import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';
 *
 * const store = createSatelliteConnectStore({
 *   adapter: satelliteSolanaAdapter({ rpcUrls: { devnet: 'https://api.devnet.solana.com' } }),
 * });
 *
 * export function AutoConnect() {
 *   useInitializeAutoConnect({
 *     initializeAutoConnect: () => store.getState().initializeAutoConnect(true),
 *     onError: (error) => console.warn('Auto-connect failed:', error.message),
 *   });
 *   return null;
 * }
 * ```
 */
export const useInitializeAutoConnect = ({ initializeAutoConnect, onError }: InitializeAutoConnectProps): void => {
  // Effect Events read the props of the latest render without re-running the effect
  // `async` turns a synchronous throw into a rejection, so it also reaches `onError`
  const runInitializeAutoConnect = useEffectEvent(async () => initializeAutoConnect());
  const reportError = useEffectEvent((error: Error) => {
    // Use provided error handler or fallback to default console.error
    const errorHandler = onError ?? ((e: Error) => console.error('Failed to initialize auto connect:', e));
    errorHandler(error);
  });

  useEffect(() => {
    // Initialize auto connect once, when the component mounts
    runInitializeAutoConnect().catch((error: unknown) => reportError(error as Error));
  }, []);
};
