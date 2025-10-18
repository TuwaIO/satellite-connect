import { deepMerge } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
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
import { Wallet } from '../types';
import { ErrorsProvider } from './ErrorsProvider';
import { NovaConnectLabelsProvider } from './NovaConnectLabelsProvider';

// TODO: move to @tuwaio/orbit-core
// function shallowEqual(obj1: any, obj2: any): boolean {
//   if (obj1 === obj2) return true;
//   if (!obj1 || !obj2) return false;
//
//   const keys1 = Object.keys(obj1);
//   const keys2 = Object.keys(obj2);
//
//   if (keys1.length !== keys2.length) return false;
//
//   return keys1.every((key) => obj1[key] === obj2[key]);
// }

export function NovaConnectProvider({ labels, store, children }: NovaConnectProviderProps) {
  const mergedLabels = useMemo(() => deepMerge(defaultLabels, labels || {}), [labels]);

  // @ts-expect-error - TODO: typing issue with activeWallet
  const [activeWallet, setActiveWallet] = useState<Wallet | undefined>(store.getState().activeWallet);
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

  const unsubscribe = store.subscribe((state) => {
    // @ts-expect-error - TODO: typing issue with activeWallet
    setActiveWallet(state.activeWallet);
    setWalletConnectionError(state.walletConnectionError);
  });

  useEffect(() => {
    return unsubscribe;
  });

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
