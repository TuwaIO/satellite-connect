[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# connectedWalletChainHelpers

> `const` **connectedWalletChainHelpers**: `object`

Defined in: [packages/orbit-core/src/utils/connectedWalletChainHelpers.ts:10](https://github.com/TuwaIO/satellite-connect/blob/706b20808c34d7d74f549c8152769ae1efc5be7f/packages/orbit-core/src/utils/connectedWalletChainHelpers.ts#L10)

Helper utilities for managing impersonated wallet addresses

## Type Declaration

### connectedWalletChain

> **connectedWalletChain**: `string`

Currently impersonated address from localStorage
Returns empty string if not set or in SSR context

### getConnectedWalletChain()

> **getConnectedWalletChain**: () => `undefined` \| `null` \| `string`

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

### removeConnectedWalletChain()

> **removeConnectedWalletChain**: () => `void`

#### Returns

`void`

### setConnectedWalletChain()

> **setConnectedWalletChain**: (`chain`) => `void`

Stores an impersonated address in localStorage

#### Parameters

##### chain

`string` | `number`

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
