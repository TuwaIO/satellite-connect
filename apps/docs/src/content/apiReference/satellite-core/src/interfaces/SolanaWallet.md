[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SolanaWallet

Defined in: [packages/satellite-core/src/types.ts:54](https://github.com/TuwaIO/satellite-connect/blob/706b20808c34d7d74f549c8152769ae1efc5be7f/packages/satellite-core/src/types.ts#L54)

Extended wallet interface for Solana-specific properties

## Extends

- [`BaseWallet`](BaseWallet.md)

## Properties

### address

> **address**: `string`

Defined in: [packages/satellite-core/src/types.ts:40](https://github.com/TuwaIO/satellite-connect/blob/706b20808c34d7d74f549c8152769ae1efc5be7f/packages/satellite-core/src/types.ts#L40)

Wallet's public address

#### Inherited from

[`BaseWallet`](BaseWallet.md).[`address`](BaseWallet.md#address)

***

### chainId

> **chainId**: `string` \| `number`

Defined in: [packages/satellite-core/src/types.ts:42](https://github.com/TuwaIO/satellite-connect/blob/706b20808c34d7d74f549c8152769ae1efc5be7f/packages/satellite-core/src/types.ts#L42)

Connected chain ID

#### Inherited from

[`BaseWallet`](BaseWallet.md).[`chainId`](BaseWallet.md#chainid)

***

### connectedAccount?

> `optional` **connectedAccount**: `UiWalletAccount`

Defined in: [packages/satellite-core/src/types.ts:56](https://github.com/TuwaIO/satellite-connect/blob/706b20808c34d7d74f549c8152769ae1efc5be7f/packages/satellite-core/src/types.ts#L56)

Connected Wallet Standard account

***

### connectedWallet?

> `optional` **connectedWallet**: `UiWallet`

Defined in: [packages/satellite-core/src/types.ts:58](https://github.com/TuwaIO/satellite-connect/blob/706b20808c34d7d74f549c8152769ae1efc5be7f/packages/satellite-core/src/types.ts#L58)

Connected Wallet Standard wallet instance

***

### isConnected

> **isConnected**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:48](https://github.com/TuwaIO/satellite-connect/blob/706b20808c34d7d74f549c8152769ae1efc5be7f/packages/satellite-core/src/types.ts#L48)

Connection status

#### Inherited from

[`BaseWallet`](BaseWallet.md).[`isConnected`](BaseWallet.md#isconnected)

***

### isContractAddress

> **isContractAddress**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:46](https://github.com/TuwaIO/satellite-connect/blob/706b20808c34d7d74f549c8152769ae1efc5be7f/packages/satellite-core/src/types.ts#L46)

Indicates if the address is a smart contract

#### Inherited from

[`BaseWallet`](BaseWallet.md).[`isContractAddress`](BaseWallet.md#iscontractaddress)

***

### rpcURL

> **rpcURL**: `string`

Defined in: [packages/satellite-core/src/types.ts:44](https://github.com/TuwaIO/satellite-connect/blob/706b20808c34d7d74f549c8152769ae1efc5be7f/packages/satellite-core/src/types.ts#L44)

RPC endpoint URL

#### Inherited from

[`BaseWallet`](BaseWallet.md).[`rpcURL`](BaseWallet.md#rpcurl)

***

### walletType

> **walletType**: `` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

Defined in: [packages/satellite-core/src/types.ts:38](https://github.com/TuwaIO/satellite-connect/blob/706b20808c34d7d74f549c8152769ae1efc5be7f/packages/satellite-core/src/types.ts#L38)

Unique identifier of the wallet

#### Inherited from

[`BaseWallet`](BaseWallet.md).[`walletType`](BaseWallet.md#wallettype)
