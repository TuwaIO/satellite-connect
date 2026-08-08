export * from './adapters/evmAdapter';
export * from './connectors/index';
export * from './types';
export * from './utils/checkIsWalletAddressContract';
export * from './utils/createDefaultTransports';
export * from './utils/createEVMConnectionsWatcher';

import { OrbitAdapter } from '@tuwaio/orbit-core';

import type { ConnectorEVM, EVMConnection } from './types';

// eslint-disable-next-line
// @ts-ignore - Need for declaration merging
declare module '@tuwaio/satellite-react' {
  export interface AllConnections {
    [OrbitAdapter.EVM]: EVMConnection;
  }
  export interface AllConnectors {
    [OrbitAdapter.EVM]: ConnectorEVM;
  }
}
