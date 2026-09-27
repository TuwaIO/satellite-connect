import { BaseAdapter, ConnectorType, OrbitAdapter, OrbitGenericAdapter, TuwaErrorState } from '@tuwaio/orbit-core';

/**
 * App metadata for creating wallet connectors, such as the wagmi `walletConnect` and `coinbaseWallet` connectors.
 * Satellite Connect does not read it; UI kits such as Nova Connect accept it to configure their connectors.
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
 * A wallet connection in the Satellite Connect store, as returned by the `connect` method of an adapter.
 * Chain adapters extend it with their own fields (for example `EVMConnection` from `@tuwaio/satellite-evm` and
 * `SolanaConnection` from `@tuwaio/satellite-solana`). The store keeps connections in memory only; see
 * {@link createSatelliteConnectStore} for what is saved to `localStorage`.
 */
export interface BaseConnector {
  /** Connector identifier in the form `"<adapter>:<wallet>"`, for example `"evm:metamask"` or `"solana:phantom"`. */
  connectorType: ConnectorType;
  /** Connected account: a `0x` address for EVM, a base58 address for Solana. */
  address: string | `0x${string}`;
  /**
   * Chain the wallet is connected to: a numeric chain ID for EVM (for example `1`), a cluster moniker for Solana
   * (for example `"devnet"` or `"mainnet"`).
   */
  chainId: string | number;
  /**
   * RPC URL of the connected chain, set by the adapter. EVM: the default RPC URL of the chain definition; Solana: the
   * URL configured for the cluster in the adapter's `rpcUrls`.
   */
  rpcURL: string;
  /** `true` when the account is a smart contract (for example a Safe), as reported by `checkIsContractAddress`. */
  isContractAddress: boolean;
  /** Whether the wallet reports the account as connected. */
  isConnected: boolean;
  /** Wallet icon provided by the wallet, usually a `data:` URI. */
  icon?: string;
  /**
   * Signs a UTF-8 message with the connected account and resolves to the signature: a hex string for EVM
   * (`personal_sign`), a base58 string for Solana (`solana:signMessage`). Rejects when the user declines.
   *
   * @param message - The message to sign.
   * @returns The signature.
   */
  signMessage?: (message: string) => Promise<string>;
}

/**
 * A connection in the store: the base fields, or a chain-specific connection type `W`.
 *
 * @typeParam W - Chain-specific connection type, for example `EVMConnection` from `@tuwaio/satellite-evm`.
 */
export type Connector<W extends BaseConnector> = BaseConnector | W;

/**
 * Contract of a chain adapter used by {@link createSatelliteConnectStore}. `satelliteEVMAdapter` from
 * `@tuwaio/satellite-evm` and `satelliteSolanaAdapter` from `@tuwaio/satellite-solana` implement it; implement it
 * yourself to add another chain family.
 *
 * It extends `BaseAdapter` from `@tuwaio/orbit-core`: `getExplorerUrl(url?, chainId?)` returns an explorer link (or
 * `undefined`), and the optional `getName`, `getAvatar` and `getAddress` resolve names such as ENS or SNS.
 *
 * @typeParam C - Type of the wallet connectors returned by `getConnectors` (for example a wagmi `Connector`).
 * @typeParam W - Chain-specific connection type returned by `connect`.
 */
