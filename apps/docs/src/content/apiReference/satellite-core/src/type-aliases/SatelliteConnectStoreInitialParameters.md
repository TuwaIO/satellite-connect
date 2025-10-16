[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SatelliteConnectStoreInitialParameters\<C, W\>

> **SatelliteConnectStoreInitialParameters**\<`C`, `W`\> = `OrbitGenericAdapter`\<[`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\>\> & `object`

Defined in: [packages/satellite-core/src/types.ts:131](https://github.com/TuwaIO/satellite-connect/blob/5732da82a0309c4d5befbfef8ec58250e036aa85/packages/satellite-core/src/types.ts#L131)

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
