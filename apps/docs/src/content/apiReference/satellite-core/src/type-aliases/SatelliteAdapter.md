[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SatelliteAdapter

> **SatelliteAdapter** = `BaseAdapter` & `object`

Defined in: [packages/satellite-core/src/types.ts:76](https://github.com/TuwaIO/satellite-connect/blob/f5894097799001a0b1e31f7bc6553222215758b5/packages/satellite-core/src/types.ts#L76)

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

> **connect**: (`{
    walletType,
    chainId,
    connectors,
  }`) => `Promise`\<[`Wallet`](Wallet.md)\>

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

### disconnect()

> **disconnect**: () => `Promise`\<`void`\>

Disconnects current wallet session

#### Returns

`Promise`\<`void`\>

### getConnectors()

> **getConnectors**: () => `Promise`\<\{ `adapter`: `OrbitAdapter`; `connectors`: [`Connector`](Connector.md)[]; \}\>

Retrieves available wallet connectors for this adapter

#### Returns

`Promise`\<\{ `adapter`: `OrbitAdapter`; `connectors`: [`Connector`](Connector.md)[]; \}\>

### key

> **key**: `OrbitAdapter`

Unique identifier for the adapter

## Remarks

Adapters provide chain-specific implementation for wallet interactions