export type SatelliteAdapter<C, W extends BaseConnector = BaseConnector> = BaseAdapter & {
  /** Chain family of the adapter. The store picks the adapter by the prefix of a `connectorType`. */
  key: OrbitAdapter;

  /**
   * Asks the wallet of `params.connectorType` to connect and returns the new connection.
   *
   * @param params - Connection target.
   * @param params.connectorType - Connector to connect, for example `"evm:metamask"`.
   * @param params.chainId - Chain to connect to (EVM chain ID, or Solana cluster moniker or `solana:` chain ID).
   * @returns The connection.
   * @throws {Error} When no wallet matches `connectorType` or the wallet rejects the request.
   */
  connect: (params: { connectorType: ConnectorType; chainId: number | string }) => Promise<Connector<W>>;

  /**
   * Disconnects the wallet of `activeConnector`, or every wallet of this adapter when it is omitted.
   *
   * @param activeConnector - The connection to disconnect.
   * @returns Resolves when the wallet has been asked to disconnect.
   */
  disconnect: (activeConnector?: Connector<W>) => Promise<void>;

  /**
   * Lists the wallets this adapter can connect to right now.
   *
   * @returns The adapter key and its connectors.
   */
  getConnectors: () => {
    /** The adapter key. */
    adapter: OrbitAdapter;
    /** The wallets available now. */
    connectors: C[];
  };

  /**
   * Moves the connection to `chainId` when it is on another chain. EVM: asks the wallet to switch networks. Solana:
   * there is no wallet request; the connection's `chainId` and `rpcURL` are updated through `updateActiveConnector`.
   *
   * @param chainId - Target chain.
   * @param currentChainId - Chain the connection is on now.
   * @param updateActiveConnector - Merges fields into the connection in the store.
   * @returns Resolves when the switch is done.
   * @throws {Error} When the wallet rejects or cannot switch.
   */
  checkAndSwitchNetwork: (
    chainId: string | number,
    currentChainId?: string | number,
    updateActiveConnector?: (connector: Partial<Connector<W>>) => void,
  ) => Promise<void>;

  /**
   * Reads the native balance of an address over RPC.
   *
   * @param address - Account to read.
   * @param chainId - Chain to read it on.
   * @returns The balance as a decimal string in whole units (for example `"1.5"`) and the currency symbol.
   * @throws {Error} When the RPC request fails.
   */
  getBalance: (address: string, chainId: number | string) => Promise<{ value: string; symbol: string }>;

  /**
   * Checks whether an address is a smart contract. The store calls it after every new connection and saves the
   * result in `isContractAddress`.
   *
   * @param params - Address and chain to check.
   * @param params.address - Account to check.
   * @param params.chainId - Chain to check it on.
   * @returns `true` for a contract account.
   */
  checkIsContractAddress?: (params: { address: string; chainId: string | number }) => Promise<boolean>;

  /**
   * Returns the chain of the Safe connector. `initializeAutoConnect` calls it when the app runs in an HTTPS iframe and
   * treats a chain ID as "inside Safe{Wallet}", so it must resolve to a chain ID only there; a rejection is treated
   * like `undefined`.
   *
   * @returns The chain ID, or `undefined` when there is no Safe connector.
   */
  getSafeConnectorChainId?: () => Promise<number | undefined>;

  /**
   * Makes an already connected wallet the active one in the wallet library.
   *
   * @param connectorType - Connector to activate.
   * @returns Resolves when the wallet is active.
   * @throws {Error} When the connector is not found or cannot be activated.
   */
  switchConnection?: (connectorType: ConnectorType) => Promise<void>;
};

/**
 * State and actions of the store created by {@link createSatelliteConnectStore}.
 *
 * `connect`, `disconnect`, `disconnectAll`, `switchConnection` and `switchNetwork` never reject: failures are stored in
 * `connectionError` or `switchNetworkError`, or logged to the console.
 *
 * @typeParam C - Type of the wallet connectors of the adapters.
 * @typeParam W - Chain-specific connection type.
 */
