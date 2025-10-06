[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# ConnectorsInitProps

> **ConnectorsInitProps** = `object`

Defined in: [packages/satellite-core/src/types.ts:12](https://github.com/TuwaIO/satellite-connect/blob/76f200ba88ce70bc6938df1b9fbbdccaaa8c027a/packages/satellite-core/src/types.ts#L12)

Configuration properties for initializing wallet connectors

## Properties

### appIcons?

> `optional` **appIcons**: `string`[]

Defined in: [packages/satellite-core/src/types.ts:26](https://github.com/TuwaIO/satellite-connect/blob/76f200ba88ce70bc6938df1b9fbbdccaaa8c027a/packages/satellite-core/src/types.ts#L26)

Array of icon URLs for WalletConnect

***

### appLogo?

> `optional` **appLogo**: `string`

Defined in: [packages/satellite-core/src/types.ts:20](https://github.com/TuwaIO/satellite-connect/blob/76f200ba88ce70bc6938df1b9fbbdccaaa8c027a/packages/satellite-core/src/types.ts#L20)

Logo for WalletConnect interface

***

### appLogoUrl?

> `optional` **appLogoUrl**: `string`

Defined in: [packages/satellite-core/src/types.ts:16](https://github.com/TuwaIO/satellite-connect/blob/76f200ba88ce70bc6938df1b9fbbdccaaa8c027a/packages/satellite-core/src/types.ts#L16)

Logo URL for Coinbase Wallet

***

### appName

> **appName**: `string`

Defined in: [packages/satellite-core/src/types.ts:14](https://github.com/TuwaIO/satellite-connect/blob/76f200ba88ce70bc6938df1b9fbbdccaaa8c027a/packages/satellite-core/src/types.ts#L14)

Application name displayed in wallet interfaces

***

### appUrl?

> `optional` **appUrl**: `string`

Defined in: [packages/satellite-core/src/types.ts:24](https://github.com/TuwaIO/satellite-connect/blob/76f200ba88ce70bc6938df1b9fbbdccaaa8c027a/packages/satellite-core/src/types.ts#L24)

Application URL for WalletConnect

***

### description?

> `optional` **description**: `string`

Defined in: [packages/satellite-core/src/types.ts:22](https://github.com/TuwaIO/satellite-connect/blob/76f200ba88ce70bc6938df1b9fbbdccaaa8c027a/packages/satellite-core/src/types.ts#L22)

Application description for WalletConnect

***

### getImpersonatedAccount()?

> `optional` **getImpersonatedAccount**: () => `string` \| `` `0x${string}` `` \| `undefined`

Defined in: [packages/satellite-core/src/types.ts:28](https://github.com/TuwaIO/satellite-connect/blob/76f200ba88ce70bc6938df1b9fbbdccaaa8c027a/packages/satellite-core/src/types.ts#L28)

Function to get impersonated account address for testing

#### Returns

`string` \| `` `0x${string}` `` \| `undefined`

***

### projectId?

> `optional` **projectId**: `string`

Defined in: [packages/satellite-core/src/types.ts:18](https://github.com/TuwaIO/satellite-connect/blob/76f200ba88ce70bc6938df1b9fbbdccaaa8c027a/packages/satellite-core/src/types.ts#L18)

WalletConnect project ID (required for WalletConnect functionality)
