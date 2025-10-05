'use client';

// Custom store hook to access the wallet connection state and sign message function
import { getAccount, signMessage } from '@wagmi/core';
import { getCsrfToken, signIn, signOut, useSession } from 'next-auth/react';
import React, { createContext, type ReactNode, useContext, useMemo } from 'react';
import type { Address } from 'viem';
// --- viem/siwe and viem types are used for message generation and typing ---
import { createSiweMessage, type SiweMessage } from 'viem/siwe';
import { useAccount, useConfig } from 'wagmi';

// --- TYPE DEFINITIONS for SIWE Configuration ---

/**
 * @typedef {Object} UnconfigurableMessageOptions
 * Fields in the SIWE message that are controlled internally by the adapter logic.
 * @property {Address} address - The Ethereum address signing the message (Viem type).
 * @property {number} chainId - The chain ID of the network.
 * @property {string} nonce - A unique, session-bound nonce from NextAuth CSRF token.
 */
type UnconfigurableMessageOptions = {
  address: Address;
  chainId: number;
  nonce: string;
};

/**
 * @typedef {Object} ConfigurableMessageOptions
 * Partial set of SIWE message fields that a consumer can optionally override.
 * Unconfigurable fields are omitted.
 */
type ConfigurableMessageOptions = Partial<Omit<SiweMessage, keyof UnconfigurableMessageOptions>>;

/**
 * @typedef {function(): ConfigurableMessageOptions} GetSiweMessageOptions
 * Function signature for customizing SIWE message options.
 */
export type GetSiweMessageOptions = () => ConfigurableMessageOptions;

// --- CONTEXT INTERFACE ---

/**
 * @interface SiweAuthContextType
 * Interface for the SIWE authentication context state and actions.
 * @property {boolean} isAuthenticated - True if the user has a valid NextAuth session.
 * @property {boolean} isAuthenticating - True if the session status is loading.
 * @property {function(): Promise<void>} signInWithSiwe - Initiates the SIWE sign-in flow.
 * @property {function(): Promise<void>} signOutSiwe - Terminates the NextAuth session.
 * @property {string | undefined} userAddress - The wallet address from the NextAuth session.
 */
interface SiweAuthContextType {
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  signInWithSiwe: () => Promise<void>;
  signOutSiwe: () => Promise<void>;
  userAddress: string | undefined;
}

export const SiweAuthContext = createContext<SiweAuthContextType | undefined>(undefined);

// --- LOW-LEVEL HOOK (SIWE Signature Generation) ---

/**
 * @interface UseSiweSignatureResult
 * @property {boolean} isReadyToSign - True if an EVM wallet is connected and ready to sign.
 * @property {function(GetSiweMessageOptions?): Promise<{message: string, signature: Address} | undefined>} getSiweSignature - Function to generate message and get signature.
 */
interface UseSiweSignatureResult {
  isReadyToSign: boolean;
  getSiweSignature: (
    customOptions?: GetSiweMessageOptions,
  ) => Promise<{ message: string; signature: Address } | undefined>;
}

/**
 * @function useSiweSignature
 * @description A low-level hook that handles the core SIWE cryptographic flow:
 * getting the nonce, creating the message, and getting the signature using Wagmi/Viem.
 * This is the building block for custom backend authentication.
 * @returns {UseSiweSignatureResult}
 * * @example
 * // const { getSiweSignature, isReadyToSign } = useSiweSignature();
 */
