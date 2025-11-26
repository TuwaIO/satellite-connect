import { BaseAdapter, ConnectorType, OrbitAdapter, OrbitGenericAdapter } from '@tuwaio/orbit-core';

/**
 * Configuration properties for initializing connectors
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
 * Base interface for connected connector information
 */
export interface BaseConnector {
  /** Unique identifier of the connector */
  connectorType: ConnectorType;
  /** Wallet public address */
  address: string | `0x${string}`;
  /** Connected chain ID */
  chainId: string | number;
  /** RPC endpoint URL */
  rpcURL: string;
  /** Indicates if the address is a smart contract */
  isContractAddress: boolean;
  /** Connection status */
  isConnected: boolean;
  /** Optional: connector icon base64 string */
  icon?: string;
}

/** Generic type for all supported connector types */
export type Connector<W extends BaseConnector> = BaseConnector | W;

/**
 * Interface for blockchain network adapters
 * @remarks
 * Adapters provide chain-specific implementation for connector interactions
 */
export type SatelliteAdapter<C, W extends BaseConnector = BaseConnector> = BaseAdapter & {
  /** Unique identifier for the adapter */
  key: OrbitAdapter;

  /**
   * Initiates connection
   * @returns Promise resolving to connected connector instance
   */
  connect: ({
    connectorType,
    chainId,
  }: {
    connectorType: ConnectorType;
    chainId: number | string;
  }) => Promise<Connector<W>>;

  /** Disconnects current connector session */
  disconnect: (activeConnector?: Connector<W>) => Promise<void>;

  /** Retrieves available connectors for this adapter */
  getConnectors: () => { adapter: OrbitAdapter; connectors: C[] };

  /**
   * Handles network switching for connected connector
   * @param chainId - Target chain ID
   * @param currentChainId - Current chain ID
   * @param updateActiveConnector - Callback to update connector state
   */
  checkAndSwitchNetwork: (
    chainId: string | number,
    currentChainId?: string | number,
    updateActiveConnector?: (connector: Partial<Connector<W>>) => void,
  ) => Promise<void>;

  getBalance: (address: string, chainId: number | string) => Promise<{ value: string; symbol: string }>;

  /** Optional method to check if address is a smart contract */
  checkIsContractAddress?: ({ address, chainId }: { address: string; chainId: string | number }) => Promise<boolean>;
  /** Optional method to get a safe connector chainId for auto connect */
  getSafeConnectorChainId?: () => Promise<number | undefined>;
};

/**
 * Store interface for managing connector connections
 */
export type ISatelliteConnectStore<C, W extends BaseConnector = BaseConnector> = {
  /** Returns configured adapter(s) */
  getAdapter: (adapterKey: OrbitAdapter) => SatelliteAdapter<C, W> | undefined;
  /** Get connectors */
  getConnectors: () => Partial<Record<OrbitAdapter, C[]>>;
  /** Initialize auto connect logic */
  initializeAutoConnect: (autoConnect: boolean) => Promise<void>;
  /** Connects to specified connector */
  connect: ({ connectorType, chainId }: { connectorType: ConnectorType; chainId: number | string }) => Promise<void>;
  /** Disconnects active connector */
  disconnect: (connectorType?: ConnectorType) => Promise<void>;
  /** Disconnects all connectors, used for initialize application */
  disconnectAll: () => Promise<void>;
  /** Indicates ongoing connection attempt */
  connecting: boolean;
  /** Contains error message if connection failed */
  connectionError?: string;
  /** Sets error message if connection failed or form validation failed */
  setConnectionError: (error: string) => void;
  /** Currently connected connector */
  activeConnection?: Connector<W>;
  /** List of all connected connectors */
  connections: Record<ConnectorType, Connector<W>>;
  /** Clears connection error state */
  resetConnectionError: () => void;
  /** Updates active connector properties */
  updateActiveConnection: (connector: Partial<Connector<W>>) => void;
  /** Switches active connector from the list of connections */
  switchConnection: (connectorType: ConnectorType) => void;
  /** Switches network for connected connector */
  switchNetwork: (chainId: string | number, connectorType?: ConnectorType) => Promise<void>;
  /** Contains error message if network switch failed */
  switchNetworkError?: string;
  /** Clears network switch error state */
  resetSwitchNetworkError: () => void;
};

/**
 * Callback type for successful connections
 */
export type ConnectedCallback<W extends BaseConnector = BaseConnector> = (
  connector: Connector<W>,
) => void | Promise<void>;

/**
 * Configuration parameters for initializing Satellite Connect store
 */
export type SatelliteConnectStoreInitialParameters<C, W extends BaseConnector = BaseConnector> = OrbitGenericAdapter<
  SatelliteAdapter<C, W>
> & {
  /** Optional callback executed after successful connection */
  callbackAfterConnected?: ConnectedCallback<W>;
};
