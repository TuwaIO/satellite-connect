[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# BaseConnector

Defined in: [packages/satellite-core/src/types.ts:26](https://github.com/TuwaIO/satellite-connect/blob/172f7e19b6e946c0fcf78c1036579ac2b147292f/packages/satellite-core/src/types.ts#L26)

Base interface for connected connector information

## Properties

### address

> **address**: `string`

Defined in: [packages/satellite-core/src/types.ts:30](https://github.com/TuwaIO/satellite-connect/blob/172f7e19b6e946c0fcf78c1036579ac2b147292f/packages/satellite-core/src/types.ts#L30)

Wallet public address

***

### chainId

> **chainId**: `string` \| `number`

Defined in: [packages/satellite-core/src/types.ts:32](https://github.com/TuwaIO/satellite-connect/blob/172f7e19b6e946c0fcf78c1036579ac2b147292f/packages/satellite-core/src/types.ts#L32)

Connected chain ID

***

### connectorType

> **connectorType**: `` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

Defined in: [packages/satellite-core/src/types.ts:28](https://github.com/TuwaIO/satellite-connect/blob/172f7e19b6e946c0fcf78c1036579ac2b147292f/packages/satellite-core/src/types.ts#L28)

Unique identifier of the connector

***

### icon?

> `optional` **icon**: `string`

Defined in: [packages/satellite-core/src/types.ts:40](https://github.com/TuwaIO/satellite-connect/blob/172f7e19b6e946c0fcf78c1036579ac2b147292f/packages/satellite-core/src/types.ts#L40)

Optional: connector icon base64 string

***

### isConnected

> **isConnected**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:38](https://github.com/TuwaIO/satellite-connect/blob/172f7e19b6e946c0fcf78c1036579ac2b147292f/packages/satellite-core/src/types.ts#L38)

Connection status

***

### isContractAddress

> **isContractAddress**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:36](https://github.com/TuwaIO/satellite-connect/blob/172f7e19b6e946c0fcf78c1036579ac2b147292f/packages/satellite-core/src/types.ts#L36)

Indicates if the address is a smart contract

***

### rpcURL

> **rpcURL**: `string`

Defined in: [packages/satellite-core/src/types.ts:34](https://github.com/TuwaIO/satellite-connect/blob/172f7e19b6e946c0fcf78c1036579ac2b147292f/packages/satellite-core/src/types.ts#L34)

RPC endpoint URL
