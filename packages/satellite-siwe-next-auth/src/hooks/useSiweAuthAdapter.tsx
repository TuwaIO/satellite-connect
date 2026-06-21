'use client';

import { disconnect } from '@wagmi/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useConnection } from 'wagmi';

import { SiweAuthContextType, SiweNextAuthProviderProps, SIWESession } from '../types';
import { useInterval } from './useInterval';
import { useSiweSignature } from './useSiweSignature';

type SessionStatus = 'loading' | 'authenticated' | 'unauthenticated';

/**
 * @function fetchSession
 * @description Fetches the current session status and data from the server.
 * @returns {Promise<{session: SIWESession | undefined, status: SessionStatus}>}
 */
async function fetchSession(): Promise<{ session: SIWESession | undefined; status: SessionStatus }> {
  try {
    const res = await fetch('/api/siwe/session');

    if (res.status === 401 || res.status === 404) {
      return { session: undefined, status: 'unauthenticated' };
    }

    if (!res.ok) {
      throw new Error('Failed to fetch session data.');
    }

    const data = await res.json();

    // NOTE: Data structure must match SiweSessionData {isLoggedIn, address, chainId}
    if (data.isLoggedIn && data.address && data.chainId) {
      return {
        session: { address: data.address, chainId: data.chainId },
        status: 'authenticated',
      };
    }
    return { session: undefined, status: 'unauthenticated' };
  } catch (e) {
    console.error('Error fetching session:', e);
    return { session: undefined, status: 'unauthenticated' };
  }
}

/**
 * @function useSiweAuthAdapter
 * Internal hook containing the core SIWE/Iron Session logic, acting as the authentication adapter.
 * @returns {SiweAuthContextType}
 */
