/**
 * @description
 * This interface is intentionally left empty.
 * Other packages (@tuwaio/satellite-*) will use module
 * augmentation to add their specific wallet types here.
 */
// eslint-disable-next-line
export interface AllWallets {}

/**
 * @description
 * This interface is intentionally left empty.
 * It will be augmented by satellite packages.
 */
// eslint-disable-next-line
export interface AllConnectors {}

/**
 * Union type for all supported wallet types.
 * It's created from the values of the AllWallets interface.
 * e.g., { evm: EVMWallet, solana: SolanaWallet } -> EVMWallet | SolanaWallet
 */
export type Wallet = AllWallets[keyof AllWallets];

/**
 * Union type for all supported connector types.
 */
export type Connector = AllConnectors[keyof AllConnectors];
