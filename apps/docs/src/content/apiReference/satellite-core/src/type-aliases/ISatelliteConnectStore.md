[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# ISatelliteConnectStore\<C, W\>

> **ISatelliteConnectStore**\<`C`, `W`\> = `object`

Defined in: [packages/satellite-core/src/types.ts:90](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L90)

Store interface for managing wallet connections

## Type Parameters

### C

`C`

### W

`W` *extends* [`BaseWallet`](../interfaces/BaseWallet.md) = [`BaseWallet`](../interfaces/BaseWallet.md)

## Properties

### activeWallet?

> `optional` **activeWallet**: [`Wallet`](Wallet.md)\<`W`\>

Defined in: [packages/satellite-core/src/types.ts:110](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L110)

Currently connected wallet

***

### connect()

> **connect**: (`{ walletType, chainId }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:98](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L98)

Connects to specified wallet

#### Parameters

##### \{ walletType, chainId \}

###### chainId

`number` \| `string`

###### walletType

`WalletType`

#### Returns

`Promise`\<`void`\>

***

### disconnect()

> **disconnect**: () => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:100](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L100)

Disconnects active wallet

#### Returns

`Promise`\<`void`\>

***

### disconnectAll()

> **disconnectAll**: () => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:102](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L102)

Disconnects all wallets, used for initialize application

#### Returns

`Promise`\<`void`\>

***

### getAdapter()

> **getAdapter**: (`adapterKey`) => [`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\> \| `undefined`

Defined in: [packages/satellite-core/src/types.ts:92](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L92)

Returns configured adapter(s)

#### Parameters

##### adapterKey

`OrbitAdapter`

#### Returns

[`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\> \| `undefined`

***

### getConnectors()

> **getConnectors**: () => `Partial`\<`Record`\<`OrbitAdapter`, `C`[]\>\>

Defined in: [packages/satellite-core/src/types.ts:94](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L94)

Get wallet connectors

#### Returns

`Partial`\<`Record`\<`OrbitAdapter`, `C`[]\>\>

***

### initializeAutoConnect()

> **initializeAutoConnect**: (`autoConnect`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:96](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L96)

Initialize auto connect logic

#### Parameters

##### autoConnect

`boolean`

#### Returns

`Promise`\<`void`\>

***

### resetSwitchNetworkError()

> **resetSwitchNetworkError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:120](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L120)

Clears network switch error state

#### Returns

`void`

***

### resetWalletConnectionError()

> **resetWalletConnectionError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:112](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L112)

Clears connection error state

#### Returns

`void`

***

### setWalletConnectionError()

> **setWalletConnectionError**: (`error`) => `void`

Defined in: [packages/satellite-core/src/types.ts:108](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L108)

Sets error message if connection failed or form validation failed

#### Parameters

##### error

`string`

#### Returns

`void`

***

### switchNetwork()

> **switchNetwork**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:116](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L116)

Switches network for connected wallet

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### switchNetworkError?

> `optional` **switchNetworkError**: `string`

Defined in: [packages/satellite-core/src/types.ts:118](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L118)

Contains error message if network switch failed

***

### updateActiveWallet()

> **updateActiveWallet**: (`wallet`) => `void`

Defined in: [packages/satellite-core/src/types.ts:114](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L114)

Updates active wallet properties

#### Parameters

##### wallet

`Partial`\<[`Wallet`](Wallet.md)\<`W`\>\>

#### Returns

`void`

***

### walletConnecting

> **walletConnecting**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:104](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L104)

Indicates ongoing connection attempt

***

### walletConnectionError?

> `optional` **walletConnectionError**: `string`

Defined in: [packages/satellite-core/src/types.ts:106](https://github.com/TuwaIO/satellite-connect/blob/d97c72f8292c49ce44f9250832a11dcb8539c34f/packages/satellite-core/src/types.ts#L106)

Contains error message if connection failed
