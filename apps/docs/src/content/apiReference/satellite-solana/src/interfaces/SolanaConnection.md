[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SolanaConnection

Defined in: [packages/satellite-solana/src/types.ts:7](https://github.com/TuwaIO/satellite-connect/blob/d7d336e830abe5bae8deffd7f1d1df2803de82d3/packages/satellite-solana/src/types.ts#L7)

Extended wallet interface for Solana-specific properties

## Extends

- `BaseConnector`

## Properties

### address

> **address**: `string`

Defined in: packages/satellite-core/dist/index.d.ts:30

Wallet public address

#### Inherited from

`BaseConnector.address`

***

### chainId

> **chainId**: `string` \| `number`

Defined in: packages/satellite-core/dist/index.d.ts:32

Connected chain ID

#### Inherited from

`BaseConnector.chainId`

***

### connectedAccount?

> `optional` **connectedAccount**: `UiWalletAccount`

Defined in: [packages/satellite-solana/src/types.ts:9](https://github.com/TuwaIO/satellite-connect/blob/d7d336e830abe5bae8deffd7f1d1df2803de82d3/packages/satellite-solana/src/types.ts#L9)

Connected Wallet Standard account

***

### connectedWallet?

> `optional` **connectedWallet**: `UiWallet`

Defined in: [packages/satellite-solana/src/types.ts:11](https://github.com/TuwaIO/satellite-connect/blob/d7d336e830abe5bae8deffd7f1d1df2803de82d3/packages/satellite-solana/src/types.ts#L11)

Connected Wallet Standard wallet instance

***

### connectorType

> **connectorType**: `` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

Defined in: packages/satellite-core/dist/index.d.ts:28

Unique identifier of the connector

#### Inherited from

`BaseConnector.connectorType`

***

### icon?

> `optional` **icon**: `string`

Defined in: packages/satellite-core/dist/index.d.ts:40

Optional: connector icon base64 string

#### Inherited from

`BaseConnector.icon`

***

### isConnected

> **isConnected**: `boolean`

Defined in: packages/satellite-core/dist/index.d.ts:38

Connection status

#### Inherited from

`BaseConnector.isConnected`

***

### isContractAddress

> **isContractAddress**: `boolean`

Defined in: packages/satellite-core/dist/index.d.ts:36

Indicates if the address is a smart contract

#### Inherited from

`BaseConnector.isContractAddress`

***

### rpcURL

> **rpcURL**: `string`

Defined in: packages/satellite-core/dist/index.d.ts:34

RPC endpoint URL

#### Inherited from

`BaseConnector.rpcURL`
