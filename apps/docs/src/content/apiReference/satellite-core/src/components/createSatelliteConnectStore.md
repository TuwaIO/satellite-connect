[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createSatelliteConnectStore()

> **createSatelliteConnectStore**\<`C`, `W`\>(`params`): `StoreApi`\<[`ISatelliteConnectStore`](../type-aliases/ISatelliteConnectStore.md)\<`C`, `W`\>\>

Defined in: [packages/satellite-core/src/store/satelliteConnectStore.ts:26](https://github.com/TuwaIO/satellite-connect/blob/f5a33602a94f12164f98fee3e0a15f9d30f8edf1/packages/satellite-core/src/store/satelliteConnectStore.ts#L26)

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
