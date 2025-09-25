[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# ConnectorsInitProps

> **ConnectorsInitProps** = `object`

Defined in: [packages/satellite-core/src/types.ts:14](https://github.com/TuwaIO/satellite-connect/blob/f8f5982b4939a6a74eb2eb686216730e40bd72ef/packages/satellite-core/src/types.ts#L14)

Configuration properties for initializing wallet connectors

## Properties

### appIcons?

> `optional` **appIcons**: `string`[]

Defined in: [packages/satellite-core/src/types.ts:28](https://github.com/TuwaIO/satellite-connect/blob/f8f5982b4939a6a74eb2eb686216730e40bd72ef/packages/satellite-core/src/types.ts#L28)

Array of icon URLs for WalletConnect

***

### appLogo?

> `optional` **appLogo**: `string`

Defined in: [packages/satellite-core/src/types.ts:22](https://github.com/TuwaIO/satellite-connect/blob/f8f5982b4939a6a74eb2eb686216730e40bd72ef/packages/satellite-core/src/types.ts#L22)

Logo for WalletConnect interface

***

### appLogoUrl?

> `optional` **appLogoUrl**: `string`

Defined in: [packages/satellite-core/src/types.ts:18](https://github.com/TuwaIO/satellite-connect/blob/f8f5982b4939a6a74eb2eb686216730e40bd72ef/packages/satellite-core/src/types.ts#L18)

Logo URL for Coinbase Wallet

***

### appName

> **appName**: `string`

Defined in: [packages/satellite-core/src/types.ts:16](https://github.com/TuwaIO/satellite-connect/blob/f8f5982b4939a6a74eb2eb686216730e40bd72ef/packages/satellite-core/src/types.ts#L16)

Application name displayed in wallet interfaces

***

### appUrl?

> `optional` **appUrl**: `string`

Defined in: [packages/satellite-core/src/types.ts:26](https://github.com/TuwaIO/satellite-connect/blob/f8f5982b4939a6a74eb2eb686216730e40bd72ef/packages/satellite-core/src/types.ts#L26)

Application URL for WalletConnect

***

### description?

> `optional` **description**: `string`

Defined in: [packages/satellite-core/src/types.ts:24](https://github.com/TuwaIO/satellite-connect/blob/f8f5982b4939a6a74eb2eb686216730e40bd72ef/packages/satellite-core/src/types.ts#L24)

Application description for WalletConnect

***

### getImpersonatedAccount()?

> `optional` **getImpersonatedAccount**: () => `string` \| `` `0x${string}` `` \| `undefined`

Defined in: [packages/satellite-core/src/types.ts:30](https://github.com/TuwaIO/satellite-connect/blob/f8f5982b4939a6a74eb2eb686216730e40bd72ef/packages/satellite-core/src/types.ts#L30)

Function to get impersonated account address for testing

#### Returns

`string` \| `` `0x${string}` `` \| `undefined`

***

### projectId?

> `optional` **projectId**: `string`

Defined in: [packages/satellite-core/src/types.ts:20](https://github.com/TuwaIO/satellite-connect/blob/f8f5982b4939a6a74eb2eb686216730e40bd72ef/packages/satellite-core/src/types.ts#L20)

WalletConnect project ID (required for WalletConnect functionality)
