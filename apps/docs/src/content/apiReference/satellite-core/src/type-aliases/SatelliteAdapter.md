[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SatelliteAdapter

> **SatelliteAdapter** = `object`

Defined in: [packages/satellite-core/src/types.ts:47](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L47)

## Properties

### checkAndSwitchNetwork()

> **checkAndSwitchNetwork**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:60](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L60)

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### checkIsContractWallet()?

> `optional` **checkIsContractWallet**: (`{ address, chainId }`) => `Promise`\<`boolean`\>

Defined in: [packages/satellite-core/src/types.ts:64](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L64)

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

Defined in: [packages/satellite-core/src/types.ts:49](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L49)

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

Defined in: [packages/satellite-core/src/types.ts:58](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L58)

#### Returns

`Promise`\<`void`\>

***

### getAvatar()?

> `optional` **getAvatar**: (`name`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/satellite-core/src/types.ts:63](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L63)

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### getConnectors()

> **getConnectors**: () => `Promise`\<\{ `adapter`: `OrbitAdapter`; `connectors`: [`WalletForConnector`](WalletForConnector.md)[]; \}\>

Defined in: [packages/satellite-core/src/types.ts:59](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L59)

#### Returns

`Promise`\<\{ `adapter`: `OrbitAdapter`; `connectors`: [`WalletForConnector`](WalletForConnector.md)[]; \}\>

***

### getExplorerUrl()

> **getExplorerUrl**: (`url?`) => `string` \| `undefined`

Defined in: [packages/satellite-core/src/types.ts:61](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L61)

#### Parameters

##### url?

`string`

#### Returns

`string` \| `undefined`

***

### getName()?

> `optional` **getName**: (`address`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/satellite-core/src/types.ts:62](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L62)

#### Parameters

##### address

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### key

> **key**: `OrbitAdapter`

Defined in: [packages/satellite-core/src/types.ts:48](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L48)
