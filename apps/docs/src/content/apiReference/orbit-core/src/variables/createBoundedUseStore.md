[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createBoundedUseStore()

> `const` **createBoundedUseStore**: \<`S`\>(`store`) => \{(): `ExtractState`\<`S`\>; \<`T`\>(`selector`): `T`; \}

Defined in: [packages/orbit-core/src/utils/createBoundedUseStore.ts:34](https://github.com/TuwaIO/satellite-connect/blob/8af5ba76f248b2d5386322999904d21ced4220f4/packages/orbit-core/src/utils/createBoundedUseStore.ts#L34)

Creates a bounded `useStore` hook from a vanilla Zustand store.

This function takes a vanilla Zustand store instance and returns a React hook
that is pre-bound to that store. This approach provides a cleaner API and
enhances type inference, eliminating the need to pass the store instance
on every use.

The returned hook supports two signatures:
1. `useBoundedStore()`: Selects the entire state.
2. `useBoundedStore(selector)`: Selects a slice of the state, returning only what the selector function specifies.

## Type Parameters

### S

`S` *extends* `StoreApi`\<`unknown`\>

The type of the Zustand store (`StoreApi`).

## Parameters

### store

`S`

The vanilla Zustand store instance to bind the hook to.

## Returns

A fully typed React hook for accessing the store's state.

> (): `ExtractState`\<`S`\>

### Returns

`ExtractState`\<`S`\>

> \<`T`\>(`selector`): `T`

### Type Parameters

#### T

`T`

### Parameters

#### selector

(`state`) => `T`

### Returns

`T`
