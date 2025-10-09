[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# EVMWallet

Defined in: [packages/satellite-evm/src/types.ts:10](https://github.com/TuwaIO/satellite-connect/blob/4f76a87e579b63c369c8f53617217acd2776747b/packages/satellite-evm/src/types.ts#L10)

Extended wallet interface for EVM-specific properties

## Extends

- `BaseWallet`

## Properties

### address

> **address**: `string`

Defined in: packages/satellite-core/dist/index.d.ts:36

Wallet's public address

#### Inherited from

`BaseWallet.address`

***

### chainId

> **chainId**: `string` \| `number`

Defined in: packages/satellite-core/dist/index.d.ts:38

Connected chain ID

#### Inherited from

`BaseWallet.chainId`

***

### connector?

> `optional` **connector**: [`ConnectorEVM`](../type-aliases/ConnectorEVM.md)

Defined in: [packages/satellite-evm/src/types.ts:12](https://github.com/TuwaIO/satellite-connect/blob/4f76a87e579b63c369c8f53617217acd2776747b/packages/satellite-evm/src/types.ts#L12)

Connected Wallet Standard account

***

### isConnected

> **isConnected**: `boolean`

Defined in: packages/satellite-core/dist/index.d.ts:44

Connection status

#### Inherited from

`BaseWallet.isConnected`

***

### isContractAddress

> **isContractAddress**: `boolean`

Defined in: packages/satellite-core/dist/index.d.ts:42

Indicates if the address is a smart contract

#### Inherited from

`BaseWallet.isContractAddress`

***

### rpcURL

> **rpcURL**: `string`

Defined in: packages/satellite-core/dist/index.d.ts:40

RPC endpoint URL

#### Inherited from

`BaseWallet.rpcURL`

***

### walletIcon?

> `optional` **walletIcon**: `string`

Defined in: packages/satellite-core/dist/index.d.ts:46

Optional: wallet icon base64 string

#### Inherited from

`BaseWallet.walletIcon`

***

### walletType

> **walletType**: `` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

Defined in: packages/satellite-core/dist/index.d.ts:34

Unique identifier of the wallet

#### Inherited from

`BaseWallet.walletType`
