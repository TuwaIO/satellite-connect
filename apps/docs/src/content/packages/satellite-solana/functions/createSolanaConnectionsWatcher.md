# createSolanaConnectionsWatcher()

> **createSolanaConnectionsWatcher**(`config`, `callbacks`): () => `void`

Defined in: [satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:110](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L110)

Copies the state of the connected Solana wallet into the Satellite Connect store, without a UI framework.
`SolanaConnectorsWatcher` from `@tuwaio/satellite-react/solana` runs it in React apps.

The Wallet Standard has no connection events, so the function does not subscribe to anything: it checks the given
`wallets` once. Call it again whenever the wallets change (the React component calls it on every change of
`useWallets()`). Each call:
- disconnects the active connection when the SIWX sign-in was rejected or failed (see `SatelliteSiwxState` from
  `@tuwaio/satellite-core`);
- when the active connection is a Solana connection, finds its wallet in `wallets` by name and, while the user is
  signed in with SIWX, disconnects when the wallet's first account is not the session account;
- otherwise, unless `connectionError` is set or the sign-in was rejected, merges the wallet's first account, its
  handles and a new `signMessage` into the store when the address or connection state changed or `signMessage` is
  missing;
- disconnects the active connection when its wallet has no accounts left.

## Parameters

### config

[`SolanaWatcherConfig`](/packages/satellite-solana/interfaces/SolanaWatcherConfig.md)

The wallets and the optional SIWX state.

### callbacks

[`SolanaWatcherCallbacks`](/packages/satellite-solana/interfaces/SolanaWatcherCallbacks.md)

Store state and actions.

## Returns

A cleanup function that does nothing, kept for symmetry with `createEVMConnectionsWatcher` from
`@tuwaio/satellite-evm`.

() => `void`

## Example

```ts
import { getAvailableSolanaConnectors } from '@tuwaio/orbit-solana';
import { createSatelliteConnectStore } from '@tuwaio/satellite-core';
import {
  type ConnectorSolana,
  createSolanaConnectionsWatcher,
  satelliteSolanaAdapter,
  type SolanaConnection,
} from '@tuwaio/satellite-solana';

const store = createSatelliteConnectStore<ConnectorSolana, SolanaConnection>({
  adapter: satelliteSolanaAdapter({ rpcUrls: { devnet: 'https://api.devnet.solana.com' } }),
});

// Run after the user switches accounts in the wallet, for example on the wallet's `standard:events` change event.
export function syncSolanaWallets() {
  const { disconnect, updateActiveConnection } = store.getState();
  createSolanaConnectionsWatcher(
    { wallets: getAvailableSolanaConnectors() },
    { disconnect, updateActiveConnection, getState: store.getState },
  );
}
```
