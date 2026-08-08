[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# createSatelliteConnectStore()

> **createSatelliteConnectStore**\<`C`, `W`\>(`params`): `StoreApi`\<[`ISatelliteConnectStore`](../type-aliases/ISatelliteConnectStore.md)\<`C`, `W`\>\>

Defined in: [packages/satellite-core/src/store/satelliteConnectStore.ts:27](https://github.com/TuwaIO/satellite-connect/blob/471b799ec718c8b01877f1f886081d2f499b024b/packages/satellite-core/src/store/satelliteConnectStore.ts#L27)

Creates a Satellite Connect store instance for managing connector connections and state

## Type Parameters

### C

`C`

### W

`W` *extends* [`BaseConnector`](../interfaces/BaseConnector.md) = [`BaseConnector`](../interfaces/BaseConnector.md)

## Parameters

### params

[`SatelliteConnectStoreInitialParameters`](../type-aliases/SatelliteConnectStoreInitialParameters.md)\<`C`, `W`\>

Initial parameters for the store

## Returns

`StoreApi`\<[`ISatelliteConnectStore`](../type-aliases/ISatelliteConnectStore.md)\<`C`, `W`\>\>

A Zustand store instance with connection state and methods