export function useSiweAuthAdapter({
  wagmiConfig,
  enabled = true,
  nonceRefetchInterval = 5 * 60 * 1000, // 5 minutes (300,000 ms)
  onSignIn: providerOnSignIn,
  onSignOut: providerOnSignOut,
  getSiweMessageOptions,
}: SiweNextAuthProviderProps): SiweAuthContextType {
  const [localSession, setLocalSession] = useState<SIWESession | undefined>(undefined);
  const [sessionStatus, setSessionStatus] = useState<SessionStatus>('loading');

  const { isReadyToSign, getSiweSignature, isRejected } = useSiweSignature({ wagmiConfig });

  const { address, chainId, isConnected } = useConnection({ config: wagmiConfig });

  const [isSigningInAfterContextChange, setIsSigningInAfterContextChange] = useState(false);

  const isAuthenticated = sessionStatus === 'authenticated';
  const isAuthenticating = sessionStatus === 'loading';
  const data: SIWESession | undefined = localSession;

  // --- SESSION REFETCH (equivalent to NextAuth's update) ---
  const updateSession = useCallback(async () => {
    setSessionStatus('loading');
    const { session, status } = await fetchSession();
    setLocalSession(session);
    setSessionStatus(status);
    return session;
  }, []);

  // --- NONCE REFETCH LOGIC (Managed by custom interval) ---
  useInterval(() => {
    if (isAuthenticated) {
      updateSession();
    }
  }, nonceRefetchInterval);

  /**
   * @async
   * @method signOutSiwe
   * Clears the session by calling the server API.
   */
  const signOutSiwe = useCallback(
    async (userOnSignOut?: () => void) => {
      await fetch('/api/siwe/logout', { method: 'POST' }); // Destroy cryptographic session on server
      setLocalSession(undefined);
      setSessionStatus('unauthenticated');

      providerOnSignOut?.(); // Execute provider callback
      userOnSignOut?.(); // Execute user callback
    },
    [providerOnSignOut],
  );

  /**
   * @async
   * @method signInWithSiwe
   * Executes the full SIWE authentication flow: signature -> verification -> session creation.
   */
  const signInWithSiwe = useCallback(
    async (userOnSignIn?: (session?: SIWESession) => void) => {
      if (!enabled) {
        throw new Error('SIWE is currently disabled via provider configuration.');
      }

      setSessionStatus('loading');

      try {
        // 1. Get Signature using the low-level hook
        const signatureData = await getSiweSignature(getSiweMessageOptions);

        if (!signatureData) {
          setSessionStatus('unauthenticated');
          return;
        }

        // 2. Send message and signature to your cryptographic session verification API
        const response = await fetch('/api/siwe/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: signatureData.message,
            signature: signatureData.signature,
          }),
        });

        const responseBody = await response.json();

        if (!response.ok || responseBody.isLoggedIn !== true) {
          throw new Error(`Verification error: ${responseBody.message || 'Authentication failed.'}`);
        }

        console.log('SIWE Authentication successful.');

        // 3. Update session locally
        const finalSession: SIWESession = {
          address: responseBody.address,
          chainId: responseBody.chainId,
        };

        setLocalSession(finalSession);
        setSessionStatus('authenticated');

        // 4. Execute callbacks after successful sign-in
        providerOnSignIn?.(finalSession);
        userOnSignIn?.(finalSession);
      } catch (error) {
        await disconnect(wagmiConfig);
        setSessionStatus('unauthenticated');
        throw new Error(`SIWE Sign-In failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    [enabled, getSiweSignature, getSiweMessageOptions, providerOnSignIn, wagmiConfig],
  );

  // --- OBLIGATORY SESSION RESET / AUTO-SIGN IN EFFECT ---

  useEffect(() => {
    if (isAuthenticated && enabled) {
      const sessionAddress = localSession?.address?.toLowerCase();
      const currentAddress = address?.toLowerCase();
      const sessionChainId = localSession?.chainId;
      const currentChainId = chainId;

      const addressChanged = sessionAddress && currentAddress && sessionAddress !== currentAddress;
      const chainChanged = sessionChainId && currentChainId && sessionChainId !== currentChainId;
      const walletDisconnected = !isConnected;

      if (addressChanged || chainChanged) {
        console.log('SIWE: Connector context changed (Address or Chain ID). Initiating re-authentication.');

        setIsSigningInAfterContextChange(true);

        // 1. OBLIGATORY SIGN OUT for the old session (security)
        signOutSiwe();
      } else if (walletDisconnected) {
        // Handle explicit connector disconnection: Always sign out.
        console.log('SIWE: Connector disconnected. Disconnecting session.');
        signOutSiwe();
        providerOnSignOut?.(); // Execute provider callback for disconnect
      }
    }
  }, [isAuthenticated, address, chainId, isConnected, localSession, signOutSiwe, enabled, providerOnSignOut]);

  // --- EFFECT TO EXECUTE AUTO SIGN-IN AFTER STATE RESET ---
  useEffect(() => {
    // Triggers when: 1. Flag is set AND 2. Status transitioned to 'unauthenticated'
    if (isSigningInAfterContextChange && sessionStatus === 'unauthenticated' && isReadyToSign && enabled) {
      console.log('SIWE: State reset detected. Attempting automatic sign-in to establish new session.');

      setIsSigningInAfterContextChange(false); // Reset flag

      // Auto sign-in execution
      signInWithSiwe().catch((e) => {
        throw new Error(
          `SIWE Auto Sign-In failed after context change: ${e instanceof Error ? e.message : 'Unknown error'}`,
        );
      });
    }
  }, [isSigningInAfterContextChange, sessionStatus, isReadyToSign, signInWithSiwe, enabled]);

  // --- FINAL EXPORT ---

  return useMemo(
    () => ({
      data,
      isReadyToSign,
      isRejected,
      isLoading: isAuthenticating,
      isSignedIn: isAuthenticated,
      signInWithSiwe,
      signOutSiwe,
      enabled,
    }),
    [data, isReadyToSign, isRejected, isAuthenticating, isAuthenticated, signInWithSiwe, signOutSiwe, enabled],
  );
}
