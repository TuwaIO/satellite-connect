import { OrbitAdapter } from '@tuwaio/orbit-core';
import { ConnectorEVM, EVMWallet } from '@tuwaio/satellite-evm';

export * from './EVMWalletsWatcher';

// eslint-disable-next-line
// @ts-ignore - Need for declaration merging
declare module '@tuwaio/satellite-react' {
  export interface AllWallets {
    [OrbitAdapter.EVM]: EVMWallet;
  }
  export interface AllConnectors {
    [OrbitAdapter.EVM]: ConnectorEVM;
  }
}
