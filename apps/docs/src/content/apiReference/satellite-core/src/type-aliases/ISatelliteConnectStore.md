[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# ISatelliteConnectStore\<C, W\>

> **ISatelliteConnectStore**\<`C`, `W`\> = `object`

Defined in: [packages/satellite-core/src/types.ts:94](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/types.ts#L94)

Store interface for managing wallet connections

## Type Parameters

### C

`C`

### W

`W` *extends* [`BaseWallet`](../interfaces/BaseWallet.md) = [`BaseWallet`](../interfaces/BaseWallet.md)

## Properties

### activeWallet?

> `optional` **activeWallet**: [`Wallet`](Wallet.md)\<`W`\>

Defined in: [packages/satellite-core/src/types.ts:112](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/types.ts#L112)

Currently connected wallet

***

### connect()

> **connect**: (`{ walletType, chainId }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:102](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/types.ts#L102)

Connects to specified wallet

#### Parameters

##### \{ walletType, chainId \}

###### chainId

`number` \| `string`

###### walletType

[`WalletType`](WalletType.md)

#### Returns

`Promise`\<`void`\>

***

### disconnect()

> **disconnect**: () => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:104](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/types.ts#L104)

Disconnects active wallet

#### Returns

`Promise`\<`void`\>

***

### disconnectAll()

> **disconnectAll**: () => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:106](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/types.ts#L106)

Disconnects all wallets, used for initialize application

#### Returns

`Promise`\<`void`\>

***

### getAdapter()

> **getAdapter**: () => [`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\> \| [`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\>[]

Defined in: [packages/satellite-core/src/types.ts:96](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/types.ts#L96)

Returns configured adapter(s)

#### Returns

[`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\> \| [`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\>[]

***

### getConnectors()

> **getConnectors**: () => `Partial`\<`Record`\<`OrbitAdapter`, `C`[]\>\>

Defined in: [packages/satellite-core/src/types.ts:98](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/types.ts#L98)

Get wallet connectors

#### Returns

`Partial`\<`Record`\<`OrbitAdapter`, `C`[]\>\>

***

### initializeAutoConnect()

> **initializeAutoConnect**: (`autoConnect`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:100](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/types.ts#L100)

Initialize auto connect logic

#### Parameters

##### autoConnect

`boolean`

#### Returns

`Promise`\<`void`\>

***

### resetSwitchNetworkError()

> **resetSwitchNetworkError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:122](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/types.ts#L122)

Clears network switch error state

#### Returns

`void`

***

### resetWalletConnectionError()

> **resetWalletConnectionError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:114](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/types.ts#L114)

Clears connection error state

#### Returns

`void`

***

### switchNetwork()

> **switchNetwork**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:118](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/types.ts#L118)

Switches network for connected wallet

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### switchNetworkError?

> `optional` **switchNetworkError**: `string`

Defined in: [packages/satellite-core/src/types.ts:120](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/types.ts#L120)

Contains error message if network switch failed

***

### updateActiveWallet()

> **updateActiveWallet**: (`wallet`) => `void`

Defined in: [packages/satellite-core/src/types.ts:116](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/types.ts#L116)

Updates active wallet properties

#### Parameters

##### wallet

`Partial`\<[`Wallet`](Wallet.md)\<`W`\>\>

#### Returns

`void`

***

### walletConnecting

> **walletConnecting**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:108](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/types.ts#L108)

Indicates ongoing connection attempt

***

### walletConnectionError?

> `optional` **walletConnectionError**: `string`

Defined in: [packages/satellite-core/src/types.ts:110](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/satellite-core/src/types.ts#L110)

Contains error message if connection failed
