[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SatelliteAdapter

> **SatelliteAdapter** = `object`

Defined in: [packages/satellite-core/src/types.ts:51](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L51)

## Properties

### checkAndSwitchNetwork()

> **checkAndSwitchNetwork**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:64](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L64)

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### checkIsContractWallet()?

> `optional` **checkIsContractWallet**: (`{ address, chainId }`) => `Promise`\<`boolean`\>

Defined in: [packages/satellite-core/src/types.ts:68](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L68)

#### Parameters

##### \{ address, chainId \}

###### address

`string`

###### chainId

`string` \| `number`

#### Returns

`Promise`\<`boolean`\>

***

### connect()

> **connect**: (`{
    walletType,
    chainId,
    connectors,
  }`) => `Promise`\<[`Wallet`](Wallet.md)\>

Defined in: [packages/satellite-core/src/types.ts:53](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L53)

#### Parameters

##### \{
    walletType,
    chainId,
    connectors,
  \}

###### chainId

`number` \| `string`

###### connectors

[`WalletForConnector`](WalletForConnector.md)[]

###### walletType

[`WalletType`](../enumerations/WalletType.md)

#### Returns

`Promise`\<[`Wallet`](Wallet.md)\>

***

### disconnect()

> **disconnect**: () => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:62](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L62)

#### Returns

`Promise`\<`void`\>

***

### getAvatar()?

> `optional` **getAvatar**: (`name`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/satellite-core/src/types.ts:67](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L67)

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### getConnectors()

> **getConnectors**: () => `Promise`\<\{ `adapter`: `OrbitAdapter`; `connectors`: [`WalletForConnector`](WalletForConnector.md)[]; \}\>

Defined in: [packages/satellite-core/src/types.ts:63](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L63)

#### Returns

`Promise`\<\{ `adapter`: `OrbitAdapter`; `connectors`: [`WalletForConnector`](WalletForConnector.md)[]; \}\>

***

### getExplorerUrl()

> **getExplorerUrl**: (`url?`) => `string` \| `undefined`

Defined in: [packages/satellite-core/src/types.ts:65](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L65)

#### Parameters

##### url?

`string`

#### Returns

`string` \| `undefined`

***

### getName()?

> `optional` **getName**: (`address`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/satellite-core/src/types.ts:66](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L66)

#### Parameters

##### address

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### key

> **key**: `OrbitAdapter`

Defined in: [packages/satellite-core/src/types.ts:52](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/satellite-core/src/types.ts#L52)