export function useSiweSignature(): UseSiweSignatureResult {
  const wagmiConfig = useConfig();
  const { isConnected, address, chainId } = useAccount({ config: wagmiConfig });

  const isReadyToSign = useMemo(() => isConnected && !!address && !!chainId, [isConnected, address, chainId]);

  const getSiweSignature = async (customOptions?: GetSiweMessageOptions) => {
    // Get the latest snapshot of the account state immediately before signing
    const walletSnapshot = getAccount(wagmiConfig);

    // Initial State Check: Throw error instead of returning undefined for robust handling
    if (!walletSnapshot.isConnected || !walletSnapshot.address || !walletSnapshot.chainId) {
      throw new Error('Wallet not connected or connection details are missing from Wagmi snapshot.');
    }

    try {
      const nonce = await getCsrfToken();
      if (!nonce) throw new Error('Failed to retrieve CSRF token/nonce from NextAuth.');

      const messageToSign = createSiweMessage({
        domain: window.location.host,
        statement: 'Sign in with Ethereum to the application.',
        uri: window.location.origin,
        version: '1',
        ...(customOptions ? customOptions() : {}), // Apply custom options
        address: walletSnapshot.address,
        chainId: walletSnapshot.chainId,
        nonce,
      });

      const signature = await signMessage(wagmiConfig, { message: messageToSign });

      if (!signature) {
        console.warn('Message signing cancelled by user or failed.');
        return undefined; // User cancelled the signing process
      }

      return { message: messageToSign, signature: signature as Address };
    } catch (error) {
      console.error('Error during signature generation:', error);
      // Re-throw the original error (e.g., wallet rejection, network error)
      throw error;
    }
  };

  return { getSiweSignature, isReadyToSign };
}

// --- CORE ADAPTER HOOK (SIWE Logic) ---

/**
 * @private
 * @function useSiweAuthAdapter
 * Internal hook containing the core SIWE/NextAuth logic, acting as the authentication adapter.
 * @param {GetSiweMessageOptions} [getSiweMessageOptions] - Optional function to customize SIWE message content.
 * @returns {SiweAuthContextType}
 */