export type ISatelliteConnectStore<C, W extends BaseConnector = BaseConnector> = {
  /**
   * Returns the adapter for a chain family. With an array of adapters, the first one is returned (and a warning is
   * logged) when none has this key; a single adapter is returned for any key. `connect` and `initializeAutoConnect`
   * do not use this fallback.
   *
   * @param adapterKey - Chain family.
   * @returns The adapter, or `undefined` when the adapter array is empty.
   */
  getAdapter: (adapterKey: OrbitAdapter) => SatelliteAdapter<C, W> | undefined;
  /**
   * Lists the wallets every adapter can connect to right now.
   *
   * @returns Connectors by adapter key.
   */
  getConnectors: () => Partial<Record<OrbitAdapter, C[]>>;
  /**
   * Restores the connection after a page load. Call it once, on the client (`SatelliteConnectProvider` does).
   *
   * Waits 300 ms, calls `disconnectAll`, and removes entries older than 7 days from the recently connected list in
   * `localStorage`. Then:
   * - Inside Safe{Wallet}, with or without `autoConnect`, it connects the Safe connector (`"evm:safe"`) after 100 ms
   *   and stops. The app counts as running inside Safe{Wallet} when it is in an HTTPS iframe and the EVM adapter's
   *   `getSafeConnectorChainId` returns a chain ID (the Safe connector of wagmi gets it from the Safe{Wallet} parent
   *   window, whose origin must be allowed by its options, see `safeSdkOptions` from `@tuwaio/satellite-evm`).
   * - Otherwise, with `autoConnect`, it reads the last connection from `localStorage` and connects it again after
   *   100 ms, unless its wallet needs a user action to connect (impersonated, WalletConnect, Coinbase/Base Account,
   *   Bitget) or no adapter of its chain family is configured (another app on the same origin may have saved it).
   *
   * @param autoConnect - Whether to reconnect the last connected wallet.
   * @returns Resolves when done.
   * @throws {Error} Rejects only when `localStorage` cannot be accessed.
   */
  initializeAutoConnect: (autoConnect: boolean) => Promise<void>;
  /**
   * Connects a wallet and makes it the active connection. When it is already connected, it only becomes active.
   *
   * Sets `connecting`, calls the adapter's `connect` and `checkIsContractAddress` (on the chain the wallet is connected
   * to), awaits `callbackAfterConnected`, then saves the last connection (with that chain) and the recently connected
   * list to `localStorage`. Errors (including errors thrown
   * by `callbackAfterConnected`) are stored in `connectionError`. When no adapter of the connector's chain family (the
   * prefix of `connectorType`) is configured, no adapter is called and the error is
   * `No adapter found for connector type: <connectorType>`.
   *
   * @param params - Connection target.
   * @param params.connectorType - Connector to connect, for example `"evm:metamask"`.
   * @param params.chainId - Chain to connect to.
   * @returns Resolves when done; never rejects.
   */
  connect: (params: { connectorType: ConnectorType; chainId: number | string }) => Promise<void>;
  /**
   * Disconnects one wallet, or all wallets when `connectorType` is omitted. When the active wallet is disconnected
   * and others remain, the first remaining one becomes active. When no connection remains, the last connection and
   * the impersonated address are removed from `localStorage`; otherwise the active one is saved as the last
   * connection. Calls made while a disconnect is running are ignored.
   *
   * @param connectorType - Connector to disconnect.
   * @returns Resolves when done; never rejects.
   */
  disconnect: (connectorType?: ConnectorType) => Promise<void>;
  /**
   * Asks every adapter to disconnect all its wallets (errors are ignored), clears the connections and errors, and
   * removes the impersonated address from `localStorage`. The last connection is kept, so `initializeAutoConnect` can
   * restore it.
   *
   * @returns Resolves when done.
   */
  disconnectAll: () => Promise<void>;
  /** `true` while `connect` is running. */
  connecting: boolean;
  /** `true` while `disconnect` is running. */
  disconnecting: boolean;
  /** Error of the last failed `connect` or `disconnect`, normalized with `normalizeError` from `@tuwaio/orbit-core`. */
  connectionError?: TuwaErrorState;
  /**
   * Sets `connectionError`, for example after a failed validation in your UI.
   *
   * @param error - The error to show.
   */
  setConnectionError: (error: TuwaErrorState) => void;
  /** The active connection, or `undefined` when no wallet is connected. */
  activeConnection?: Connector<W>;
  /** All connected wallets by connector type. Several wallets can be connected at once; one of them is active. */
  connections: Record<ConnectorType, Connector<W>>;
  /** Clears `connectionError`. */
  resetConnectionError: () => void;
  /**
   * Merges fields into the connection of `connector.connectorType`, or into the active connection when it is omitted.
   * Does nothing when that connector is not connected. When the active connection gets a new `chainId`, the last
   * connection in `localStorage` is updated. The connection watchers call it on wallet events.
   *
   * @param connector - Fields to merge.
   */
  updateActiveConnection: (connector: Partial<Connector<W>>) => void;
  /**
   * Makes a connected wallet the active connection (through the adapter's `switchConnection`) and saves it as the
   * last connection in `localStorage`. Does nothing, with a warning, when the connector is not connected; errors are
   * logged.
   *
   * @param connectorType - Connector to activate.
   * @returns Resolves when done; never rejects.
   */
  switchConnection: (connectorType: ConnectorType) => Promise<void>;
  /**
   * Moves a connection to another chain with the adapter's `checkAndSwitchNetwork`. Errors are stored in
   * `switchNetworkError`. Does nothing when there is no such connection.
   *
   * @param chainId - Target chain.
   * @param connectorType - Connection to switch; the active connection when omitted.
   * @returns Resolves when done; never rejects.
   */
  switchNetwork: (chainId: string | number, connectorType?: ConnectorType) => Promise<void>;
  /** Error of the last failed `switchNetwork`, normalized with `normalizeError` from `@tuwaio/orbit-core`. */
  switchNetworkError?: TuwaErrorState;
  /** Clears `switchNetworkError`. */
  resetSwitchNetworkError: () => void;
  /**
   * Replaces the adapters and `callbackAfterConnected` used by later actions. The state is not reset.
   *
   * @param parameters - New store parameters.
   */
  updateParameters: (parameters: SatelliteConnectStoreInitialParameters<C, W>) => void;
};

