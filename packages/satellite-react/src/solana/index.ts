import { OrbitAdapter } from '@tuwaio/orbit-core';
import { ConnectorSolana, SolanaConnection } from '@tuwaio/satellite-solana';

export * from './SolanaConnectorsWatcher';

// eslint-disable-next-line
import type { AllConnections, AllConnectors } from '../types';

// @ts-expect-error - Need for declaration merging
declare module '@tuwaio/satellite-react' {
  export interface AllConnections {
    [OrbitAdapter.SOLANA]: SolanaConnection;
  }
  export interface AllConnectors {
    [OrbitAdapter.SOLANA]: ConnectorSolana;
  }
}
