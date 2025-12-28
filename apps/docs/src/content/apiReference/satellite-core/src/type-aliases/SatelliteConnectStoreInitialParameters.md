[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SatelliteConnectStoreInitialParameters\<C, W\>

> **SatelliteConnectStoreInitialParameters**\<`C`, `W`\> = `OrbitGenericAdapter`\<[`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\>\> & `object`

Defined in: [packages/satellite-core/src/types.ts:147](https://github.com/TuwaIO/satellite-connect/blob/583293c4cbd5ac6e17c7d31d44545cfad32f24b4/packages/satellite-core/src/types.ts#L147)

Configuration parameters for initializing Satellite Connect store

## Type Declaration

### callbackAfterConnected?

> `optional` **callbackAfterConnected**: [`ConnectedCallback`](ConnectedCallback.md)\<`W`\>

Optional callback executed after successful connection

## Type Parameters

### C

`C`

### W

`W` *extends* [`BaseConnector`](../interfaces/BaseConnector.md) = [`BaseConnector`](../interfaces/BaseConnector.md)