function useSiweAuthAdapter({
  getSiweMessageOptions,
}: {
  getSiweMessageOptions?: GetSiweMessageOptions;
}): SiweAuthContextType {
  // Get NextAuth session status
  const { data: session, status } = useSession();

  const config = useConfig();
  const { isReadyToSign, getSiweSignature } = useSiweSignature();

  // Get current wallet state for authentication and change monitoring
  const { address, chainId, isConnected } = useAccount({ config });

  const isAuthenticated = status === 'authenticated';
  const isAuthenticating = status === 'loading';

  // Suppress TypeScript error for the custom 'address' property added in the NextAuth session callback.
  // This allows the provider to be universally reusable without requiring the consumer to extend NextAuth types.
  // @ts-expect-error: NextAuth Session data is not typed with custom 'address' property.
  const userAddress = session?.address ?? address;

  /**
   * @async
   * @method signOutSiwe
   * Clears the NextAuth session without redirection.
   */
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const signOutSiwe = async () => {
    await signOut({ redirect: false });
  };

  /**
   * @async
   * @method signInWithSiwe
   * Executes the full SIWE authentication flow: signature -> verification -> session creation.
   * This function is stable via useCallback.
   */
  const signInWithSiwe = React.useCallback(async () => {
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
    } catch (error) {
      console.error('SIWE Sign-In Error:', error);
      // Re-throw a standardized error so consumers can handle it
      throw new Error(`SIWE Sign-In failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, getSiweSignature, getSiweMessageOptions]);

  // --- OBLIGATORY SESSION RESET / AUTO-SIGN IN EFFECT ---

  // State to manage the auto-sign-in process after a context change
  const [isSigningInAfterContextChange, setIsSigningInAfterContextChange] = React.useState(false);

  React.useEffect(() => {
    // 1. Check if user is authenticated and wallet is connected/ready
    if (status === 'authenticated') {
      // @ts-expect-error: NextAuth Session data is not typed with custom 'address' property.
      const sessionAddress = session?.address?.toLowerCase();
      const currentAddress = address?.toLowerCase();
      // @ts-expect-error: Assuming session is extended with chainId
      const sessionChainId = session?.chainId;

      // Check if the current context (address/chainId) DOES NOT MATCH the session context
      const addressChanged = sessionAddress && currentAddress && sessionAddress !== currentAddress;
      const chainChanged = sessionChainId && chainId && sessionChainId !== chainId;
      const walletDisconnected = !isConnected;

      if (addressChanged || chainChanged) {
        console.log('SIWE: Wallet context changed (Address or Chain ID). Initiating re-authentication.');

        // Set flag to trigger sign-in after status change
        setIsSigningInAfterContextChange(true);

        // 1. OBLIGATORY SIGN OUT for the old session (security)
        signOut({ redirect: false });
      } else if (walletDisconnected) {
        // Handle explicit wallet disconnection: Always sign out.
        console.log('SIWE: Wallet disconnected. Disconnecting NextAuth session.');
        signOut({ redirect: false });
      }
    }
    // @ts-expect-error: NextAuth Session data is not typed with custom 'address' and 'chainId' property's.
  }, [status, address, chainId, isConnected, session?.address, session?.chainId]);

  // --- EFFECT TO EXECUTE AUTO SIGN-IN AFTER STATE RESET ---
  React.useEffect(() => {
    // Triggers when: 1. Flag is set AND 2. NextAuth status transitioned to 'unauthenticated'
    if (isSigningInAfterContextChange && status === 'unauthenticated' && isReadyToSign) {
      console.log('SIWE: State reset detected. Attempting automatic sign-in to establish new session.');

      signInWithSiwe().catch((e) => {
        // Log error but suppress full re-throw, as this is an auto-process
        console.error('SIWE Auto Sign-In failed after context change.', e);
      });

      setIsSigningInAfterContextChange(false); // Reset flag
    }
  }, [isSigningInAfterContextChange, status, isReadyToSign, signInWithSiwe]);

  return useMemo(
    () => ({
      isAuthenticated,
      isAuthenticating,
      signInWithSiwe,
      signOutSiwe,
      userAddress,
    }),
    [isAuthenticated, isAuthenticating, userAddress, signInWithSiwe, signOutSiwe],
  );
}

// --- EXPORTED PROVIDER COMPONENT ---

/**
 * @interface SiweNextAuthProviderProps
 * @property {GetSiweMessageOptions} [getSiweMessageOptions] - Optional function to customize the SIWE message.
 * @property {ReactNode} children - Child components.
 */
interface SiweNextAuthProviderProps {
  getSiweMessageOptions?: GetSiweMessageOptions;
  children: ReactNode;
}

/**
 * @component
 * @name SiweNextAuthProvider
 * @description Universal Provider for Sign-In with Ethereum (SIWE) using NextAuth.js.
 * This component handles the SIWE authentication logic.
 * It must be nested inside NextAuth's `<SessionProvider>` and your Wagmi Provider.
 * * **Note**: This provider requires the server-side NextAuth configuration to be set up
 * to handle the SIWE credentials provider and extend the session with the wallet address.
 * * * @example
 * // In src/providers/index.tsx or App layout:
 * // Note the nesting order: SessionProvider > WagmiProvider > SiweNextAuthProvider
 * function AppProviders({ children, session }) {
 * return (
 * <SessionProvider session={session}>
 * <WagmiProvider config={config}>
 * <SiweNextAuthProvider
 * getSiweMessageOptions={() => ({ statement: 'I consent to linking my wallet.' })}
 * >
 * {children}
 * </SiweNextAuthProvider>
 * </WagmiProvider>
 * </SessionProvider>
 * );
 * }
 */
export function SiweNextAuthProvider({ children, getSiweMessageOptions }: SiweNextAuthProviderProps) {
  const siweAuth = useSiweAuthAdapter({ getSiweMessageOptions });
  return <SiweAuthContext.Provider value={siweAuth}>{children}</SiweAuthContext.Provider>;
}

// --- EXPORTED CONSUMPTION HOOK ---

/**
 * @function useSiweAuth
 * @description Hook to access the SIWE authentication state and methods.
 * @returns {SiweAuthContextType}
 * * @example
 * // In any component:
 * import { useSiweAuth } from 'path/to/SiweNextAuthProvider';
 * * function ProtectedComponent() {
 * const { isAuthenticated, signInWithSiwe, signOutSiwe, userAddress } = useSiweAuth();
 * * if (!isAuthenticated) {
 * return <button onClick={signInWithSiwe}>Sign In with Wallet</button>;
 * }
 * * return (
 * <div>
 * Welcome back, {userAddress}!
 * <button onClick={signOutSiwe}>Sign Out</button>
 * </div>
 * );
 * }
 */
export function useSiweAuth(): SiweAuthContextType {
  const context = useContext(SiweAuthContext);
  if (context === undefined) {
    throw new Error('useSiweAuth must be used within a SiweNextAuthProvider');
  }
  return context;
}
