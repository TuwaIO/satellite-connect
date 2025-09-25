[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# BaseWallet

Defined in: [packages/satellite-core/src/types.ts:36](https://github.com/TuwaIO/satellite-connect/blob/49b38ffcdc75724c7917425f1ae5bfff12102201/packages/satellite-core/src/types.ts#L36)

Base interface for connected wallet information

## Extended by

- [`SolanaWallet`](SolanaWallet.md)

## Properties

### address

> **address**: `string`

Defined in: [packages/satellite-core/src/types.ts:40](https://github.com/TuwaIO/satellite-connect/blob/49b38ffcdc75724c7917425f1ae5bfff12102201/packages/satellite-core/src/types.ts#L40)

Wallet's public address

***

### chainId

> **chainId**: `string` \| `number`

Defined in: [packages/satellite-core/src/types.ts:42](https://github.com/TuwaIO/satellite-connect/blob/49b38ffcdc75724c7917425f1ae5bfff12102201/packages/satellite-core/src/types.ts#L42)

Connected chain ID

***

### isConnected

> **isConnected**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:48](https://github.com/TuwaIO/satellite-connect/blob/49b38ffcdc75724c7917425f1ae5bfff12102201/packages/satellite-core/src/types.ts#L48)

Connection status

***

### isContractAddress

> **isContractAddress**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:46](https://github.com/TuwaIO/satellite-connect/blob/49b38ffcdc75724c7917425f1ae5bfff12102201/packages/satellite-core/src/types.ts#L46)

Indicates if the address is a smart contract

***

### rpcURL

> **rpcURL**: `string`

Defined in: [packages/satellite-core/src/types.ts:44](https://github.com/TuwaIO/satellite-connect/blob/49b38ffcdc75724c7917425f1ae5bfff12102201/packages/satellite-core/src/types.ts#L44)

RPC endpoint URL

***

### walletType

> **walletType**: `` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

Defined in: [packages/satellite-core/src/types.ts:38](https://github.com/TuwaIO/satellite-connect/blob/49b38ffcdc75724c7917425f1ae5bfff12102201/packages/satellite-core/src/types.ts#L38)

Unique identifier of the wallet
