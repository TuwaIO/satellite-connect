[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getParsedStorageItem()

> **getParsedStorageItem**\<`ReturnType`\>(`key`): `undefined` \| `ReturnType`

Defined in: [packages/orbit-core/src/utils/getParsedStorageItem.ts:7](https://github.com/TuwaIO/satellite-connect/blob/1ece594ed6a6d6b166e813f2c5f0e9e1d331be09/packages/orbit-core/src/utils/getParsedStorageItem.ts#L7)

Internal function for safely retrieving and parsing data from localStorage.

## Type Parameters

### ReturnType

`ReturnType`

## Parameters

### key

`string`

The key for localStorage

## Returns

`undefined` \| `ReturnType`

The parsed LastConnectedWallet object or undefined if data is not found/invalid
