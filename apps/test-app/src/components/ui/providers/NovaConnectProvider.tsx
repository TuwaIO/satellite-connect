import { deepMerge } from '@tuwaio/nova-core';
import { formatWalletChainId, getAdapterFromWalletType } from '@tuwaio/orbit-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { Transaction, TransactionPool, TxAdapter } from '@tuwaio/pulsar-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { SolanaWallet } from '@tuwaio/satellite-solana';
import { createContext, useContext, useMemo, useState } from 'react';
import { Chain } from 'viem/chains';

import { InitialChains } from '../../ui/types';
import { useGetWalletNameAndAvatar } from '../hooks/useGetWalletNameAndAvatar';
import { useWalletNativeBalance } from '../hooks/useWalletNativeBalance';
import { defaultLabels } from '../i18n/en';
import { NovaConnectLabels } from '../i18n/types';
import { getChainsListByWalletType } from '../utils/getChainsListByWalletType';
import { ErrorsProvider } from './ErrorsProvider';
import { NovaConnectLabelsProvider } from './NovaConnectLabelsProvider';

export type ButtonTxStatus = 'idle' | 'loading' | 'succeed' | 'failed' | 'replaced';
export type ConnectContentType = 'network' | 'connectors' | 'about' | 'getWallet' | 'connecting' | 'impersonate';
export type ConnectedContentType = 'main' | 'transactions' | 'chains';

// Provider props interface
export type NovaConnectProviderProps = InitialChains & {
  children: React.ReactNode;
  labels?: Partial<NovaConnectLabels>;
  withBalance?: boolean;
  withChain?: boolean;
  withImpersonated?: boolean;
  transactionPool?: TransactionPool<Transaction>;
  pulsarAdapter?: TxAdapter<Transaction> | TxAdapter<Transaction>[];
};

// Provider context type
type NovaConnectProviderType = Omit<NovaConnectProviderProps, 'labels' | 'children'> & {
  address: string | undefined;
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
  currentFormattedChainId: string | number;
  handleConnectButtonClick: () => void;
  handleChainChange: (newChainId: string) => void;
  formattedBalance: string;
  chainsList: (string | number)[];
  getChainData: (chain: string | number) => {
    formattedChainId: string | number;
    chain: string | number;
  };
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
const NovaConnectProviderContext = createContext<NovaConnectProviderType>({} as NovaConnectProviderType);

export function NovaConnectProvider({
  labels,
  pulsarAdapter,
  withChain = false,
  withImpersonated = false,
  withBalance = false,
  transactionPool,
  appChains,
  solanaRPCUrls,
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
  const [connectModalContentType, setConnectModalContentType] = useState<ConnectContentType>('network');
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

  const chainsList = activeWallet
    ? getChainsListByWalletType({
        walletType: activeWallet.walletType,
        appChains,
        solanaRPCUrls,
        chains: (activeWallet as SolanaWallet)?.connectedWallet?.chains,
      })
    : [];

  const currentFormattedChainId = activeWallet?.chainId
    ? formatWalletChainId(activeWallet.chainId, getAdapterFromWalletType(activeWallet.walletType))
    : 1;

  const getChainData = (chain: string | number) => ({
    formattedChainId: activeWallet?.walletType
      ? formatWalletChainId(chain, getAdapterFromWalletType(activeWallet.walletType))
      : 1,
    chain,
  });

  const contextValue: NovaConnectProviderType = {
    address: activeWallet?.address,
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
    chainsList,
    getChainData,
    avatarIsLoading,
    ensAvatar,
    ensNameAbbreviated,
    balanceLoading,
    balance,
    currentFormattedChainId,
    withChain,
    withImpersonated,
    withBalance,
    transactionPool,
    pulsarAdapter,
    appChains: appChains || ([] as unknown as readonly [Chain, ...Chain[]]),
    solanaRPCUrls: solanaRPCUrls || {},
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

export const useNovaConnect = (): NovaConnectProviderType => {
  const context = useContext(NovaConnectProviderContext);

  if (process.env.NODE_ENV !== 'production') {
    if (!context || Object.keys(context).length === 0) {
      throw new NovaConnectProviderError();
    }
  }

  return context;
};
