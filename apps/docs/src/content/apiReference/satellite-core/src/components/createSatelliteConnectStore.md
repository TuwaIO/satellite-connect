[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createSatelliteConnectStore()

> **createSatelliteConnectStore**\<`C`, `W`\>(`params`): `StoreApi`\<[`ISatelliteConnectStore`](../type-aliases/ISatelliteConnectStore.md)\<`C`, `W`\>\>

Defined in: [packages/satellite-core/src/store/satelliteConnectStore.ts:27](https://github.com/TuwaIO/satellite-connect/blob/c56c9bfa37d037e850df05f8ae905a30e86dc610/packages/satellite-core/src/store/satelliteConnectStore.ts#L27)

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
