import type { ReactNode } from 'react';
import type { Address } from 'viem';
import type { SiweMessage } from 'viem/siwe';

// --- TYPE DEFINITIONS for SIWE Configuration ---

/**
 * @typedef {Object} UnconfigurableMessageOptions
 * Fields in the SIWE message that are controlled internally by the adapter logic.
 * @property {Address} address - The Ethereum address signing the message (Viem type).
 * @property {number} chainId - The chain ID of the network.
 * @property {string} nonce - A unique, session-bound nonce from NextAuth CSRF token.
 */
export type UnconfigurableMessageOptions = {
  address: Address;
  chainId: number;
  nonce: string;
};

/**
 * @typedef {Object} ConfigurableMessageOptions
 * Partial set of SIWE message fields that a consumer can optionally override.
 * Unconfigurable fields are omitted.
 */
export type ConfigurableMessageOptions = Partial<Omit<SiweMessage, keyof UnconfigurableMessageOptions>>;

/**
 * @typedef {function(): ConfigurableMessageOptions} GetSiweMessageOptions
 * Function signature for customizing SIWE message options.
 */
export type GetSiweMessageOptions = () => ConfigurableMessageOptions;

/**
 * @interface SIWESession
 * The authenticated user data structure derived from the NextAuth session.
 */
export interface SIWESession {
  address: Address;
  chainId: number;
}

// --- CONTEXT INTERFACE ---

/**
 * @interface SiweAuthContextType
 * Interface for the SIWE authentication context state and actions.
 * @property {SIWESession | undefined} data - The authenticated SIWE data (address, chainId) if signed in.
 * @property {boolean} isReadyToSign - True if an EVM wallet is connected and ready to sign.
 * @property {boolean} isRejected - True if the last signing attempt was explicitly rejected by the user.
 * @property {boolean} isLoading - True if the session status is loading.
 * @property {boolean} isSignedIn - True if the user has a valid NextAuth session.
 * @property {function(onSignIn?: (session?: SIWESession) => void): Promise<void>} signInWithSiwe - Initiates the SIWE sign-in flow.
 * @property {function(onSignOut?: () => void): Promise<void>} signOutSiwe - Terminates the NextAuth session.
 */
export interface SiweAuthContextType {
  data: SIWESession | undefined;
  isReadyToSign: boolean;
  isRejected: boolean;
  isLoading: boolean;
  isSignedIn: boolean;
  enabled: boolean;
  signInWithSiwe: (onSignIn?: (session?: SIWESession) => void) => Promise<void>;
  signOutSiwe: (onSignOut?: () => void) => Promise<void>;
}

/**
 * @interface UseSiweSignatureResult
 * @property {boolean} isReadyToSign - True if an EVM wallet is connected and ready to sign.
 * @property {boolean} isRejected - True if the last signing attempt was explicitly rejected by the user.
 * @property {function(GetSiweMessageOptions?): Promise<{message: string, signature: Address} | undefined>} getSiweSignature - Function to generate message and get signature.
 */
export interface UseSiweSignatureResult {
  isReadyToSign: boolean;
  isRejected: boolean;
  getSiweSignature: (
    customOptions?: GetSiweMessageOptions,
  ) => Promise<{ message: string; signature: Address } | undefined>;
}

/**
 * @interface SiweNextAuthProviderProps
 * @property {boolean} [enabled=true] - Enables or disables SIWE authentication globally.
 * @property {number} [nonceRefetchInterval=300000] - Interval (ms) for refetching session/nonce token (defaults to 5 mins).
 * @property {(session?: SIWESession) => void} [onSignIn] - Callback executed after a successful SIWE sign-in.
 * @property {() => void} [onSignOut] - Callback executed after a successful sign-out or wallet disconnect.
 * @property {GetSiweMessageOptions} [getSiweMessageOptions] - Optional function to customize the SIWE message fields.
 * @property {ReactNode} children - Child components.
 */
export interface SiweNextAuthProviderProps {
  enabled?: boolean;
  nonceRefetchInterval?: number;
  onSignIn?: (session?: SIWESession) => void;
  onSignOut?: () => void;
  getSiweMessageOptions?: GetSiweMessageOptions;
  children: ReactNode;
}
