[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# BaseWallet

Defined in: [packages/satellite-core/src/types.ts:26](https://github.com/TuwaIO/satellite-connect/blob/80c744e48bd0282af533cb9ca520149d8c1f125d/packages/satellite-core/src/types.ts#L26)

Base interface for connected wallet information

## Properties

### address

> **address**: `string`

Defined in: [packages/satellite-core/src/types.ts:30](https://github.com/TuwaIO/satellite-connect/blob/80c744e48bd0282af533cb9ca520149d8c1f125d/packages/satellite-core/src/types.ts#L30)

Wallet's public address

***

### chainId

> **chainId**: `string` \| `number`

Defined in: [packages/satellite-core/src/types.ts:32](https://github.com/TuwaIO/satellite-connect/blob/80c744e48bd0282af533cb9ca520149d8c1f125d/packages/satellite-core/src/types.ts#L32)

Connected chain ID

***

### isConnected

> **isConnected**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:38](https://github.com/TuwaIO/satellite-connect/blob/80c744e48bd0282af533cb9ca520149d8c1f125d/packages/satellite-core/src/types.ts#L38)

Connection status

***

### isContractAddress

> **isContractAddress**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:36](https://github.com/TuwaIO/satellite-connect/blob/80c744e48bd0282af533cb9ca520149d8c1f125d/packages/satellite-core/src/types.ts#L36)

Indicates if the address is a smart contract

***

### rpcURL

> **rpcURL**: `string`

Defined in: [packages/satellite-core/src/types.ts:34](https://github.com/TuwaIO/satellite-connect/blob/80c744e48bd0282af533cb9ca520149d8c1f125d/packages/satellite-core/src/types.ts#L34)

RPC endpoint URL

***

### walletIcon?

> `optional` **walletIcon**: `string`

Defined in: [packages/satellite-core/src/types.ts:40](https://github.com/TuwaIO/satellite-connect/blob/80c744e48bd0282af533cb9ca520149d8c1f125d/packages/satellite-core/src/types.ts#L40)

Optional: wallet icon base64 string

***

### walletType

> **walletType**: `` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

Defined in: [packages/satellite-core/src/types.ts:28](https://github.com/TuwaIO/satellite-connect/blob/80c744e48bd0282af533cb9ca520149d8c1f125d/packages/satellite-core/src/types.ts#L28)

Unique identifier of the wallet
