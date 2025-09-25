[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SatelliteAdapter

> **SatelliteAdapter** = `object`

Defined in: [packages/satellite-core/src/types.ts:36](https://github.com/TuwaIO/satellite-connect/blob/46085d28e0b4ff146f6da7e03a614830032927cd/packages/satellite-core/src/types.ts#L36)

## Properties

### checkAndSwitchNetwork()

> **checkAndSwitchNetwork**: (`chainId`, `currentChainId?`, `updateActiveWallet?`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:49](https://github.com/TuwaIO/satellite-connect/blob/46085d28e0b4ff146f6da7e03a614830032927cd/packages/satellite-core/src/types.ts#L49)

#### Parameters

##### chainId

`string` | `number`

##### currentChainId?

`string` | `number`

##### updateActiveWallet?

(`wallet`) => `void`

#### Returns

`Promise`\<`void`\>

***

### checkIsContractWallet()?

> `optional` **checkIsContractWallet**: (`{ address, chainId }`) => `Promise`\<`boolean`\>

Defined in: [packages/satellite-core/src/types.ts:57](https://github.com/TuwaIO/satellite-connect/blob/46085d28e0b4ff146f6da7e03a614830032927cd/packages/satellite-core/src/types.ts#L57)

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

Defined in: [packages/satellite-core/src/types.ts:38](https://github.com/TuwaIO/satellite-connect/blob/46085d28e0b4ff146f6da7e03a614830032927cd/packages/satellite-core/src/types.ts#L38)

#### Parameters

##### \{
    walletType,
    chainId,
    connectors,
  \}

###### chainId

`number` \| `string`

###### connectors

[`Connector`](Connector.md)[]

###### walletType

[`WalletType`](WalletType.md)

#### Returns

`Promise`\<[`Wallet`](Wallet.md)\>

***

### disconnect()

> **disconnect**: () => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:47](https://github.com/TuwaIO/satellite-connect/blob/46085d28e0b4ff146f6da7e03a614830032927cd/packages/satellite-core/src/types.ts#L47)

#### Returns

`Promise`\<`void`\>

***

### getAvatar()?

> `optional` **getAvatar**: (`name`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/satellite-core/src/types.ts:56](https://github.com/TuwaIO/satellite-connect/blob/46085d28e0b4ff146f6da7e03a614830032927cd/packages/satellite-core/src/types.ts#L56)

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### getConnectors()

> **getConnectors**: () => `Promise`\<\{ `adapter`: `OrbitAdapter`; `connectors`: [`Connector`](Connector.md)[]; \}\>

Defined in: [packages/satellite-core/src/types.ts:48](https://github.com/TuwaIO/satellite-connect/blob/46085d28e0b4ff146f6da7e03a614830032927cd/packages/satellite-core/src/types.ts#L48)

#### Returns

`Promise`\<\{ `adapter`: `OrbitAdapter`; `connectors`: [`Connector`](Connector.md)[]; \}\>

***

### getExplorerUrl()

> **getExplorerUrl**: (`url?`, `chainId?`) => `string` \| `undefined`

Defined in: [packages/satellite-core/src/types.ts:54](https://github.com/TuwaIO/satellite-connect/blob/46085d28e0b4ff146f6da7e03a614830032927cd/packages/satellite-core/src/types.ts#L54)

#### Parameters

##### url?

`string`

##### chainId?

`string` | `number`

#### Returns

`string` \| `undefined`

***

### getName()?

> `optional` **getName**: (`address`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/satellite-core/src/types.ts:55](https://github.com/TuwaIO/satellite-connect/blob/46085d28e0b4ff146f6da7e03a614830032927cd/packages/satellite-core/src/types.ts#L55)

#### Parameters

##### address

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### key

> **key**: `OrbitAdapter`

Defined in: [packages/satellite-core/src/types.ts:37](https://github.com/TuwaIO/satellite-connect/blob/46085d28e0b4ff146f6da7e03a614830032927cd/packages/satellite-core/src/types.ts#L37)
