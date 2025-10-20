[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SolanaWallet

Defined in: [packages/satellite-solana/src/types.ts:7](https://github.com/TuwaIO/satellite-connect/blob/a984de314ae7700080222c75773a9c5ed0a4797b/packages/satellite-solana/src/types.ts#L7)

Extended wallet interface for Solana-specific properties

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

### connectedAccount?

> `optional` **connectedAccount**: `UiWalletAccount`

Defined in: [packages/satellite-solana/src/types.ts:9](https://github.com/TuwaIO/satellite-connect/blob/a984de314ae7700080222c75773a9c5ed0a4797b/packages/satellite-solana/src/types.ts#L9)

Connected Wallet Standard account

***

### connectedWallet?

> `optional` **connectedWallet**: `UiWallet`

Defined in: [packages/satellite-solana/src/types.ts:11](https://github.com/TuwaIO/satellite-connect/blob/a984de314ae7700080222c75773a9c5ed0a4797b/packages/satellite-solana/src/types.ts#L11)

Connected Wallet Standard wallet instance

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
