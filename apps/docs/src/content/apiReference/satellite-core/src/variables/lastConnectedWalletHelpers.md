[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# lastConnectedWalletHelpers

> `const` **lastConnectedWalletHelpers**: `object`

Defined in: [packages/satellite-core/src/utils/lastConnectedWalletHelpers.ts:13](https://github.com/TuwaIO/satellite-connect/blob/4db4fd2faf1732916ae8fd5a07ca3381fe492a8f/packages/satellite-core/src/utils/lastConnectedWalletHelpers.ts#L13)

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
