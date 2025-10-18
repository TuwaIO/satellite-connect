import { OrbitAdapter } from '@tuwaio/orbit-core';
import { ISatelliteConnectStore } from '@tuwaio/satellite-core';
import { BaseWallet } from '@tuwaio/satellite-core';
import { createContext, useContext } from 'react';
import { StoreApi } from 'zustand/index';

import { NovaConnectLabels } from '../i18n/types';
import { Connector, Wallet } from '../types';

export type ButtonTxStatus = 'idle' | 'loading' | 'succeed' | 'failed' | 'replaced';
export type ConnectContentType = 'network' | 'connectors' | 'about' | 'getWallet' | 'connecting' | 'impersonate';
export type ConnectedContentType = 'main' | 'transactions' | 'chains';

// Provider props interface
export interface NovaConnectProviderProps {
  store: StoreApi<ISatelliteConnectStore<Connector, Wallet>>;
  children: React.ReactNode;
  labels?: Partial<NovaConnectLabels>;
}

// Balance type for better type safety
export interface WalletBalance {
  value: string;
  symbol: string;
}

// Provider context type with better organization
export interface NovaConnectProviderType {
  activeWallet: BaseWallet | undefined;
  walletConnectionError: string | undefined;
  // Modal states
  isConnectModalOpen: boolean;
  setIsConnectModalOpen: (value: boolean) => void;
  isConnectedModalOpen: boolean;
  setIsConnectedModalOpen: (value: boolean) => void;

  // Chain selection states
  isChainsListOpen: boolean;
  setIsChainsListOpen: (value: boolean) => void;
  isChainsListOpenMobile: boolean;
  setIsChainsListOpenMobile: (value: boolean) => void;

  // Connection states
  connectedButtonStatus: ButtonTxStatus;
  setConnectedButtonStatus: (value: ButtonTxStatus) => void;
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;

  // Modal content types
  connectedModalContentType: ConnectedContentType;
  setConnectedModalContentType: (value: ConnectedContentType) => void;
  connectModalContentType: ConnectContentType;
  setConnectModalContentType: (value: ConnectContentType) => void;

  // Adapter and connector states
  selectedAdapter: OrbitAdapter | undefined;
  setSelectedAdapter: (value: OrbitAdapter | undefined) => void;
  activeConnector: string | undefined;
  setActiveConnector: (value: string | undefined) => void;

  // Impersonation
  impersonatedAddress: string;
  setImpersonatedAddress: (value: string) => void;
}

// Custom error for hook usage outside provider
export class NovaConnectProviderError extends Error {
  constructor(message = 'useNovaConnect must be used within NovaConnectProvider') {
    super(message);
    this.name = 'NovaConnectProviderError';
  }
}

// Create context with undefined default to enforce provider usage
export const NovaConnectProviderContext = createContext<NovaConnectProviderType | undefined>(undefined);

/**
 * Hook to access NovaConnect context
 *
 * @throws {NovaConnectProviderError} When used outside of NovaConnectProvider
 * @returns {NovaConnectProviderType} The NovaConnect context value
 *
 * @example
 * ```typescript
 * function MyComponent() {
 *   const { isConnected, handleConnectButtonClick } = useNovaConnect();
 *
 *   return (
 *     <button onClick={handleConnectButtonClick}>
 *       {isConnected ? 'Connected' : 'Connect Wallet'}
 *     </button>
 *   );
 * }
 * ```
 */
export const useNovaConnect = (): NovaConnectProviderType => {
  const context = useContext(NovaConnectProviderContext);

  if (!context) {
    throw new NovaConnectProviderError();
  }

  return context;
};

/**
 * Hook to check if NovaConnect context is available
 *
 * @returns {boolean} True if context is available, false otherwise
 *
 * @example
 * ```typescript
 * function ConditionalComponent() {
 *   const hasContext = useHasNovaConnectContext();
 *
 *   if (!hasContext) {
 *     return <div>NovaConnect provider not found</div>;
 *   }
 *
 *   return <ConnectedComponent />;
 * }
 * ```
 */
export const useHasNovaConnectContext = (): boolean => {
  const context = useContext(NovaConnectProviderContext);
  return context !== undefined;
};

/**
 * Optional hook that returns null if provider is not available
 *
 * @returns {NovaConnectProviderType | null} Context value or null if not available
 *
 * @example
 * ```typescript
 * function OptionalComponent() {
 *   const context = useNovaConnectOptional();
 *
 *   if (!context) {
 *     return <div>No wallet provider available</div>;
 *   }
 *
 *   return <div>Connected: {context.isConnected}</div>;
 * }
 * ```
 */
export const useNovaConnectOptional = (): NovaConnectProviderType | null => {
  const context = useContext(NovaConnectProviderContext);
  return context ?? null;
};
