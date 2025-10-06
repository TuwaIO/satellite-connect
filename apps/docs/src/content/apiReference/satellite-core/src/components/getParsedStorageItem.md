[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getParsedStorageItem()

> **getParsedStorageItem**\<`ReturnType`\>(`key`): `undefined` \| `ReturnType`

Defined in: [packages/satellite-core/src/utils/getParsedStorageItem.ts:7](https://github.com/TuwaIO/satellite-connect/blob/7306d7013efe34c392eb892c12ce60d37c9368d9/packages/satellite-core/src/utils/getParsedStorageItem.ts#L7)

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
