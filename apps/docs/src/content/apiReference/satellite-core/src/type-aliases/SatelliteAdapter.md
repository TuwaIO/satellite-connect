[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SatelliteAdapter

> **SatelliteAdapter** = `object`

Defined in: [packages/satellite-core/src/types.ts:76](https://github.com/TuwaIO/satellite-connect/blob/ab2889dc16e93ed4e3266b0857ac4dc0998ff86f/packages/satellite-core/src/types.ts#L76)

Interface for blockchain network adapters

## Remarks

Adapters provide chain-specific implementation for wallet interactions

## Properties

### checkAndSwitchNetwork()

> **checkAndSwitchNetwork**: (`chainId`, `currentChainId?`, `updateActiveWallet?`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:106](https://github.com/TuwaIO/satellite-connect/blob/ab2889dc16e93ed4e3266b0857ac4dc0998ff86f/packages/satellite-core/src/types.ts#L106)

Handles network switching for connected wallet

#### Parameters

##### chainId

Target chain ID

`string` | `number`

##### currentChainId?

Current chain ID

`string` | `number`

##### updateActiveWallet?

(`wallet`) => `void`

Callback to update wallet state

#### Returns

`Promise`\<`void`\>

***

### checkIsContractWallet()?

> `optional` **checkIsContractWallet**: (`{ address, chainId }`) => `Promise`\<`boolean`\>

Defined in: [packages/satellite-core/src/types.ts:125](https://github.com/TuwaIO/satellite-connect/blob/ab2889dc16e93ed4e3266b0857ac4dc0998ff86f/packages/satellite-core/src/types.ts#L125)

Optional method to check if address is a smart contract

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

Defined in: [packages/satellite-core/src/types.ts:84](https://github.com/TuwaIO/satellite-connect/blob/ab2889dc16e93ed4e3266b0857ac4dc0998ff86f/packages/satellite-core/src/types.ts#L84)

Initiates wallet connection

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

Promise resolving to connected wallet instance

***

### disconnect()

> **disconnect**: () => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:95](https://github.com/TuwaIO/satellite-connect/blob/ab2889dc16e93ed4e3266b0857ac4dc0998ff86f/packages/satellite-core/src/types.ts#L95)

Disconnects current wallet session

#### Returns

`Promise`\<`void`\>

***

### getAvatar()?

> `optional` **getAvatar**: (`name`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/satellite-core/src/types.ts:122](https://github.com/TuwaIO/satellite-connect/blob/ab2889dc16e93ed4e3266b0857ac4dc0998ff86f/packages/satellite-core/src/types.ts#L122)

Optional method to get avatar for resolved names

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### getConnectors()

> **getConnectors**: () => `Promise`\<\{ `adapter`: `OrbitAdapter`; `connectors`: [`Connector`](Connector.md)[]; \}\>

Defined in: [packages/satellite-core/src/types.ts:98](https://github.com/TuwaIO/satellite-connect/blob/ab2889dc16e93ed4e3266b0857ac4dc0998ff86f/packages/satellite-core/src/types.ts#L98)

Retrieves available wallet connectors for this adapter

#### Returns

`Promise`\<\{ `adapter`: `OrbitAdapter`; `connectors`: [`Connector`](Connector.md)[]; \}\>

***

### getExplorerUrl()

> **getExplorerUrl**: (`url?`, `chainId?`) => `string` \| `undefined`

Defined in: [packages/satellite-core/src/types.ts:116](https://github.com/TuwaIO/satellite-connect/blob/ab2889dc16e93ed4e3266b0857ac4dc0998ff86f/packages/satellite-core/src/types.ts#L116)

Generates blockchain explorer URL

#### Parameters

##### url?

`string`

##### chainId?

`string` | `number`

#### Returns

`string` \| `undefined`

Explorer URL or undefined if not available

***

### getName()?

> `optional` **getName**: (`address`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/satellite-core/src/types.ts:119](https://github.com/TuwaIO/satellite-connect/blob/ab2889dc16e93ed4e3266b0857ac4dc0998ff86f/packages/satellite-core/src/types.ts#L119)

Optional method to resolve ENS-like names

#### Parameters

##### address

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### key

> **key**: `OrbitAdapter`

Defined in: [packages/satellite-core/src/types.ts:78](https://github.com/TuwaIO/satellite-connect/blob/ab2889dc16e93ed4e3266b0857ac4dc0998ff86f/packages/satellite-core/src/types.ts#L78)

Unique identifier for the adapter
