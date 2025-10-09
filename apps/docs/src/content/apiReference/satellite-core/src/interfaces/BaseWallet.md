[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# BaseWallet

Defined in: [packages/satellite-core/src/types.ts:32](https://github.com/TuwaIO/satellite-connect/blob/930fdeaad2ebc9b322f050387d7adc84f5a20805/packages/satellite-core/src/types.ts#L32)

Base interface for connected wallet information

## Properties

### address

> **address**: `string`

Defined in: [packages/satellite-core/src/types.ts:36](https://github.com/TuwaIO/satellite-connect/blob/930fdeaad2ebc9b322f050387d7adc84f5a20805/packages/satellite-core/src/types.ts#L36)

Wallet's public address

***

### chainId

> **chainId**: `string` \| `number`

Defined in: [packages/satellite-core/src/types.ts:38](https://github.com/TuwaIO/satellite-connect/blob/930fdeaad2ebc9b322f050387d7adc84f5a20805/packages/satellite-core/src/types.ts#L38)

Connected chain ID

***

### isConnected

> **isConnected**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:44](https://github.com/TuwaIO/satellite-connect/blob/930fdeaad2ebc9b322f050387d7adc84f5a20805/packages/satellite-core/src/types.ts#L44)

Connection status

***

### isContractAddress

> **isContractAddress**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:42](https://github.com/TuwaIO/satellite-connect/blob/930fdeaad2ebc9b322f050387d7adc84f5a20805/packages/satellite-core/src/types.ts#L42)

Indicates if the address is a smart contract

***

### rpcURL

> **rpcURL**: `string`

Defined in: [packages/satellite-core/src/types.ts:40](https://github.com/TuwaIO/satellite-connect/blob/930fdeaad2ebc9b322f050387d7adc84f5a20805/packages/satellite-core/src/types.ts#L40)

RPC endpoint URL

***

### walletIcon?

> `optional` **walletIcon**: `string`

Defined in: [packages/satellite-core/src/types.ts:46](https://github.com/TuwaIO/satellite-connect/blob/930fdeaad2ebc9b322f050387d7adc84f5a20805/packages/satellite-core/src/types.ts#L46)

Optional: wallet icon base64 string

***

### walletType

> **walletType**: `` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

Defined in: [packages/satellite-core/src/types.ts:34](https://github.com/TuwaIO/satellite-connect/blob/930fdeaad2ebc9b322f050387d7adc84f5a20805/packages/satellite-core/src/types.ts#L34)

Unique identifier of the wallet
