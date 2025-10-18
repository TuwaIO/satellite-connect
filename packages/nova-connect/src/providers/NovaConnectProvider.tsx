import { deepMerge } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { BaseWallet } from '@tuwaio/satellite-core';
import { useEffect, useMemo, useState } from 'react';

import {
  ButtonTxStatus,
  ConnectContentType,
  ConnectedContentType,
  NovaConnectProviderContext,
  NovaConnectProviderProps,
  NovaConnectProviderType,
} from '../hooks/useNovaConnect';
import { defaultLabels } from '../i18n/en';
import { ErrorsProvider } from './ErrorsProvider';
import { NovaConnectLabelsProvider } from './NovaConnectLabelsProvider';

export function NovaConnectProvider({ labels, store, children }: NovaConnectProviderProps) {
  const mergedLabels = useMemo(() => deepMerge(defaultLabels, labels || {}), [labels]);

  const [activeWallet, setActiveWallet] = useState<BaseWallet | undefined>(store.getState().activeWallet);
  const [walletConnectionError, setWalletConnectionError] = useState<string | undefined>(
    store.getState().walletConnectionError,
  );
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isConnectedModalOpen, setIsConnectedModalOpen] = useState(false);
  const [isChainsListOpen, setIsChainsListOpen] = useState(false);
  const [isChainsListOpenMobile, setIsChainsListOpenMobile] = useState(false);
  const [connectedButtonStatus, setConnectedButtonStatus] = useState<ButtonTxStatus>('idle');
  const [connectModalContentType, setConnectModalContentType] = useState<ConnectContentType>('connectors');
  const [selectedAdapter, setSelectedAdapter] = useState<OrbitAdapter | undefined>(undefined);
  const [activeConnector, setActiveConnector] = useState<string | undefined>(undefined);
  const [impersonatedAddress, setImpersonatedAddress] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [connectedModalContentType, setConnectedModalContentType] = useState<ConnectedContentType>('main');

  useEffect(() => {
    const unsubscribe = store.subscribe((state) => {
      setActiveWallet(state.activeWallet);
      setWalletConnectionError(state.walletConnectionError);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue: NovaConnectProviderType = {
    walletConnectionError,
    activeWallet,
    isConnectModalOpen,
    setIsConnectModalOpen,
    isConnectedModalOpen,
    setIsConnectedModalOpen,
    isChainsListOpen,
    setIsChainsListOpen,
    isChainsListOpenMobile,
    setIsChainsListOpenMobile,
    connectedButtonStatus,
    setConnectedButtonStatus,
    connectedModalContentType,
    setConnectedModalContentType,
    connectModalContentType,
    setConnectModalContentType,
    selectedAdapter,
    setSelectedAdapter,
    activeConnector,
    setActiveConnector,
    impersonatedAddress,
    setImpersonatedAddress,
    isConnected,
    setIsConnected,
  };

  return (
    <NovaConnectProviderContext.Provider value={contextValue}>
      <ErrorsProvider store={store} />
      <NovaConnectLabelsProvider labels={mergedLabels}>{children}</NovaConnectLabelsProvider>
    </NovaConnectProviderContext.Provider>
  );
}
