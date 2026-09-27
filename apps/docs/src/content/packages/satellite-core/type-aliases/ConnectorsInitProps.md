# ConnectorsInitProps

> **ConnectorsInitProps** = `object`

Defined in: [types.ts:7](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L7)

App metadata for creating wallet connectors, such as the wagmi `walletConnect` and `coinbaseWallet` connectors.
Satellite Connect does not read it; UI kits such as Nova Connect accept it to configure their connectors.

## Properties

### appIcons?

> `optional` **appIcons?**: `string`[]

Defined in: [types.ts:21](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L21)

Array of icon URLs for WalletConnect

***

### appLogo?

> `optional` **appLogo?**: `string`

Defined in: [types.ts:15](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L15)

Logo for WalletConnect interface

***

### appLogoUrl?

> `optional` **appLogoUrl?**: `string`

Defined in: [types.ts:11](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L11)

Logo URL for Coinbase Wallet

***

### appName

> **appName**: `string`

Defined in: [types.ts:9](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L9)

Application name displayed in wallet interfaces

***

### appUrl?

> `optional` **appUrl?**: `string`

Defined in: [types.ts:19](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L19)

Application URL for WalletConnect

***

### description?

> `optional` **description?**: `string`

Defined in: [types.ts:17](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L17)

Application description for WalletConnect

***

### projectId?

> `optional` **projectId?**: `string`

Defined in: [types.ts:13](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L13)

WalletConnect project ID (required for WalletConnect functionality)
