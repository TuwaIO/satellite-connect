[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getParsedStorageItem()

> **getParsedStorageItem**\<`ReturnType`\>(`key`): `undefined` \| `ReturnType`

Defined in: [packages/satellite-core/src/utils/getParsedStorageItem.ts:7](https://github.com/TuwaIO/satellite-connect/blob/fe44df5fcdc64f793ead6ffd2cd5581b87d2802e/packages/satellite-core/src/utils/getParsedStorageItem.ts#L7)

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
