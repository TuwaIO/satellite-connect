/**
 * @description
 * This interface provides default fallback types for chain configurations.
 * Chain-specific packages will use module augmentation to override these
 * with more specific types while maintaining backward compatibility.
 *
 * Default values are `any` to ensure the system works without specific
 * chain packages, but gets enhanced type safety when they are installed.
 */
export interface AllChainConfigs {
  /**
   * App chains configuration - defaults to any, gets enhanced by chain-specific packages
   * @default any - Will be typed as `readonly [Chain, ...Chain[]]` when viem is available
   */
  // eslint-disable-next-line
  appChains?: any;

  /**
   * Solana RPC URLs configuration - defaults to any, gets enhanced by Solana packages
   * @default any - Will be typed as `Partial<Record<SolanaClusterMoniker, string>>` when gill is available
   */
  // eslint-disable-next-line
  solanaRPCUrls?: any;
}

/**
 * Union type for all supported chain configurations.
 * Gets automatically extended when packages augment AllChainConfigs.
 *
 * @example
 * ```typescript
 * // Without specific packages - uses any types
 * const config: InitialChains = {
 *   appChains: [], // any
 *   solanaRPCUrls: {} // any
 * }
 *
 * // With viem package installed - gets proper Chain[] typing
 * // With gill package installed - gets proper SolanaClusterMoniker typing
 * ```
 */
export type InitialChains = AllChainConfigs;

/**
 * Array of chain identifiers (replaces IdentifierArray from @wallet-standard/base)
 * Can contain strings, numbers, or other primitive types
 *
 * @example
 * ```typescript
 * const chainIds: ChainIdentifierArray = ['ethereum', 1, 'solana:mainnet-beta'];
 * ```
 */
export type ChainIdentifierArray = readonly (string | number)[];

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
