import { OrbitAdapter } from '@tuwaio/orbit-core';
import { ConnectorSolana, SolanaWallet } from '@tuwaio/satellite-solana';

export * from './SolanaWalletsWatcher';

// eslint-disable-next-line
// @ts-ignore - Need for declaration merging
declare module '@tuwaio/satellite-react' {
  export interface AllWallets {
    [OrbitAdapter.SOLANA]: SolanaWallet;
  }
  export interface AllConnectors {
    [OrbitAdapter.SOLANA]: ConnectorSolana;
  }
}
