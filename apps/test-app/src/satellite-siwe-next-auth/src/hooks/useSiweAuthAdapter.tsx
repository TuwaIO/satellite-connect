'use client';

import { getAccount } from '@wagmi/core';
import { signIn, signOut, useSession } from 'next-auth/react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAccount, useConfig } from 'wagmi';

import { SiweAuthContextType, SiweNextAuthProviderProps, SIWESession } from '../types';
import { useInterval } from './useInterval';
import { useSiweSignature } from './useSiweSignature';

/**
 * @function useSiweAuthAdapter
 * Internal hook containing the core SIWE/NextAuth logic, acting as the authentication adapter.
 * @returns {SiweAuthContextType}
 */
export function useSiweAuthAdapter({
  enabled = true,
  nonceRefetchInterval = 5 * 60 * 1000, // 5 minutes (300,000 ms)
  onSignIn: providerOnSignIn,
  onSignOut: providerOnSignOut,
  getSiweMessageOptions,
}: SiweNextAuthProviderProps): SiweAuthContextType {
  const { data: session, status, update } = useSession();

  const config = useConfig();
  const { isReadyToSign, getSiweSignature, isRejected } = useSiweSignature();

  // Get current wallet state for authentication and change monitoring
  const { address, chainId, isConnected } = useAccount({ config });

  // Custom state for managing auto-login flow
  const [isSigningInAfterContextChange, setIsSigningInAfterContextChange] = useState(false);

  const isAuthenticated = status === 'authenticated';
  const isAuthenticating = status === 'loading';

  // Final session data object
  const data: SIWESession | undefined = useMemo(() => {
    // @ts-expect-error: NextAuth Session data is not typed with custom properties.
    if (session?.address && session?.chainId) {
      // @ts-expect-error: NextAuth Session data is not typed with custom properties.
      return { address: session.address, chainId: session.chainId };
    }
    return undefined;
  }, [session]);

  // --- NONCE REFETCH LOGIC (Managed by custom interval) ---
  // Triggers session/token refetch, refreshing the session/nonce
  useInterval(() => {
    if (isAuthenticated) {
      update();
    }
  }, nonceRefetchInterval);

  /**
   * @async
   * @method signOutSiwe
   * Clears the NextAuth session without redirection.
   */
  const signOutSiwe = useCallback(
    async (userOnSignOut?: () => void) => {
      await signOut({ redirect: false });
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

      try {
        // 1. Get Signature using the low-level hook (throws if wallet is not ready)
        const signatureData = await getSiweSignature(getSiweMessageOptions);

        if (!signatureData) {
          return; // User cancelled signing (handled inside useSiweSignature)
        }

        // 2. Send message and signature to NextAuth API for server-side verification
        const response = await signIn('credentials', {
          message: signatureData.message,
          signature: signatureData.signature,
          redirect: false,
        });

        if (response?.error) {
          throw new Error(`Verification error: ${response.error}`);
        }

        console.log('SIWE Authentication successful.');

        // 3. Execute callbacks after successful sign-in
        const walletSnapshot = getAccount(config);
        const finalSession: SIWESession | undefined =
          walletSnapshot?.address && walletSnapshot?.chainId
            ? { address: walletSnapshot.address, chainId: walletSnapshot.chainId }
            : undefined;

        providerOnSignIn?.(finalSession);
        userOnSignIn?.(finalSession);
      } catch (error) {
        throw new Error(`SIWE Sign-In failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    },
    [enabled, getSiweSignature, getSiweMessageOptions, config, providerOnSignIn],
  );

  // --- OBLIGATORY SESSION RESET / AUTO-SIGN IN EFFECT ---

  useEffect(() => {
    if (status === 'authenticated' && enabled) {
      // @ts-expect-error: NextAuth Session data is not typed with custom 'address' property.
      const sessionAddress = session?.address?.toLowerCase();
      const currentAddress = address?.toLowerCase();
      // @ts-expect-error: NextAuth Session data is not typed with custom 'chainId' property.
      const sessionChainId = session?.chainId;

      const addressChanged = sessionAddress && currentAddress && sessionAddress !== currentAddress;
      const chainChanged = sessionChainId && chainId && sessionChainId !== chainId;
      const walletDisconnected = !isConnected;

      if (addressChanged || chainChanged) {
        console.log('SIWE: Wallet context changed (Address or Chain ID). Initiating re-authentication.');

        setIsSigningInAfterContextChange(true);

        // 1. OBLIGATORY SIGN OUT for the old session (security)
        signOut({ redirect: false });
      } else if (walletDisconnected) {
        // Handle explicit wallet disconnection: Always sign out.
        console.log('SIWE: Wallet disconnected. Disconnecting NextAuth session.');
        signOut({ redirect: false });
        providerOnSignOut?.(); // Execute provider callback for disconnect
      }
    }
    // @ts-expect-error: NextAuth Session data is not typed with custom 'address' and 'chainId' property's.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, address, chainId, isConnected, session?.address, session?.chainId, signOut, enabled, providerOnSignOut]);

  // --- EFFECT TO EXECUTE AUTO SIGN-IN AFTER STATE RESET ---
  useEffect(() => {
    // Triggers when: 1. Flag is set AND 2. NextAuth status transitioned to 'unauthenticated'
    if (isSigningInAfterContextChange && status === 'unauthenticated' && isReadyToSign && enabled) {
      console.log('SIWE: State reset detected. Attempting automatic sign-in to establish new session.');

      setIsSigningInAfterContextChange(false); // Reset flag

      // Auto sign-in execution
      signInWithSiwe().catch((e) => {
        throw new Error(
          `SIWE Auto Sign-In failed after context change: ${e instanceof Error ? e.message : 'Unknown error'}`,
        );
      });
    }
  }, [isSigningInAfterContextChange, status, isReadyToSign, signInWithSiwe, enabled, config]);

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
