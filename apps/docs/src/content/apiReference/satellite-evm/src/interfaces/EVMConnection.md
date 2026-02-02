[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# EVMConnection

Defined in: [packages/satellite-evm/src/types.ts:10](https://github.com/TuwaIO/satellite-connect/blob/09041998720a3fee0000bf1a7833bb9031de54bc/packages/satellite-evm/src/types.ts#L10)

Extended wallet interface for EVM-specific properties

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

### connector?

> `optional` **connector**: [`ConnectorEVM`](../type-aliases/ConnectorEVM.md)

Defined in: [packages/satellite-evm/src/types.ts:12](https://github.com/TuwaIO/satellite-connect/blob/09041998720a3fee0000bf1a7833bb9031de54bc/packages/satellite-evm/src/types.ts#L12)

Connected Wallet Standard account

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
