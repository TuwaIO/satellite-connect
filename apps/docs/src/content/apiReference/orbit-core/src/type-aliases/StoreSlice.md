[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# StoreSlice()\<T, S\>

> **StoreSlice**\<`T`, `S`\> = (`set`, `get`) => `T`

Defined in: [packages/orbit-core/src/types.ts:15](https://github.com/TuwaIO/satellite-connect/blob/fe44df5fcdc64f793ead6ffd2cd5581b87d2802e/packages/orbit-core/src/types.ts#L15)

A utility type for creating modular Zustand store slices, enabling composable state management.

## Type Parameters

### T

`T` *extends* `object`

The state slice being defined.

### S

`S` *extends* `object` = `T`

The full store state that includes the slice `T`.

## Parameters

### set

`StoreApi`\<`S` *extends* `T` ? `S` : `S` & `T`\>\[`"setState"`\]

### get

`StoreApi`\<`S` *extends* `T` ? `S` : `S` & `T`\>\[`"getState"`\]

## Returns

`T`
