// =================================================================================================
// 1. ENUMS AND CORE TRANSACTION TYPES
// =================================================================================================

/**
 * Defines the supported blockchain adapters. Each adapter corresponds to a specific chain architecture.
 */
export enum OrbitAdapter {
  /** For Ethereum Virtual Machine (EVM) compatible chains like Ethereum, Polygon, etc. */
  EVM = 'evm',
  /** For the Solana blockchain. */
  SOLANA = 'solana',
  /** For the Starknet L2 network. */
  Starknet = 'starknet',
}

export type OrbitGenericAdapter<A extends { key: OrbitAdapter }> = {
  adapter: A | A[];
};
