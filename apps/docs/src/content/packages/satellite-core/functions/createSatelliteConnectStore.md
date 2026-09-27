# createSatelliteConnectStore()

> **createSatelliteConnectStore**\<`C`, `W`\>(`params`): `StoreApi`\<[`ISatelliteConnectStore`](/packages/satellite-core/type-aliases/ISatelliteConnectStore.md)\<`C`, `W`\>\>

Defined in: [store/satelliteConnectStore.ts:66](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/store/satelliteConnectStore.ts#L66)

Creates the Satellite Connect store: a vanilla Zustand store (`zustand/vanilla`) that holds the wallet connections
and the actions described in [ISatelliteConnectStore](/packages/satellite-core/type-aliases/ISatelliteConnectStore.md). It has no UI and no framework dependency;
`SatelliteConnectProvider` from `@tuwaio/satellite-react` creates one for React apps.

Pass one adapter or an array of adapters (one per chain family) as `adapter`, and optionally a
`callbackAfterConnected`. Every call creates an independent store.

The state lives in memory. The actions read and write these `localStorage` keys through the helpers of
`@tuwaio/orbit-core` (nothing is read or written on the server):
- `orbit-core:lastConnectedConnector`: `{ connectorType, chainId, address }` of the active connection, where
  `chainId` is the chain the wallet is connected to, as normalized by the adapter. Written by `connect`,
  `switchConnection`, `disconnect` while other connections remain, and `updateActiveConnection` when the active
  connection changes chain; removed when the last connection is disconnected. `initializeAutoConnect` reads it, and
  so does `@tuwaio/pulsar-solana`.
- `orbit-core:recentlyConnectedConnectorsListHelpers`: `{ [connectorType]: { address, disconnectedTimestamp, icon } }`,
  updated with the current time on every `connect`. `initializeAutoConnect` removes entries older than 7 days.
- `satellite-connect:impersonatedAddress`: removed by `disconnectAll` and when the last connection is disconnected.

The store's Immer instance does not freeze state, because connections hold wallet objects that must stay mutable.
It does not change the global Immer settings of the app.

## Type Parameters

### C

`C`

Type of the wallet connectors of the adapters.

### W

`W` *extends* [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md) = [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md)

Chain-specific connection type.

## Parameters

### params

[`SatelliteConnectStoreInitialParameters`](/packages/satellite-core/type-aliases/SatelliteConnectStoreInitialParameters.md)\<`C`, `W`\>

Store parameters: `adapter` and the optional `callbackAfterConnected`.

## Returns

`StoreApi`\<[`ISatelliteConnectStore`](/packages/satellite-core/type-aliases/ISatelliteConnectStore.md)\<`C`, `W`\>\>

The store (`StoreApi` from `zustand/vanilla`).

## Example

```ts
import { createSatelliteConnectStore } from '@tuwaio/satellite-core';
import { type ConnectorEVM, type EVMConnection, satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { type Config } from '@wagmi/core';
import { mainnet } from 'viem/chains';

declare const wagmiConfig: Config;

const store = createSatelliteConnectStore<ConnectorEVM, EVMConnection>({
  adapter: satelliteEVMAdapter(wagmiConfig, [mainnet]),
});

await store.getState().connect({ connectorType: 'evm:metamask', chainId: mainnet.id });
console.log(store.getState().activeConnection?.address, store.getState().connectionError?.message);
```
