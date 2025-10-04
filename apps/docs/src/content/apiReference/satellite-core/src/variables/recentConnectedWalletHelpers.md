[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# recentConnectedWalletHelpers

> `const` **recentConnectedWalletHelpers**: `object`

Defined in: [packages/satellite-core/src/utils/recentConnectedWalletHelpers.ts:15](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/utils/recentConnectedWalletHelpers.ts#L15)

Helper utilities for managing the last connected wallet state

## Type Declaration

### getRecentConnectedWallet()

> **getRecentConnectedWallet**: () => `undefined` \| [`RecentConnectedWallet`](../type-aliases/RecentConnectedWallet.md)

Retrieves the current last connected wallet data from localStorage.

#### Returns

`undefined` \| [`RecentConnectedWallet`](../type-aliases/RecentConnectedWallet.md)

The LastConnectedWallet object or undefined if not set or in SSR context

### recentConnectedWallet

> **recentConnectedWallet**: `undefined` \| [`RecentConnectedWallet`](../type-aliases/RecentConnectedWallet.md)

The value of the last connected wallet, initialized when the module loads.
Returns undefined if not set, invalid, or in an SSR context.

### removeRecentConnectedWallet()

> **removeRecentConnectedWallet**: () => `void`

Removes the last connected wallet data from localStorage.

#### Returns

`void`

undefined in SSR context, void in browser

### setRecentConnectedWallet()

> **setRecentConnectedWallet**: (`data`) => `void`

Stores the last connected wallet data in localStorage.

#### Parameters

##### data

[`RecentConnectedWallet`](../type-aliases/RecentConnectedWallet.md)

Object containing the wallet type and chain ID.

#### Returns

`void`

undefined in SSR context, void in browser

### STORAGE\_KEY

> **STORAGE\_KEY**: `string` = `'satellite-connect:recentConnectedWallet'`

## Remarks

All data is stored in localStorage with the 'satellite-connect:lastConnectedWallet' key.
Functions are safe to use in both browser and SSR environments.