/**
 * Callback run by `connect` after a new wallet is connected, with the connection (including `isContractAddress`).
 * `connect` awaits it; if it throws or rejects, the error is stored in `connectionError` and the connection is not
 * saved as the last connection.
 *
 * @typeParam W - Chain-specific connection type.
 * @param connector - The new active connection.
 * @returns Nothing, or a promise that `connect` awaits.
 */
export type ConnectedCallback<W extends BaseConnector = BaseConnector> = (
  connector: Connector<W>,
) => void | Promise<void>;

/**
 * Parameters of {@link createSatelliteConnectStore}: `adapter` (one adapter or an array, one per chain family) and an
 * optional `callbackAfterConnected`.
 *
 * @typeParam C - Type of the wallet connectors of the adapters.
 * @typeParam W - Chain-specific connection type.
 */
export type SatelliteConnectStoreInitialParameters<C, W extends BaseConnector = BaseConnector> = OrbitGenericAdapter<
  SatelliteAdapter<C, W>
> & {
  /** Runs after a new wallet is connected. See {@link ConnectedCallback}. */
  callbackAfterConnected?: ConnectedCallback<W>;
};

/**
 * SIWX (Sign-In With X) state read by the connection watchers (`createEVMConnectionsWatcher` from
 * `@tuwaio/satellite-evm`, `createSolanaConnectionsWatcher` from `@tuwaio/satellite-solana` and the React watcher
 * components). The result of `useSiwxSession()` from `@tuwaio/siwx-react` matches it.
 *
 * The watchers disconnect the wallet when the user is not signed in and the sign-in was rejected or failed, and,
 * while the user is signed in, when the wallet switches to another account (EVM and Solana) or chain (EVM) than the
 * session. It is UI state: servers must verify the session themselves.
 */
export interface SatelliteSiwxState {
  /** `false` turns off the disconnect after a rejected or failed sign-in. Defaults to enabled. */
  enabled?: boolean;
  /** Whether the user is signed in. */
  isSignedIn?: boolean;
  /** Same as `isSignedIn`; the name used by `useSiwxSession()` from `@tuwaio/siwx-react`. */
  isAuthenticated?: boolean;
  /** Whether the sign-in was rejected or failed. */
  isRejected?: boolean;
  /** Sign-in status. `"error"` counts as a rejected sign-in. */
  status?: string;
  /**
   * Account of the session, as a CAIP-10 account ID (for example `eip155:1:0xAb…`) or a plain address. Compared
   * case-insensitively for EVM.
   */
  address?: string;
  /** Chain of the session, as a CAIP-2 chain ID (for example `eip155:1`) or a chain reference. Used for EVM only. */
  chainId?: string;
  /** Session with `address` and `chainId`, used when the top-level fields are missing. */
  session?: {
    /** Account of the session. */
    address?: string;
    /** Chain of the session. */
    chainId?: string;
  } | null;
}
