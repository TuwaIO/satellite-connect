// Re-export gill types directly when available
export type { SolanaClusterMoniker } from 'gill';

// Import types for extension
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { ConnectorSolana, SolanaWallet } from '@tuwaio/satellite-solana';
import type { SolanaClusterMoniker } from 'gill';

// Extend the main interface with Solana-specific config
// This will override the default `any` type with specific SolanaClusterMoniker typing
// eslint-disable-next-line
// @ts-ignore - Need for declaration merging
declare module '@tuwaio/nova-connect' {
  interface AllChainConfigs {
    /**
     * Solana RPC URLs configuration - enhanced from default any type
     * @override Replaces default `any` with specific SolanaClusterMoniker typing when gill is available
     */
    solanaRPCUrls?: Partial<Record<SolanaClusterMoniker, string>>;
  }
  export interface AllWallets {
    [OrbitAdapter.SOLANA]: SolanaWallet;
  }
  export interface AllConnectors {
    [OrbitAdapter.SOLANA]: ConnectorSolana;
  }
}

export * from './utils';
