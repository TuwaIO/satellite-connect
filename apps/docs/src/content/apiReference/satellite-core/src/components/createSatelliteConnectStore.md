[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createSatelliteConnectStore()

> **createSatelliteConnectStore**(`params`): `StoreApi`\<[`ISatelliteConnectStore`](../type-aliases/ISatelliteConnectStore.md)\>

Defined in: [packages/satellite-core/src/store/satelliteConnectStore.ts:20](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/store/satelliteConnectStore.ts#L20)

Creates a Satellite Connect store instance for managing wallet connections and state

## Parameters

### params

[`SatelliteConnectStoreInitialParameters`](../type-aliases/SatelliteConnectStoreInitialParameters.md)

Configuration parameters for the store

## Returns

`StoreApi`\<[`ISatelliteConnectStore`](../type-aliases/ISatelliteConnectStore.md)\>

A Zustand store instance with wallet connection state and methods
