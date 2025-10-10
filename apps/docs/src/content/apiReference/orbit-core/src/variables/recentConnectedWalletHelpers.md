[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# recentConnectedWalletHelpers

> `const` **recentConnectedWalletHelpers**: `object`

Defined in: [packages/orbit-core/src/utils/recentConnectedWalletHelpers.ts:13](https://github.com/TuwaIO/satellite-connect/blob/702ae35d90aec8f4e5597194e84b948dfe79f526/packages/orbit-core/src/utils/recentConnectedWalletHelpers.ts#L13)

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

> **setRecentConnectedWallet**: (`wallets`) => `void`

Stores the last connected wallet data in localStorage.

#### Parameters

##### wallets

[`RecentConnectedWallet`](../type-aliases/RecentConnectedWallet.md)

RecentConnectedWallet

#### Returns

`void`

undefined in SSR context, void in browser

### STORAGE\_KEY

> **STORAGE\_KEY**: `string` = `'orbit-core:recentConnectedWallet'`

## Remarks

All data is stored in localStorage with the 'orbit-core:lastConnectedWallet' key.
Functions are safe to use in both browser and SSR environments.
