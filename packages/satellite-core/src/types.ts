import { OrbitAdapter, OrbitGenericAdapter } from '@tuwaio/orbit-core';
import { Connector as WagmiConnector, CreateConnectorFn } from '@wagmi/core';
import { UiWallet, UiWalletAccount } from '@wallet-standard/ui';

export type WalletType = `${OrbitAdapter}:${string}`;

export type ConnectorsInitProps = {
  appName: string;
  appLogoUrl?: string; // for coinbase wallet
  projectId?: string; // for wallet connect if not pass wallet connect will not work
  appLogo?: string; // for wallet connect
  description?: string; // for wallet connect
  appUrl?: string; // for wallet connect
  appIcons?: string[]; // for wallet connect
  getImpersonatedAccount?: () => string | `0x${string}` | undefined; // for impersonated wallet
};

export interface BaseWallet {
  walletType: WalletType;
  address: string | `0x${string}`;
  chainId: string | number;
  rpcURL: string;
  isContractAddress: boolean;
  isConnected: boolean;
}
export interface SolanaWallet extends BaseWallet {
  connectedAccount?: UiWalletAccount;
  connectedWallet?: UiWallet;
}
export type Wallet = BaseWallet | SolanaWallet;

export type ConnectorEVM = WagmiConnector<CreateConnectorFn>;
export type ConnectorSolana = UiWallet;
export type Connector = ConnectorEVM | ConnectorSolana;

export type SatelliteAdapter = {
  key: OrbitAdapter;
  connect: ({
    walletType,
    chainId,
    connectors,
  }: {
    walletType: WalletType;
    chainId: number | string;
    connectors: Connector[];
  }) => Promise<Wallet>;
  disconnect: () => Promise<void>;
  getConnectors: () => Promise<{ adapter: OrbitAdapter; connectors: Connector[] }>;
  checkAndSwitchNetwork: (
    chainId: string | number,
    currentChainId?: string | number,
    updateActiveWallet?: (wallet: Partial<Wallet>) => void,
  ) => Promise<void>;
  getExplorerUrl: (url?: string, chainId?: string | number) => string | undefined;
  getName?: (address: string) => Promise<string | null>;
  getAvatar?: (name: string) => Promise<string | null>;
  checkIsContractWallet?: ({ address, chainId }: { address: string; chainId: string | number }) => Promise<boolean>;
};

export type ISatelliteConnectStore = {
  getAdapter: () => SatelliteAdapter | SatelliteAdapter[];

  lastConnectedWallet?: { walletType: WalletType; chainId: number | string };
  availableConnectors: Partial<Record<OrbitAdapter, Connector[]>>;
  initializeAppConnectors: ({ autoConnect }: { autoConnect?: boolean }) => Promise<void>;

  connect: ({ walletType, chainId }: { walletType: WalletType; chainId: number | string }) => Promise<void>;
  disconnect: () => Promise<void>;

  walletConnecting: boolean;
  walletConnectionError?: string;
  activeWallet?: Wallet;
  resetWalletConnectionError: () => void;

  updateActiveWallet: (wallet: Partial<Wallet>) => void;

  switchNetwork: (chainId: string | number) => Promise<void>;
  switchNetworkError?: string;
  resetSwitchNetworkError: () => void;
};

export type WalletConnectedCallback = (wallet: Wallet) => void | Promise<void>;

export type SatelliteConnectStoreInitialParameters = OrbitGenericAdapter<SatelliteAdapter> & {
  callbackAfterConnected?: WalletConnectedCallback;
};
