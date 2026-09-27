# createEVMConnectionsWatcher()

> **createEVMConnectionsWatcher**(`config`, `callbacks`): () => `void`

Defined in: [satellite-evm/src/utils/createEVMConnectionsWatcher.ts:121](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L121)

Keeps the Satellite Connect store in sync with wagmi, without a UI framework. `EVMConnectorsWatcher` from
`@tuwaio/satellite-react/evm` runs it in React apps.

When created, it disconnects the active connection if the SIWX sign-in was rejected or failed (see
`SatelliteSiwxState` from `@tuwaio/satellite-core`), and sets `signMessage` on an active EVM connection that wagmi
reports as connected. Then it subscribes to wagmi's `watchConnections`. On every change, unless the active connection
belongs to another chain family:
- when wagmi has no connection left, the active connection is disconnected;
- otherwise, unless `connectionError` is set: while the user is signed in with SIWX, the active connection is
  disconnected when the wallet account or chain no longer matches the session; in all other cases the connector
  type, address, chain, RPC URL and `signMessage` of the wagmi connection are merged into the store.

Pass the store's `getState` as `callbacks.getState`, so the active connection and the error are read on every event.
`config.siwx` is read when the watcher is created: create a new watcher when the SIWX state changes.

## Parameters

### config

[`EVMWatcherConfig`](/packages/satellite-evm/interfaces/EVMWatcherConfig.md)

The wagmi config and the optional SIWX state.

### callbacks

[`EVMWatcherCallbacks`](/packages/satellite-evm/interfaces/EVMWatcherCallbacks.md)

Store state and actions.

## Returns

A function that unsubscribes from wagmi.

() => `void`

## Example

```ts
import { createSatelliteConnectStore } from '@tuwaio/satellite-core';
import {
  type ConnectorEVM,
  createEVMConnectionsWatcher,
  type EVMConnection,
  satelliteEVMAdapter,
} from '@tuwaio/satellite-evm';
import { type Config } from '@wagmi/core';
import { mainnet } from 'viem/chains';

declare const wagmiConfig: Config;

const store = createSatelliteConnectStore<ConnectorEVM, EVMConnection>({
  adapter: satelliteEVMAdapter(wagmiConfig, [mainnet]),
});

const { disconnect, updateActiveConnection } = store.getState();
export const unwatch = createEVMConnectionsWatcher(
  { wagmiConfig },
  { disconnect, updateActiveConnection, getState: store.getState },
);
```
