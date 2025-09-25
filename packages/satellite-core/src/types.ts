import { OrbitAdapter, OrbitGenericAdapter } from '@tuwaio/orbit-core';
import { Connector as WagmiConnector, CreateConnectorFn } from '@wagmi/core';
import { UiWallet, UiWalletAccount } from '@wallet-standard/ui';

/**
 * Type representing a wallet identifier in format "chain:wallet"
 * @example "evm:metamask" | "solana:phantom"
 */
export type WalletType = `${OrbitAdapter}:${string}`;

/**
 * Configuration properties for initializing wallet connectors
 */
export type ConnectorsInitProps = {
  /** Application name displayed in wallet interfaces */
  appName: string;
  /** Logo URL for Coinbase Wallet */
  appLogoUrl?: string;
  /** WalletConnect project ID (required for WalletConnect functionality) */
  projectId?: string;
  /** Logo for WalletConnect interface */
  appLogo?: string;
  /** Application description for WalletConnect */
  description?: string;
  /** Application URL for WalletConnect */
  appUrl?: string;
  /** Array of icon URLs for WalletConnect */
  appIcons?: string[];
  /** Function to get impersonated account address for testing */
  getImpersonatedAccount?: () => string | `0x${string}` | undefined;
};

/**
 * Base interface for connected wallet information
 */
export interface BaseWallet {
  /** Unique identifier of the wallet */
  walletType: WalletType;
  /** Wallet's public address */
  address: string | `0x${string}`;
  /** Connected chain ID */
  chainId: string | number;
  /** RPC endpoint URL */
  rpcURL: string;
  /** Indicates if the address is a smart contract */
  isContractAddress: boolean;
  /** Connection status */
  isConnected: boolean;
}

/**
 * Extended wallet interface for Solana-specific properties
 */
export interface SolanaWallet extends BaseWallet {
  /** Connected Wallet Standard account */
  connectedAccount?: UiWalletAccount;
  /** Connected Wallet Standard wallet instance */
  connectedWallet?: UiWallet;
}

/** Union type for all supported wallet types */
export type Wallet = BaseWallet | SolanaWallet;

/** EVM-specific connector type */
export type ConnectorEVM = WagmiConnector<CreateConnectorFn>;
/** Solana-specific connector type */
export type ConnectorSolana = UiWallet;
/** Union type for all supported connector types */
export type Connector = ConnectorEVM | ConnectorSolana;

/**
 * Interface for blockchain network adapters
 * @remarks
 * Adapters provide chain-specific implementation for wallet interactions
 */
export type SatelliteAdapter = {
  /** Unique identifier for the adapter */
  key: OrbitAdapter;

  /**
   * Initiates wallet connection
   * @returns Promise resolving to connected wallet instance
   */
  connect: ({
    walletType,
    chainId,
    connectors,
  }: {
    walletType: WalletType;
    chainId: number | string;
    connectors: Connector[];
  }) => Promise<Wallet>;

  /** Disconnects current wallet session */
  disconnect: () => Promise<void>;

  /** Retrieves available wallet connectors for this adapter */
  getConnectors: () => Promise<{ adapter: OrbitAdapter; connectors: Connector[] }>;

  /**
   * Handles network switching for connected wallet
   * @param chainId - Target chain ID
   * @param currentChainId - Current chain ID
   * @param updateActiveWallet - Callback to update wallet state
   */
  checkAndSwitchNetwork: (
    chainId: string | number,
    currentChainId?: string | number,
    updateActiveWallet?: (wallet: Partial<Wallet>) => void,
  ) => Promise<void>;

  /**
   * Generates blockchain explorer URL
   * @returns Explorer URL or undefined if not available
   */
  getExplorerUrl: (url?: string, chainId?: string | number) => string | undefined;

  /** Optional method to resolve ENS-like names */
  getName?: (address: string) => Promise<string | null>;

  /** Optional method to get avatar for resolved names */
  getAvatar?: (name: string) => Promise<string | null>;

  /** Optional method to check if address is a smart contract */
  checkIsContractWallet?: ({ address, chainId }: { address: string; chainId: string | number }) => Promise<boolean>;
};

/**
 * Store interface for managing wallet connections
 */
export type ISatelliteConnectStore = {
  /** Returns configured adapter(s) */
  getAdapter: () => SatelliteAdapter | SatelliteAdapter[];

  /** Information about last connected wallet */
  lastConnectedWallet?: { walletType: WalletType; chainId: number | string };

  /** Available connectors mapped by adapter type */
  availableConnectors: Partial<Record<OrbitAdapter, Connector[]>>;

  /** Initializes wallet connectors */
  initializeAppConnectors: ({ autoConnect }: { autoConnect?: boolean }) => Promise<void>;

  /** Connects to specified wallet */
  connect: ({ walletType, chainId }: { walletType: WalletType; chainId: number | string }) => Promise<void>;

  /** Disconnects active wallet */
  disconnect: () => Promise<void>;

  /** Indicates ongoing connection attempt */
  walletConnecting: boolean;

  /** Contains error message if connection failed */
  walletConnectionError?: string;

  /** Currently connected wallet */
  activeWallet?: Wallet;

  /** Clears connection error state */
  resetWalletConnectionError: () => void;

  /** Updates active wallet properties */
  updateActiveWallet: (wallet: Partial<Wallet>) => void;

  /** Switches network for connected wallet */
  switchNetwork: (chainId: string | number) => Promise<void>;

  /** Contains error message if network switch failed */
  switchNetworkError?: string;

  /** Clears network switch error state */
  resetSwitchNetworkError: () => void;
};

/**
 * Callback type for successful wallet connections
 */
export type WalletConnectedCallback = (wallet: Wallet) => void | Promise<void>;

/**
 * Configuration parameters for initializing Satellite Connect store
 */
export type SatelliteConnectStoreInitialParameters = OrbitGenericAdapter<SatelliteAdapter> & {
  /** Optional callback executed after successful wallet connection */
  callbackAfterConnected?: WalletConnectedCallback;
};
