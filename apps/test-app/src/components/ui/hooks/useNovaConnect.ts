import { OrbitAdapter } from '@tuwaio/orbit-core';
import { createContext, useContext } from 'react';

import { NovaConnectLabels } from '../../ui/i18n/types';

export type ButtonTxStatus = 'idle' | 'loading' | 'succeed' | 'failed' | 'replaced';
export type ConnectContentType = 'network' | 'connectors' | 'about' | 'getWallet' | 'connecting' | 'impersonate';
export type ConnectedContentType = 'main' | 'transactions' | 'chains';

// Provider props interface
export type NovaConnectProviderProps = {
  children: React.ReactNode;
  labels?: Partial<NovaConnectLabels>;
  withBalance?: boolean;
  withChain?: boolean;
  withImpersonated?: boolean;
};

// Provider context type
export type NovaConnectProviderType = Pick<
  NovaConnectProviderProps,
  'withBalance' | 'withChain' | 'withImpersonated'
> & {
  isConnectModalOpen: boolean;
  setIsConnectModalOpen: (value: boolean) => void;
  isConnectedModalOpen: boolean;
  setIsConnectedModalOpen: (value: boolean) => void;
  isChainsListOpen: boolean;
  setIsChainsListOpen: (value: boolean) => void;
  isChainsListOpenMobile: boolean;
  setIsChainsListOpenMobile: (value: boolean) => void;
  connectedButtonStatus: ButtonTxStatus;
  setConnectedButtonStatus: (value: ButtonTxStatus) => void;
  handleConnectButtonClick: () => void;
  handleChainChange: (newChainId: string) => void;
  formattedBalance: string;
  ensAvatar: string | null;
  ensNameAbbreviated: string;
  avatarIsLoading: boolean;
  balanceLoading: boolean;
  balance: { value: string; symbol: string } | null;
  connectedModalContentType: ConnectedContentType;
  setConnectedModalContentType: (value: ConnectedContentType) => void;
  connectModalContentType: ConnectContentType;
  setConnectModalContentType: (value: ConnectContentType) => void;
  selectedAdapter: OrbitAdapter | undefined;
  setSelectedAdapter: (value: OrbitAdapter | undefined) => void;
  activeConnector: string | undefined;
  setActiveConnector: (value: string | undefined) => void;
  impersonatedAddress: string;
  setImpersonatedAddress: (value: string) => void;
  isConnected: boolean;
  setIsConnected: (value: boolean) => void;
};

// Custom error for hook usage outside provider
class NovaConnectProviderError extends Error {
  constructor() {
    super('useNovaConnect must be used within NovaConnectProvider');
    this.name = 'NovaConnectProviderError';
  }
}

// Create context with type assertion
export const NovaConnectProviderContext = createContext<NovaConnectProviderType>({} as NovaConnectProviderType);

export const useNovaConnect = (): NovaConnectProviderType => {
  const context = useContext(NovaConnectProviderContext);

  if (process.env.NODE_ENV !== 'production') {
    if (!context || Object.keys(context).length === 0) {
      throw new NovaConnectProviderError();
    }
  }

  return context;
};
