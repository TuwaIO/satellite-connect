[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# EVMWallet

Defined in: [packages/satellite-evm/src/types.ts:10](https://github.com/TuwaIO/satellite-connect/blob/1ef6db61f8be2fb39bd263efa3b02bca81b704da/packages/satellite-evm/src/types.ts#L10)

Extended wallet interface for EVM-specific properties

## Extends

- `BaseWallet`

## Properties

### address

> **address**: `string`

Defined in: packages/satellite-core/dist/index.d.ts:30

Wallet's public address

#### Inherited from

`BaseWallet.address`

***

### chainId

> **chainId**: `string` \| `number`

Defined in: packages/satellite-core/dist/index.d.ts:32

Connected chain ID

#### Inherited from

`BaseWallet.chainId`

***

### connector?

> `optional` **connector**: [`ConnectorEVM`](../type-aliases/ConnectorEVM.md)

Defined in: [packages/satellite-evm/src/types.ts:12](https://github.com/TuwaIO/satellite-connect/blob/1ef6db61f8be2fb39bd263efa3b02bca81b704da/packages/satellite-evm/src/types.ts#L12)

Connected Wallet Standard account

***

### isConnected

> **isConnected**: `boolean`

Defined in: packages/satellite-core/dist/index.d.ts:38

Connection status

#### Inherited from

`BaseWallet.isConnected`

***

### isContractAddress

> **isContractAddress**: `boolean`

Defined in: packages/satellite-core/dist/index.d.ts:36

Indicates if the address is a smart contract

#### Inherited from

`BaseWallet.isContractAddress`

***

### rpcURL

> **rpcURL**: `string`

Defined in: packages/satellite-core/dist/index.d.ts:34

RPC endpoint URL

#### Inherited from

`BaseWallet.rpcURL`

***

### walletIcon?

> `optional` **walletIcon**: `string`

Defined in: packages/satellite-core/dist/index.d.ts:40

Optional: wallet icon base64 string

#### Inherited from

`BaseWallet.walletIcon`

***

### walletType

> **walletType**: `` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

Defined in: packages/satellite-core/dist/index.d.ts:28

Unique identifier of the wallet

#### Inherited from

`BaseWallet.walletType`
