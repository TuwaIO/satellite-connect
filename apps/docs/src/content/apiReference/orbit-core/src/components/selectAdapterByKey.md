[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# selectAdapterByKey()

> **selectAdapterByKey**\<`A`\>(`options`): `undefined` \| `A`

Defined in: [packages/orbit-core/src/utils/selectAdapterByKey.ts:46](https://github.com/TuwaIO/satellite-connect/blob/706b20808c34d7d74f549c8152769ae1efc5be7f/packages/orbit-core/src/utils/selectAdapterByKey.ts#L46)

Selects an appropriate adapter based on the provided key from either a single adapter
or an array of adapters.

## Type Parameters

### A

`A` *extends* `object`

Type extending basic adapter interface with a key property

## Parameters

### options

`object` & [`OrbitGenericAdapter`](../type-aliases/OrbitGenericAdapter.md)\<`A`\>

Selection configuration object

## Returns

`undefined` \| `A`

Selected adapter or undefined if no suitable adapter found

## Remarks

If an array is provided but no matching adapter is found, falls back to the first adapter
in the array with a warning message.

## Example

```typescript
// Single adapter usage
const singleResult = selectAdapterByKey({
  adapterKey: OrbitAdapter.SOLANA,
  adapter: { key: OrbitAdapter.SOLANA, connect: async () => {...} }
});

// Multiple adapters usage
const multiResult = selectAdapterByKey({
  adapterKey: OrbitAdapter.EVM,
  adapter: [
    { key: OrbitAdapter.SOLANA, connect: async () => {...} },
    { key: OrbitAdapter.EVM, connect: async () => {...} }
  ]
});
```

## Throws

Logs error if adapter array is empty

## Throws

Logs warning if requested adapter key not found in array
