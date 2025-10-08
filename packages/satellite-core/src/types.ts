import { BaseAdapter, OrbitAdapter, OrbitGenericAdapter } from '@tuwaio/orbit-core';

/**
 * Type representing a wallet identifier in format "OrbitAdapter:wallet"
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

/** Generic type for all supported wallet types */
export type Wallet<W extends BaseWallet> = BaseWallet | W;

/**
 * Interface for blockchain network adapters
 * @remarks
 * Adapters provide chain-specific implementation for wallet interactions
 */
export type SatelliteAdapter<C, W extends BaseWallet = BaseWallet> = BaseAdapter & {
  /** Unique identifier for the adapter */
  key: OrbitAdapter;

  /**
   * Initiates wallet connection
   * @returns Promise resolving to connected wallet instance
   */
  connect: ({ walletType, chainId }: { walletType: WalletType; chainId: number | string }) => Promise<Wallet<W>>;

  /** Disconnects current wallet session */
  disconnect: (activeWallet?: Wallet<W>) => Promise<void>;

  /** Retrieves available wallet connectors for this adapter */
  getConnectors: () => { adapter: OrbitAdapter; connectors: C[] };

  /**
   * Handles network switching for connected wallet
   * @param chainId - Target chain ID
   * @param currentChainId - Current chain ID
   * @param updateActiveWallet - Callback to update wallet state
   */
  checkAndSwitchNetwork: (
    chainId: string | number,
    currentChainId?: string | number,
    updateActiveWallet?: (wallet: Partial<Wallet<W>>) => void,
  ) => Promise<void>;

  getBalance: (address: string, chainId: number | string) => Promise<{ value: string; symbol: string }>;

  /** Optional method to check if address is a smart contract */
  checkIsContractWallet?: ({ address, chainId }: { address: string; chainId: string | number }) => Promise<boolean>;
  /** Optional method to get a safe connector chainId for auto connect */
  getSafeConnectorChainId?: () => Promise<number | undefined>;
};

/**
 * Store interface for managing wallet connections
 */
export type ISatelliteConnectStore<C, W extends BaseWallet = BaseWallet> = {
  /** Returns configured adapter(s) */
  getAdapter: (adapterKey: OrbitAdapter) => SatelliteAdapter<C, W> | undefined;
  /** Get wallet connectors */
  getConnectors: () => Partial<Record<OrbitAdapter, C[]>>;
  /** Initialize auto connect logic */
  initializeAutoConnect: (autoConnect: boolean) => Promise<void>;
  /** Connects to specified wallet */
  connect: ({ walletType, chainId }: { walletType: WalletType; chainId: number | string }) => Promise<void>;
  /** Disconnects active wallet */
  disconnect: () => Promise<void>;
  /** Disconnects all wallets, used for initialize application */
  disconnectAll: () => Promise<void>;
  /** Indicates ongoing connection attempt */
  walletConnecting: boolean;
  /** Contains error message if connection failed */
  walletConnectionError?: string;
  /** Currently connected wallet */
  activeWallet?: Wallet<W>;
  /** Clears connection error state */
  resetWalletConnectionError: () => void;
  /** Updates active wallet properties */
  updateActiveWallet: (wallet: Partial<Wallet<W>>) => void;
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
export type WalletConnectedCallback<W extends BaseWallet = BaseWallet> = (wallet: Wallet<W>) => void | Promise<void>;

/**
 * Configuration parameters for initializing Satellite Connect store
 */
export type SatelliteConnectStoreInitialParameters<C, W extends BaseWallet = BaseWallet> = OrbitGenericAdapter<
  SatelliteAdapter<C, W>
> & {
  /** Optional callback executed after successful wallet connection */
  callbackAfterConnected?: WalletConnectedCallback<W>;
};
