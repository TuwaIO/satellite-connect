import { deepMerge } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { useMemo, useState } from 'react';

import { useGetWalletNameAndAvatar } from '../hooks/useGetWalletNameAndAvatar';
import {
  ButtonTxStatus,
  ConnectContentType,
  ConnectedContentType,
  NovaConnectProviderContext,
  NovaConnectProviderProps,
  NovaConnectProviderType,
} from '../hooks/useNovaConnect';
import { useWalletNativeBalance } from '../hooks/useWalletNativeBalance';
import { defaultLabels } from '../i18n/en';
import { ErrorsProvider } from './ErrorsProvider';
import { NovaConnectLabelsProvider } from './NovaConnectLabelsProvider';

export function NovaConnectProvider({
  labels,
  withChain = false,
  withImpersonated = false,
  withBalance = false,
  children,
}: NovaConnectProviderProps) {
  const mergedLabels = useMemo(() => deepMerge(defaultLabels, labels || {}), [labels]);

  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);
  const switchNetwork = useSatelliteConnectStore((state) => state.switchNetwork);

  const { ensAvatar, ensNameAbbreviated, isLoading: avatarIsLoading } = useGetWalletNameAndAvatar(5);
  const { balance, isLoading: balanceLoading } = useWalletNativeBalance();

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

  const handleConnectButtonClick = () => {
    if (activeWallet?.isConnected) {
      setIsConnectedModalOpen(true);
    } else {
      setIsConnectModalOpen(true);
    }
  };

  const handleChainChange = (newChainId: string) => {
    switchNetwork(newChainId);
  };

  const formattedBalance = balance?.value ? parseFloat(balance.value).toFixed(3) : '0.000';

  const contextValue: NovaConnectProviderType = {
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
    handleConnectButtonClick,
    handleChainChange,
    formattedBalance,
    avatarIsLoading,
    ensAvatar,
    ensNameAbbreviated,
    balanceLoading,
    balance,
    withChain,
    withImpersonated,
    withBalance,
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
      <NovaConnectLabelsProvider labels={mergedLabels}>
        <ErrorsProvider />
        {children}
      </NovaConnectLabelsProvider>
    </NovaConnectProviderContext.Provider>
  );
}
