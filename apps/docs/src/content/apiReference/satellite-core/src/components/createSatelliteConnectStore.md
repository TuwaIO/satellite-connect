[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createSatelliteConnectStore()

> **createSatelliteConnectStore**(`params`): `StoreApi`\<[`ISatelliteConnectStore`](../type-aliases/ISatelliteConnectStore.md)\>

Defined in: [packages/satellite-core/src/store/satelliteConnectStore.ts:19](https://github.com/TuwaIO/satellite-connect/blob/79d73b839b00ddd4e994901de36d7e1cdd634700/packages/satellite-core/src/store/satelliteConnectStore.ts#L19)

Creates a Satellite Connect store instance for managing wallet connections and state

## Parameters

### params

[`SatelliteConnectStoreInitialParameters`](../type-aliases/SatelliteConnectStoreInitialParameters.md)

Configuration parameters for the store

## Returns

`StoreApi`\<[`ISatelliteConnectStore`](../type-aliases/ISatelliteConnectStore.md)\>

A Zustand store instance with wallet connection state and methods
