[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# lastConnectedWalletHelpers

> `const` **lastConnectedWalletHelpers**: `object`

Defined in: [packages/satellite-core/src/utils/lastConnectedWalletHelpers.ts:40](https://github.com/TuwaIO/satellite-connect/blob/c127bb851e6e0f44c1fb203cade1f2f86bb84bb0/packages/satellite-core/src/utils/lastConnectedWalletHelpers.ts#L40)

Helper utilities for managing the last connected wallet state

## Type Declaration

### getLastConnectedWallet()

> **getLastConnectedWallet**: () => `undefined` \| `LastConnectedWallet`

Retrieves the current last connected wallet data from localStorage.

#### Returns

`undefined` \| `LastConnectedWallet`

The LastConnectedWallet object or undefined if not set or in SSR context

### lastConnectedWallet

> **lastConnectedWallet**: `undefined` \| `LastConnectedWallet`

The value of the last connected wallet, initialized when the module loads.
Returns undefined if not set, invalid, or in an SSR context.

### removeLastConnectedWallet()

> **removeLastConnectedWallet**: () => `void`

Removes the last connected wallet data from localStorage.

#### Returns

`void`

undefined in SSR context, void in browser

### setLastConnectedWallet()

> **setLastConnectedWallet**: (`data`) => `void`

Stores the last connected wallet data in localStorage.

#### Parameters

##### data

`LastConnectedWallet`

Object containing the wallet type and chain ID.

#### Returns

`void`

undefined in SSR context, void in browser

### STORAGE\_KEY

> **STORAGE\_KEY**: `string` = `'satellite-connect:lastConnectedWallet'`

## Remarks

All data is stored in localStorage with the 'satellite-connect:lastConnectedWallet' key.
Functions are safe to use in both browser and SSR environments.
