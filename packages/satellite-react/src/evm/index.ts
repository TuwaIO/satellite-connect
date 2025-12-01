import { OrbitAdapter } from '@tuwaio/orbit-core';
import { ConnectorEVM, EVMConnection } from '@tuwaio/satellite-evm';

export * from './EVMConnectorsWatcher';

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
