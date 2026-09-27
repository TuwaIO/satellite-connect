/**
 * Connection types by chain family, filled by module augmentation. Importing `@tuwaio/satellite-react/evm` adds
 * `EVMConnection` from `@tuwaio/satellite-evm`, and importing `@tuwaio/satellite-react/solana` adds `SolanaConnection`
 * from `@tuwaio/satellite-solana`. It is empty until one of them is imported.
 */
// eslint-disable-next-line
export interface AllConnections {}

/**
 * Wallet connector types by chain family, filled by module augmentation like {@link AllConnections}: the wagmi
 * `Connector` for EVM and the Wallet Standard `UiWallet` for Solana.
 */
// eslint-disable-next-line
export interface AllConnectors {}

/**
 * Union of the connection types in {@link AllConnections}, for example `EVMConnection | SolanaConnection`. The store of
 * `SatelliteConnectProvider` uses it for `activeConnection` and `connections`.
 */
export type Connection = AllConnections[keyof AllConnections];

/**
 * Union of the wallet connector types in {@link AllConnectors}, returned by the store's `getConnectors`.
 */
export type Connector = AllConnectors[keyof AllConnectors];
