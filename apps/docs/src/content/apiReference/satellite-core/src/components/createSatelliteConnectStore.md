[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createSatelliteConnectStore()

> **createSatelliteConnectStore**(`params`): `StoreApi`\<[`ISatelliteConnectStore`](../type-aliases/ISatelliteConnectStore.md)\>

Defined in: [packages/satellite-core/src/store/satelliteConnectStore.ts:18](https://github.com/TuwaIO/satellite-connect/blob/706b20808c34d7d74f549c8152769ae1efc5be7f/packages/satellite-core/src/store/satelliteConnectStore.ts#L18)

Creates a Satellite Connect store instance for managing wallet connections and state

## Parameters

### params

[`SatelliteConnectStoreInitialParameters`](../type-aliases/SatelliteConnectStoreInitialParameters.md)

Configuration parameters for the store

## Returns

`StoreApi`\<[`ISatelliteConnectStore`](../type-aliases/ISatelliteConnectStore.md)\>

A Zustand store instance with wallet connection state and methods
