/**
 * The Solana watcher component, imported from `@tuwaio/satellite-react/solana`. Importing this entry point also adds
 * `SolanaConnection` and `ConnectorSolana` from `@tuwaio/satellite-solana` to `AllConnections` and `AllConnectors`.
 *
 * @module solana
 */

import { OrbitAdapter } from '@tuwaio/orbit-core';
import { ConnectorSolana, SolanaConnection } from '@tuwaio/satellite-solana';

export * from './SolanaConnectorsWatcher';

// eslint-disable-next-line
import type { AllConnections, AllConnectors } from '../types';

// Module augmentation of this package. The package name resolves for consumers (and for TypeDoc through `paths`),
// but not while the package itself is built, so `@ts-expect-error` would fail in one of the two builds.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
declare module '@tuwaio/satellite-react' {
  export interface AllConnections {
    /** Solana connections (`SolanaConnection` from `@tuwaio/satellite-solana`), added by `@tuwaio/satellite-react/solana`. */
    [OrbitAdapter.SOLANA]: SolanaConnection;
  }
  export interface AllConnectors {
    /** Wallet Standard wallets (`ConnectorSolana` from `@tuwaio/satellite-solana`), added by `@tuwaio/satellite-react/solana`. */
    [OrbitAdapter.SOLANA]: ConnectorSolana;
  }
}
