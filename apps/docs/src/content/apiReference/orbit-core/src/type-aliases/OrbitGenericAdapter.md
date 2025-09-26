[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# OrbitGenericAdapter\<A\>

> **OrbitGenericAdapter**\<`A`\> = `object`

Defined in: [packages/orbit-core/src/types.ts:108](https://github.com/TuwaIO/satellite-connect/blob/d5f27c9ecfc7c137261f9e98cbe815c1fb13b3f0/packages/orbit-core/src/types.ts#L108)

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

Defined in: [packages/orbit-core/src/types.ts:109](https://github.com/TuwaIO/satellite-connect/blob/d5f27c9ecfc7c137261f9e98cbe815c1fb13b3f0/packages/orbit-core/src/types.ts#L109)

Single adapter instance or array of adapters
