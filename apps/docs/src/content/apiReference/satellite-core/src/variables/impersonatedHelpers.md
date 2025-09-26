[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# impersonatedHelpers

> `const` **impersonatedHelpers**: `object`

Defined in: [packages/satellite-core/src/utils/impersonatedHelpers.ts:10](https://github.com/TuwaIO/satellite-connect/blob/d5f27c9ecfc7c137261f9e98cbe815c1fb13b3f0/packages/satellite-core/src/utils/impersonatedHelpers.ts#L10)

Helper utilities for managing impersonated wallet addresses

## Type Declaration

### getImpersonated()

> **getImpersonated**: () => `undefined` \| `null` \| `string`

Retrieves the current impersonated address from localStorage

#### Returns

`undefined` \| `null` \| `string`

The impersonated address or undefined if not set or in SSR context

#### Example

```typescript
// Get current impersonated address
const address = impersonatedHelpers.getImpersonated();
if (address) {
  console.log('Currently impersonating:', address);
}
```

### impersonatedAddress

> **impersonatedAddress**: `string`

Currently impersonated address from localStorage
Returns empty string if not set or in SSR context

### removeImpersonated()

> **removeImpersonated**: () => `void`

#### Returns

`void`

### setImpersonated()

> **setImpersonated**: (`address`) => `void`

Stores an impersonated address in localStorage

#### Parameters

##### address

`string`

Ethereum or Solana address to impersonate

#### Returns

`void`

undefined in SSR context, void in browser

#### Example

```typescript
// Set impersonated address
impersonatedHelpers.setImpersonated('0x1234...5678');
```

## Remarks

These utilities are primarily used for development and testing purposes.
They provide a way to simulate different wallet addresses without actually connecting a wallet.
All data is stored in localStorage with the 'satellite-connect:impersonatedAddress' key.
Functions are safe to use in both browser and SSR environments.
