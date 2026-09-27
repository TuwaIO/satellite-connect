# SatelliteConnectStoreInitialParameters\<C, W\>

> **SatelliteConnectStoreInitialParameters**\<`C`, `W`\> = `OrbitGenericAdapter`\<[`SatelliteAdapter`](/packages/satellite-core/type-aliases/SatelliteAdapter.md)\<`C`, `W`\>\> & `object`

Defined in: [types.ts:334](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L334)

Parameters of [createSatelliteConnectStore](/packages/satellite-core/functions/createSatelliteConnectStore.md): `adapter` (one adapter or an array, one per chain family) and an
optional `callbackAfterConnected`.

## Type Declaration

### callbackAfterConnected?

> `optional` **callbackAfterConnected?**: [`ConnectedCallback`](/packages/satellite-core/type-aliases/ConnectedCallback.md)\<`W`\>

Runs after a new wallet is connected. See [ConnectedCallback](/packages/satellite-core/type-aliases/ConnectedCallback.md).

## Type Parameters

### C

`C`

Type of the wallet connectors of the adapters.

### W

`W` *extends* [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md) = [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md)

Chain-specific connection type.
