# SatelliteConnectStoreInitialParameters\<C, W\>

> **SatelliteConnectStoreInitialParameters**\<`C`, `W`\> = `OrbitGenericAdapter`\<[`SatelliteAdapter`](/packages/satellite-core/type-aliases/SatelliteAdapter.md)\<`C`, `W`\>\> & `object`

Defined in: [types.ts:352](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L352)

Parameters of [createSatelliteConnectStore](/packages/satellite-core/functions/createSatelliteConnectStore.md): `adapter` (one adapter or an array, one per chain family) and an
optional `callbackAfterConnected`.

## Type Parameters

### C

`C`

Type of the wallet connectors of the adapters.

### W

`W` *extends* [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md) = [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md)

Chain-specific connection type.

## Type Declaration

### callbackAfterConnected?

> `optional` **callbackAfterConnected?**: [`ConnectedCallback`](/packages/satellite-core/type-aliases/ConnectedCallback.md)\<`W`\>

Runs after a new wallet is connected. See [ConnectedCallback](/packages/satellite-core/type-aliases/ConnectedCallback.md).

### rememberWallet?

> `optional` **rememberWallet?**: `boolean`

The initial `rememberWallet` of the store: `false` saves connections in `sessionStorage` until the user asks to
remember the wallet. Defaults to `true` (`localStorage`). Read once, when the store is created.
