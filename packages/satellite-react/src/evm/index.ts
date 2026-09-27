/**
 * The EVM watcher component, imported from `@tuwaio/satellite-react/evm`. Importing this entry point also adds
 * `EVMConnection` and `ConnectorEVM` from `@tuwaio/satellite-evm` to `AllConnections` and `AllConnectors`.
 *
 * @module evm
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { ConnectorEVM, EVMConnection } from '@tuwaio/satellite-evm';

export * from './EVMConnectorsWatcher';

// eslint-disable-next-line
import type { AllConnections, AllConnectors } from '../types';

// Module augmentation of this package. The package name resolves for consumers (and for TypeDoc through `paths`),
// but not while the package itself is built, so `@ts-expect-error` would fail in one of the two builds.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
declare module '@tuwaio/satellite-react' {
  export interface AllConnections {
    /** EVM connections (`EVMConnection` from `@tuwaio/satellite-evm`), added by `@tuwaio/satellite-react/evm`. */
    [OrbitAdapter.EVM]: EVMConnection;
  }
  export interface AllConnectors {
    /** wagmi connectors (`ConnectorEVM` from `@tuwaio/satellite-evm`), added by `@tuwaio/satellite-react/evm`. */
    [OrbitAdapter.EVM]: ConnectorEVM;
  }
}
