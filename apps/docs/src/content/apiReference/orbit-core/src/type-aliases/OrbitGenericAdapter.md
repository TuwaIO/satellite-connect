[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# OrbitGenericAdapter\<A\>

> **OrbitGenericAdapter**\<`A`\> = `object`

Defined in: [packages/orbit-core/src/types.ts:96](https://github.com/TuwaIO/satellite-connect/blob/ab2889dc16e93ed4e3266b0857ac4dc0998ff86f/packages/orbit-core/src/types.ts#L96)

Generic type for creating blockchain adapters with type safety.
This type ensures that all adapters implement the required interface
and are properly keyed by their blockchain type.

## Example

```typescript
// Single adapter implementation
interface EVMAdapter extends BaseAdapter {
  key: OrbitAdapter.EVM;
  // EVM-specific methods...
}
const evmConfig: OrbitGenericAdapter<EVMAdapter> = {
  adapter: {
    key: OrbitAdapter.EVM,
    // implementation...
  }
};

// Multiple adapters
const multiChainConfig: OrbitGenericAdapter<BaseAdapter> = {
  adapter: [
    { key: OrbitAdapter.EVM, ... },
    { key: OrbitAdapter.SOLANA, ... }
  ]
};
```

## Type Parameters

### A

`A` *extends* `object`

Type that extends the base adapter interface with a key property

## Properties

### adapter

> **adapter**: `A` \| `A`[]

Defined in: [packages/orbit-core/src/types.ts:97](https://github.com/TuwaIO/satellite-connect/blob/ab2889dc16e93ed4e3266b0857ac4dc0998ff86f/packages/orbit-core/src/types.ts#L97)

Single adapter instance or array of adapters
