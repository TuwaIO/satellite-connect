[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# ISatelliteConnectStore

> **ISatelliteConnectStore** = `object`

Defined in: [packages/satellite-core/src/types.ts:71](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L71)

## Properties

### activeWallet?

> `optional` **activeWallet**: [`Wallet`](Wallet.md)

Defined in: [packages/satellite-core/src/types.ts:83](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L83)

***

### availableConnectors

> **availableConnectors**: `Partial`\<`Record`\<`OrbitAdapter`, [`WalletForConnector`](WalletForConnector.md)[]\>\>

Defined in: [packages/satellite-core/src/types.ts:75](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L75)

***

### connect()

> **connect**: (`{ walletType, chainId }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:78](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L78)

#### Parameters

##### \{ walletType, chainId \}

###### chainId

`number` \| `string`

###### walletType

[`WalletType`](../enumerations/WalletType.md)

#### Returns

`Promise`\<`void`\>

***

### disconnect()

> **disconnect**: () => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:79](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L79)

#### Returns

`Promise`\<`void`\>

***

### getAdapter()

> **getAdapter**: () => [`SatelliteAdapter`](SatelliteAdapter.md) \| [`SatelliteAdapter`](SatelliteAdapter.md)[]

Defined in: [packages/satellite-core/src/types.ts:72](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L72)

#### Returns

[`SatelliteAdapter`](SatelliteAdapter.md) \| [`SatelliteAdapter`](SatelliteAdapter.md)[]

***

### initializeAppConnectors()

> **initializeAppConnectors**: (`{ autoConnect }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:76](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L76)

#### Parameters

##### \{ autoConnect \}

###### autoConnect?

`boolean`

#### Returns

`Promise`\<`void`\>

***

### lastConnectedWallet?

> `optional` **lastConnectedWallet**: `object`

Defined in: [packages/satellite-core/src/types.ts:74](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L74)

#### chainId

> **chainId**: `number` \| `string`

#### walletType

> **walletType**: [`WalletType`](../enumerations/WalletType.md)

***

### resetSwitchNetworkError()

> **resetSwitchNetworkError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:90](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L90)

#### Returns

`void`

***

### resetWalletConnectionError()

> **resetWalletConnectionError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:84](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L84)

#### Returns

`void`

***

### switchNetwork()

> **switchNetwork**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:88](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L88)

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### switchNetworkError?

> `optional` **switchNetworkError**: `string`

Defined in: [packages/satellite-core/src/types.ts:89](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L89)

***

### updateActiveWallet()

> **updateActiveWallet**: (`wallet`) => `void`

Defined in: [packages/satellite-core/src/types.ts:86](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L86)

#### Parameters

##### wallet

`Partial`\<[`Wallet`](Wallet.md)\>

#### Returns

`void`

***

### walletConnecting

> **walletConnecting**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:81](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L81)

***

### walletConnectionError?

> `optional` **walletConnectionError**: `string`

Defined in: [packages/satellite-core/src/types.ts:82](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L82)
