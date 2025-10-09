[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SatelliteConnectStoreInitialParameters\<C, W\>

> **SatelliteConnectStoreInitialParameters**\<`C`, `W`\> = `OrbitGenericAdapter`\<[`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\>\> & `object`

Defined in: [packages/satellite-core/src/types.ts:135](https://github.com/TuwaIO/satellite-connect/blob/930fdeaad2ebc9b322f050387d7adc84f5a20805/packages/satellite-core/src/types.ts#L135)

Configuration parameters for initializing Satellite Connect store

## Type Declaration

### callbackAfterConnected?

> `optional` **callbackAfterConnected**: [`WalletConnectedCallback`](WalletConnectedCallback.md)\<`W`\>

Optional callback executed after successful wallet connection

## Type Parameters

### C

`C`

### W

`W` *extends* [`BaseWallet`](../interfaces/BaseWallet.md) = [`BaseWallet`](../interfaces/BaseWallet.md)
