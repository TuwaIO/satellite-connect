[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SatelliteAdapter\<C, W\>

> **SatelliteAdapter**\<`C`, `W`\> = `BaseAdapter` & `object`

Defined in: [packages/satellite-core/src/types.ts:51](https://github.com/TuwaIO/satellite-connect/blob/7152f5954aced9a2f352b283101af590ca9b12b7/packages/satellite-core/src/types.ts#L51)

Interface for blockchain network adapters

## Type Declaration

### checkAndSwitchNetwork()

> **checkAndSwitchNetwork**: (`chainId`, `currentChainId?`, `updateActiveWallet?`) => `Promise`\<`void`\>

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

### checkIsContractWallet()?

> `optional` **checkIsContractWallet**: (`{ address, chainId }`) => `Promise`\<`boolean`\>

Optional method to check if address is a smart contract

#### Parameters

##### \{ address, chainId \}

###### address

`string`

###### chainId

`string` \| `number`

#### Returns

`Promise`\<`boolean`\>

### connect()

> **connect**: (`{ walletType, chainId }`) => `Promise`\<[`Wallet`](Wallet.md)\<`W`\>\>

Initiates wallet connection

#### Parameters

##### \{ walletType, chainId \}

###### chainId

`number` \| `string`

###### walletType

`WalletType`

#### Returns

`Promise`\<[`Wallet`](Wallet.md)\<`W`\>\>

Promise resolving to connected wallet instance

### disconnect()

> **disconnect**: (`activeWallet?`) => `Promise`\<`void`\>

Disconnects current wallet session

#### Parameters

##### activeWallet?

[`Wallet`](Wallet.md)\<`W`\>

#### Returns

`Promise`\<`void`\>

### getBalance()

> **getBalance**: (`address`, `chainId`) => `Promise`\<\{ `symbol`: `string`; `value`: `string`; \}\>

#### Parameters

##### address

`string`

##### chainId

`number` | `string`

#### Returns

`Promise`\<\{ `symbol`: `string`; `value`: `string`; \}\>

### getConnectors()

> **getConnectors**: () => `object`

Retrieves available wallet connectors for this adapter

#### Returns

`object`

##### adapter

> **adapter**: `OrbitAdapter`

##### connectors

> **connectors**: `C`[]

### getSafeConnectorChainId()?

> `optional` **getSafeConnectorChainId**: () => `Promise`\<`number` \| `undefined`\>

Optional method to get a safe connector chainId for auto connect

#### Returns

`Promise`\<`number` \| `undefined`\>

### key

> **key**: `OrbitAdapter`

Unique identifier for the adapter

## Type Parameters

### C

`C`

### W

`W` *extends* [`BaseWallet`](../interfaces/BaseWallet.md) = [`BaseWallet`](../interfaces/BaseWallet.md)

## Remarks

Adapters provide chain-specific implementation for wallet interactions
