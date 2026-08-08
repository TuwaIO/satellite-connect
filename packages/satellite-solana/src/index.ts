export * from './adapters/solanaAdapter';
export * from './types';
export * from './utils/connectionUtils';
export * from './utils/createSolanaConnectionsWatcher';

import { OrbitAdapter } from '@tuwaio/orbit-core';

import type { ConnectorSolana, SolanaConnection } from './types';

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
