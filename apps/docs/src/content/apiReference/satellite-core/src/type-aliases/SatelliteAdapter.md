[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SatelliteAdapter

> **SatelliteAdapter** = `BaseAdapter` & `object`

Defined in: [packages/satellite-core/src/types.ts:76](https://github.com/TuwaIO/satellite-connect/blob/37394ce833ea63a612433094c319e4fa2329a8a8/packages/satellite-core/src/types.ts#L76)

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

> **connect**: (`{ walletType, chainId }`) => `Promise`\<[`Wallet`](Wallet.md)\>

Initiates wallet connection

#### Parameters

##### \{ walletType, chainId \}

###### chainId

`number` \| `string`

###### walletType

[`WalletType`](WalletType.md)

#### Returns

`Promise`\<[`Wallet`](Wallet.md)\>

Promise resolving to connected wallet instance

### disconnect()

> **disconnect**: () => `Promise`\<`void`\>

Disconnects current wallet session

#### Returns

`Promise`\<`void`\>

### getConnectors()

> **getConnectors**: () => `object`

Retrieves available wallet connectors for this adapter

#### Returns

`object`

##### adapter

> **adapter**: `OrbitAdapter`

##### connectors

> **connectors**: [`Connector`](Connector.md)[]

### key

> **key**: `OrbitAdapter`

Unique identifier for the adapter

## Remarks

Adapters provide chain-specific implementation for wallet interactions
