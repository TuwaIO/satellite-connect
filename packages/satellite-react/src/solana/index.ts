import { OrbitAdapter } from '@tuwaio/orbit-core';
import { ConnectorSolana, SolanaConnection } from '@tuwaio/satellite-solana';

export * from './SolanaConnectorsWatcherDynamic';
export * from './SolanaConnectorsWatcherImpl';

// eslint-disable-next-line
// @ts-ignore - Need for declaration merging
declare module '@tuwaio/satellite-react' {
  export interface AllConnections {
    [OrbitAdapter.SOLANA]: SolanaConnection;
  }
  export interface AllConnectors {
    [OrbitAdapter.SOLANA]: ConnectorSolana;
  }
}
