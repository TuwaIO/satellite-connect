[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createSatelliteConnectStore()

> **createSatelliteConnectStore**\<`C`, `W`\>(`params`): `StoreApi`\<[`ISatelliteConnectStore`](../type-aliases/ISatelliteConnectStore.md)\<`C`, `W`\>\>

Defined in: [packages/satellite-core/src/store/satelliteConnectStore.ts:26](https://github.com/TuwaIO/satellite-connect/blob/1ef6db61f8be2fb39bd263efa3b02bca81b704da/packages/satellite-core/src/store/satelliteConnectStore.ts#L26)

Creates a Satellite Connect store instance for managing wallet connections and state

## Type Parameters

### C

`C`

### W

`W` *extends* [`BaseWallet`](../interfaces/BaseWallet.md) = [`BaseWallet`](../interfaces/BaseWallet.md)

## Parameters

### params

[`SatelliteConnectStoreInitialParameters`](../type-aliases/SatelliteConnectStoreInitialParameters.md)\<`C`, `W`\>

Configuration parameters for the store

## Returns

`StoreApi`\<[`ISatelliteConnectStore`](../type-aliases/ISatelliteConnectStore.md)\<`C`, `W`\>\>

A Zustand store instance with wallet connection state and methods
