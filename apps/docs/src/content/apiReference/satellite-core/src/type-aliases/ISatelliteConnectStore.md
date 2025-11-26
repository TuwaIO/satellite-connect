[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# ISatelliteConnectStore\<C, W\>

> **ISatelliteConnectStore**\<`C`, `W`\> = `object`

Defined in: [packages/satellite-core/src/types.ts:90](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L90)

Store interface for managing wallet connections

## Type Parameters

### C

`C`

### W

`W` *extends* [`BaseWallet`](../interfaces/BaseWallet.md) = [`BaseWallet`](../interfaces/BaseWallet.md)

## Properties

### activeConnection?

> `optional` **activeConnection**: [`Wallet`](Wallet.md)\<`W`\>

Defined in: [packages/satellite-core/src/types.ts:110](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L110)

Currently connected wallet

***

### connect()

> **connect**: (`{ walletType, chainId }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:98](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L98)

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

### connections

> **connections**: `Record`\<`WalletType`, [`Wallet`](Wallet.md)\<`W`\>\>

Defined in: [packages/satellite-core/src/types.ts:112](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L112)

List of all connected wallets

***

### disconnect()

> **disconnect**: (`walletType?`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:100](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L100)

Disconnects active wallet

#### Parameters

##### walletType?

`WalletType`

#### Returns

`Promise`\<`void`\>

***

### disconnectAll()

> **disconnectAll**: () => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:102](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L102)

Disconnects all wallets, used for initialize application

#### Returns

`Promise`\<`void`\>

***

### getAdapter()

> **getAdapter**: (`adapterKey`) => [`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\> \| `undefined`

Defined in: [packages/satellite-core/src/types.ts:92](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L92)

Returns configured adapter(s)

#### Parameters

##### adapterKey

`OrbitAdapter`

#### Returns

[`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\> \| `undefined`

***

### getConnectors()

> **getConnectors**: () => `Partial`\<`Record`\<`OrbitAdapter`, `C`[]\>\>

Defined in: [packages/satellite-core/src/types.ts:94](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L94)

Get wallet connectors

#### Returns

`Partial`\<`Record`\<`OrbitAdapter`, `C`[]\>\>

***

### initializeAutoConnect()

> **initializeAutoConnect**: (`autoConnect`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:96](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L96)

Initialize auto connect logic

#### Parameters

##### autoConnect

`boolean`

#### Returns

`Promise`\<`void`\>

***

### resetSwitchNetworkError()

> **resetSwitchNetworkError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:124](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L124)

Clears network switch error state

#### Returns

`void`

***

### resetWalletConnectionError()

> **resetWalletConnectionError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:114](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L114)

Clears connection error state

#### Returns

`void`

***

### setWalletConnectionError()

> **setWalletConnectionError**: (`error`) => `void`

Defined in: [packages/satellite-core/src/types.ts:108](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L108)

Sets error message if connection failed or form validation failed

#### Parameters

##### error

`string`

#### Returns

`void`

***

### switchConnection()

> **switchConnection**: (`walletType`) => `void`

Defined in: [packages/satellite-core/src/types.ts:118](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L118)

Switches active connection from the list of connections

#### Parameters

##### walletType

`WalletType`

#### Returns

`void`

***

### switchNetwork()

> **switchNetwork**: (`chainId`, `walletType?`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:120](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L120)

Switches network for connected wallet

#### Parameters

##### chainId

`string` | `number`

##### walletType?

`WalletType`

#### Returns

`Promise`\<`void`\>

***

### switchNetworkError?

> `optional` **switchNetworkError**: `string`

Defined in: [packages/satellite-core/src/types.ts:122](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L122)

Contains error message if network switch failed

***

### updateActiveConnection()

> **updateActiveConnection**: (`wallet`) => `void`

Defined in: [packages/satellite-core/src/types.ts:116](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L116)

Updates active wallet properties

#### Parameters

##### wallet

`Partial`\<[`Wallet`](Wallet.md)\<`W`\>\>

#### Returns

`void`

***

### walletConnecting

> **walletConnecting**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:104](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L104)

Indicates ongoing connection attempt

***

### walletConnectionError?

> `optional` **walletConnectionError**: `string`

Defined in: [packages/satellite-core/src/types.ts:106](https://github.com/TuwaIO/satellite-connect/blob/a8427865ad2d78385bb939d79a585626102c516d/packages/satellite-core/src/types.ts#L106)

Contains error message if connection failed
