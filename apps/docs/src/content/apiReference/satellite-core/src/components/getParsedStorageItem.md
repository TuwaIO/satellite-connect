[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getParsedStorageItem()

> **getParsedStorageItem**\<`ReturnType`\>(`key`): `undefined` \| `ReturnType`

Defined in: [packages/satellite-core/src/utils/getParsedStorageItem.ts:7](https://github.com/TuwaIO/satellite-connect/blob/76f200ba88ce70bc6938df1b9fbbdccaaa8c027a/packages/satellite-core/src/utils/getParsedStorageItem.ts#L7)

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
