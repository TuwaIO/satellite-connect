import type { SatelliteSiwxState } from '@tuwaio/satellite-core';
import { useMemo } from 'react';

/**
 * Returns a copy of a SIWX state that keeps its identity while the fields read by the connection watchers stay the
 * same, so a watcher is restarted when the session changes and not on every render. `useSiwxSession()` from
 * `@tuwaio/siwx-react` and inline objects return a new object on every render.
 *
 * @param siwx - SIWX state passed to a watcher, or `undefined`.
 * @returns `undefined` when `siwx` is missing, otherwise an object with the same `enabled`, `isSignedIn`,
 * `isAuthenticated`, `isRejected`, `status`, `address`, `chainId` and `session` (`address` and `chainId` only).
 * @internal
 */
export function useStableSiwxState(siwx: SatelliteSiwxState | undefined): SatelliteSiwxState | undefined {
  const hasSiwx = siwx !== undefined && siwx !== null;
  const enabled = siwx?.enabled;
  const isSignedIn = siwx?.isSignedIn;
  const isAuthenticated = siwx?.isAuthenticated;
  const isRejected = siwx?.isRejected;
  const status = siwx?.status;
  const address = siwx?.address;
  const chainId = siwx?.chainId;
  const hasSession = !!siwx?.session;
  const sessionAddress = siwx?.session?.address;
  const sessionChainId = siwx?.session?.chainId;

  return useMemo(
    () =>
      hasSiwx
        ? {
            enabled,
            isSignedIn,
            isAuthenticated,
            isRejected,
            status,
            address,
            chainId,
            session: hasSession ? { address: sessionAddress, chainId: sessionChainId } : null,
          }
        : undefined,
    [
      hasSiwx,
      enabled,
      isSignedIn,
      isAuthenticated,
      isRejected,
      status,
      address,
      chainId,
      hasSession,
      sessionAddress,
      sessionChainId,
    ],
  );
}
