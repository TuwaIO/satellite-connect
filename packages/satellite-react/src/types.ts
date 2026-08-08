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

import { BaseConnector } from '@tuwaio/satellite-core';

/**
 * Union type for all supported connection types.
 * It's created from the values of the AllConnections interface.
 * e.g., { evm: EVMConnection, solana: SolanaConnection } -> EVMConnection | SolanaConnection
 */
export type Connection = [keyof AllConnections] extends [never] ? BaseConnector : AllConnections[keyof AllConnections];

/**
 * Union type for all supported connector types.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Connector = [keyof AllConnectors] extends [never] ? any : AllConnectors[keyof AllConnectors];
