[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# BaseConnector

Defined in: [packages/satellite-core/src/types.ts:27](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L27)

Base interface for connected connector information

## Properties

### address

> **address**: `string`

Defined in: [packages/satellite-core/src/types.ts:31](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L31)

Wallet public address

***

### chainId

> **chainId**: `string` \| `number`

Defined in: [packages/satellite-core/src/types.ts:33](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L33)

Connected chain ID

***

### connectorType

> **connectorType**: `` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

Defined in: [packages/satellite-core/src/types.ts:29](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L29)

Unique identifier of the connector

***

### icon?

> `optional` **icon**: `string`

Defined in: [packages/satellite-core/src/types.ts:41](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L41)

Optional: connector icon base64 string

***

### isConnected

> **isConnected**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:39](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L39)

Connection status

***

### isContractAddress

> **isContractAddress**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:37](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L37)

Indicates if the address is a smart contract

***

### rpcURL

> **rpcURL**: `string`

Defined in: [packages/satellite-core/src/types.ts:35](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L35)

RPC endpoint URL
