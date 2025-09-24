import { OrbitAdapter, OrbitGenericAdapter } from '@tuwaio/orbit-core';
import { Connector, CreateConnectorFn } from '@wagmi/core';
import { UiWallet, UiWalletAccount } from '@wallet-standard/ui';

export enum WalletType {
  EVMInjected = `${OrbitAdapter.EVM}:injected`,
  EVMMetamask = `${OrbitAdapter.EVM}:metaMask`,
  EVMWalletConnect = `${OrbitAdapter.EVM}:walletConnect`,
  EVMCoinbase = `${OrbitAdapter.EVM}:coinbaseWallet`,
  EVMSafe = `${OrbitAdapter.EVM}:safe`,
  EVMImpersonated = `${OrbitAdapter.EVM}:impersonated`,
  SolanaInjected = `${OrbitAdapter.SOLANA}:injected`,
  SolanaWalletConnect = `${OrbitAdapter.SOLANA}:walletConnect`,
  SolanaImpersonated = `${OrbitAdapter.SOLANA}:impersonated`,
}

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

export type WalletForConnectorBase = { walletType: WalletType };
export type WalletForConnectorEVM = WalletForConnectorBase & Connector<CreateConnectorFn>;
export type WalletForConnectorSolana = WalletForConnectorBase & UiWallet;
export type WalletForConnector = WalletForConnectorEVM | WalletForConnectorSolana;

export type SatelliteAdapter = {
  key: OrbitAdapter;
  connect: ({
    walletType,
    chainId,
    connectors,
  }: {
    walletType: WalletType;
    chainId: number | string;
    connectors: WalletForConnector[];
  }) => Promise<Wallet>;
  disconnect: () => Promise<void>;
  getConnectors: () => Promise<{ adapter: OrbitAdapter; connectors: WalletForConnector[] }>;
  checkAndSwitchNetwork: (chainId: string | number) => Promise<void>;
  getExplorerUrl: (url?: string) => string | undefined;
  getName?: (address: string) => Promise<string | null>;
  getAvatar?: (name: string) => Promise<string | null>;
  checkIsContractWallet?: ({ address, chainId }: { address: string; chainId: string | number }) => Promise<boolean>;
};

export type ISatelliteConnectStore = {
  getAdapter: () => SatelliteAdapter | SatelliteAdapter[];

  lastConnectedWallet?: { walletType: WalletType; chainId: number | string };
  availableConnectors: Partial<Record<OrbitAdapter, WalletForConnector[]>>;
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
