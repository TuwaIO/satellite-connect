[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# recentConnectedWalletsHelpers

> `const` **recentConnectedWalletsHelpers**: `object`

Defined in: [packages/satellite-core/src/utils/recentConnectedWalletsHelpers.ts:13](https://github.com/TuwaIO/satellite-connect/blob/7306d7013efe34c392eb892c12ce60d37c9368d9/packages/satellite-core/src/utils/recentConnectedWalletsHelpers.ts#L13)

Helper utilities for managing the last connected wallet state

## Type Declaration

### getRecentConnectedWallets()

> **getRecentConnectedWallets**: () => `undefined` \| [`RecentConnectedWallet`](../type-aliases/RecentConnectedWallet.md)

Retrieves the current last connected wallet data from localStorage.

#### Returns

`undefined` \| [`RecentConnectedWallet`](../type-aliases/RecentConnectedWallet.md)

The LastConnectedWallet object or undefined if not set or in SSR context

### recentConnectedWallets

> **recentConnectedWallets**: `undefined` \| [`RecentConnectedWallet`](../type-aliases/RecentConnectedWallet.md)

The value of the last connected wallet, initialized when the module loads.
Returns undefined if not set, invalid, or in an SSR context.

### removeRecentConnectedWallets()

> **removeRecentConnectedWallets**: () => `void`

Removes the last connected wallet data from localStorage.

#### Returns

`void`

undefined in SSR context, void in browser

### setRecentConnectedWallets()

> **setRecentConnectedWallets**: (`wallets`) => `void`

Stores the last connected wallet data in localStorage.

#### Parameters

##### wallets

[`RecentConnectedWallet`](../type-aliases/RecentConnectedWallet.md)

RecentConnectedWallet

#### Returns

`void`

undefined in SSR context, void in browser

### STORAGE\_KEY

> **STORAGE\_KEY**: `string` = `'satellite-connect:recentConnectedWallets'`

## Remarks

All data is stored in localStorage with the 'satellite-connect:lastConnectedWallet' key.
Functions are safe to use in both browser and SSR environments.
