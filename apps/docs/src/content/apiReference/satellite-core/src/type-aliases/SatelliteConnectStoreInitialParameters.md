[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# SatelliteConnectStoreInitialParameters\<C, W\>

> **SatelliteConnectStoreInitialParameters**\<`C`, `W`\> = `OrbitGenericAdapter`\<[`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\>\> & `object`

Defined in: [packages/satellite-core/src/types.ts:151](https://github.com/TuwaIO/satellite-connect/blob/2c21a9769a545a040d3a9c69ab8d5776bece2752/packages/satellite-core/src/types.ts#L151)

Configuration parameters for initializing Satellite Connect store

## Type Declaration

### callbackAfterConnected?

> `optional` **callbackAfterConnected?**: [`ConnectedCallback`](ConnectedCallback.md)\<`W`\>

Optional callback executed after successful connection

## Type Parameters

### C

`C`

### W

`W` *extends* [`BaseConnector`](../interfaces/BaseConnector.md) = [`BaseConnector`](../interfaces/BaseConnector.md)
