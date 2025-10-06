'use client';

import { useCallback, useContext, useMemo } from 'react';

import { SiweAuthContext } from '../provider/SiweAuthContext';
import { SiweAuthContextType, SIWESession } from '../types';

/**
 * @function useSiweAuth
 * @description Hook to access the SIWE authentication state and methods.
 * @param {object} [options] - Optional callbacks that override provider-level callbacks.
 * @param {(session?: SIWESession) => void} [options.onSignIn] - Callback executed after a successful sign-in.
 * @param {() => void} [options.onSignOut] - Callback executed after a successful sign-out.
 * @returns {SiweAuthContextType}
 * * @example
 * // const { isSignedIn, signInWithSiwe, data, isRejected } = useSiweAuth();
 */
export function useSiweAuth(options?: {
  onSignIn?: (session?: SIWESession) => void;
  onSignOut?: () => void;
}): SiweAuthContextType {
  const context = useContext(SiweAuthContext);
  if (context === undefined) {
    throw new Error('useSiweAuth must be used within a SiweNextAuthProvider');
  }

  // Overrides the context's signOutSiwe/signInWithSiwe with local callbacks
  const signInWithSiwe = useCallback(async () => {
    return context.signInWithSiwe(options?.onSignIn);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.signInWithSiwe, options?.onSignIn]);

  const signOutSiwe = useCallback(async () => {
    return context.signOutSiwe(options?.onSignOut);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.signOutSiwe, options?.onSignOut]);

  return useMemo(
    () => ({
      ...context,
      signInWithSiwe,
      signOutSiwe,
    }),
    [context, signInWithSiwe, signOutSiwe],
  );
}
