[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# SatelliteConnectStoreInitialParameters\<C, W\>

> **SatelliteConnectStoreInitialParameters**\<`C`, `W`\> = `OrbitGenericAdapter`\<[`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\>\> & `object`

Defined in: [packages/satellite-core/src/types.ts:151](https://github.com/TuwaIO/satellite-connect/blob/bb3d1b596cd87f593f0a41e54be6625c24681612/packages/satellite-core/src/types.ts#L151)

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
