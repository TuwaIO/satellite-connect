[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# ISatelliteConnectStore

> **ISatelliteConnectStore** = `object`

Defined in: [packages/satellite-core/src/types.ts:113](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/types.ts#L113)

Store interface for managing wallet connections

## Properties

### activeWallet?

> `optional` **activeWallet**: [`Wallet`](Wallet.md)

Defined in: [packages/satellite-core/src/types.ts:135](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/types.ts#L135)

Currently connected wallet

***

### connect()

> **connect**: (`{ walletType, chainId }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:123](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/types.ts#L123)

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

Defined in: [packages/satellite-core/src/types.ts:126](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/types.ts#L126)

Disconnects active wallet

#### Returns

`Promise`\<`void`\>

***

### getAdapter()

> **getAdapter**: () => [`SatelliteAdapter`](SatelliteAdapter.md) \| [`SatelliteAdapter`](SatelliteAdapter.md)[]

Defined in: [packages/satellite-core/src/types.ts:115](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/types.ts#L115)

Returns configured adapter(s)

#### Returns

[`SatelliteAdapter`](SatelliteAdapter.md) \| [`SatelliteAdapter`](SatelliteAdapter.md)[]

***

### getConnectors()

> **getConnectors**: () => `Partial`\<`Record`\<`OrbitAdapter`, [`Connector`](Connector.md)[]\>\>

Defined in: [packages/satellite-core/src/types.ts:118](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/types.ts#L118)

Get wallet connectors

#### Returns

`Partial`\<`Record`\<`OrbitAdapter`, [`Connector`](Connector.md)[]\>\>

***

### initializeAutoConnect()

> **initializeAutoConnect**: (`autoConnect`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:120](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/types.ts#L120)

#### Parameters

##### autoConnect

`boolean`

#### Returns

`Promise`\<`void`\>

***

### resetSwitchNetworkError()

> **resetSwitchNetworkError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:150](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/types.ts#L150)

Clears network switch error state

#### Returns

`void`

***

### resetWalletConnectionError()

> **resetWalletConnectionError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:138](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/types.ts#L138)

Clears connection error state

#### Returns

`void`

***

### switchNetwork()

> **switchNetwork**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:144](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/types.ts#L144)

Switches network for connected wallet

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### switchNetworkError?

> `optional` **switchNetworkError**: `string`

Defined in: [packages/satellite-core/src/types.ts:147](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/types.ts#L147)

Contains error message if network switch failed

***

### updateActiveWallet()

> **updateActiveWallet**: (`wallet`) => `void`

Defined in: [packages/satellite-core/src/types.ts:141](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/types.ts#L141)

Updates active wallet properties

#### Parameters

##### wallet

`Partial`\<[`Wallet`](Wallet.md)\>

#### Returns

`void`

***

### walletConnecting

> **walletConnecting**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:129](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/types.ts#L129)

Indicates ongoing connection attempt

***

### walletConnectionError?

> `optional` **walletConnectionError**: `string`

Defined in: [packages/satellite-core/src/types.ts:132](https://github.com/TuwaIO/satellite-connect/blob/6b07abfa613f97ccf5edb0965881589b4c913983/packages/satellite-core/src/types.ts#L132)

Contains error message if connection failed
