/**
 * @description
 * This interface is intentionally left empty.
 * Other packages (@tuwaio/satellite-*) will use module
 * augmentation to add their specific connection types here.
 */
// eslint-disable-next-line
export interface AllConnections {}

/**
 * @description
 * This interface is intentionally left empty.
 * It will be augmented by satellite packages.
 */
// eslint-disable-next-line
export interface AllConnectors {}

/**
 * Union type for all supported connection types.
 * It's created from the values of the AllConnections interface.
 * e.g., { evm: EVMConnection, solana: SolanaConnection } -> EVMConnection | SolanaConnection
 */
export type Connection = AllConnections[keyof AllConnections];

/**
 * Union type for all supported connector types.
 */
export type Connector = AllConnectors[keyof AllConnectors];
