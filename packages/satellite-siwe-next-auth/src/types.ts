import type { ReactNode } from 'react';
import type { Address } from 'viem';
import type { SiweMessage } from 'viem/siwe';

// --- TYPE DEFINITIONS for SIWE Configuration ---

/**
 * Interface for the optional cookie serialization options.
 * Matches common fields of `CookieSerializeOptions` from the 'cookie' package.
 */
export interface SiweCookieOptions {
  /** The value of the Max-Age Set-Cookie attribute in seconds. */
  maxAge?: number;
  /** The "Domain" Set-Cookie attribute. */
  domain?: string;
  /** The "Path" Set-Cookie attribute. */
  path?: string;
  /** The "Expires" Set-Cookie attribute. */
  expires?: Date;
  /** The "HttpOnly" Set-Cookie attribute. */
  httpOnly?: boolean;
  /** The "Secure" Set-Cookie attribute. */
  secure?: boolean;
  /** The "SameSite" Set-Cookie attribute. */
  sameSite?: boolean | 'lax' | 'strict' | 'none';
}

/**
 * Interface for the session settings block provided by the user.
 */
export interface SiweSessionSettings {
  /** The name of the cookie to store the session data. Defaults to "satellite-siwe". */
  cookieName?: string;
  /** * The password/secret used to encrypt the session data.
   * Defaults to `process.env.SESSION_SECRET`.
   */
  password?: string;
  /** Optional options for cookie serialization. */
  cookieOptions?: SiweCookieOptions;
}

/**
 * Interface for the custom SIWE API hooks block provided by the user.
 */
export interface SiweApiHooks {
  /** Hook executed after the user is successfully logged out. */
  afterLogout?: () => Promise<void> | void;
  /** Hook executed before SIWE message verification (e.g., when the message is available). */
  afterNonce?: () => Promise<void> | void;
  /** Hook executed after the session is successfully created/saved. */
  afterSession?: () => Promise<void> | void;
  /** Hook executed after the SIWE signature is successfully verified. */
  afterVerify?: () => Promise<void> | void;
}

/**
 * The complete configuration object for the SIWE API handler factory.
 */
export interface SiweApiConfig {
  /** Session configuration settings for Iron Session. */
  session?: SiweSessionSettings;
  /** Custom callback hooks for various steps of the SIWE process. */
  options?: SiweApiHooks;
}

/**
 * Defines the data structure stored inside the Iron Session.
 */
export interface SiweSessionData {
  address: string;
  chainId: number;
  isLoggedIn: boolean;
}

/**
 * Type alias for the Iron Session data.
 */
export type Session = SiweSessionData;

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
