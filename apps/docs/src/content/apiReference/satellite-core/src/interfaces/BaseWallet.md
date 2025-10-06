[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# BaseWallet

Defined in: [packages/satellite-core/src/types.ts:34](https://github.com/TuwaIO/satellite-connect/blob/9f8bdfdc0fd5ac99db1856a9609370f06e17bdd9/packages/satellite-core/src/types.ts#L34)

Base interface for connected wallet information

## Properties

### address

> **address**: `string`

Defined in: [packages/satellite-core/src/types.ts:38](https://github.com/TuwaIO/satellite-connect/blob/9f8bdfdc0fd5ac99db1856a9609370f06e17bdd9/packages/satellite-core/src/types.ts#L38)

Wallet's public address

***

### chainId

> **chainId**: `string` \| `number`

Defined in: [packages/satellite-core/src/types.ts:40](https://github.com/TuwaIO/satellite-connect/blob/9f8bdfdc0fd5ac99db1856a9609370f06e17bdd9/packages/satellite-core/src/types.ts#L40)

Connected chain ID

***

### isConnected

> **isConnected**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:46](https://github.com/TuwaIO/satellite-connect/blob/9f8bdfdc0fd5ac99db1856a9609370f06e17bdd9/packages/satellite-core/src/types.ts#L46)

Connection status

***

### isContractAddress

> **isContractAddress**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:44](https://github.com/TuwaIO/satellite-connect/blob/9f8bdfdc0fd5ac99db1856a9609370f06e17bdd9/packages/satellite-core/src/types.ts#L44)

Indicates if the address is a smart contract

***

### rpcURL

> **rpcURL**: `string`

Defined in: [packages/satellite-core/src/types.ts:42](https://github.com/TuwaIO/satellite-connect/blob/9f8bdfdc0fd5ac99db1856a9609370f06e17bdd9/packages/satellite-core/src/types.ts#L42)

RPC endpoint URL

***

### walletType

> **walletType**: `` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

Defined in: [packages/satellite-core/src/types.ts:36](https://github.com/TuwaIO/satellite-connect/blob/9f8bdfdc0fd5ac99db1856a9609370f06e17bdd9/packages/satellite-core/src/types.ts#L36)

Unique identifier of the wallet
