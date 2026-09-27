# BaseConnector

Defined in: [types.ts:30](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L30)

A wallet connection in the Satellite Connect store, as returned by the `connect` method of an adapter.
Chain adapters extend it with their own fields (for example `EVMConnection` from `@tuwaio/satellite-evm` and
`SolanaConnection` from `@tuwaio/satellite-solana`). The store keeps connections in memory only; see
[createSatelliteConnectStore](/packages/satellite-core/functions/createSatelliteConnectStore.md) for what is saved to `localStorage`.

## Extended by

- [`EVMConnection`](/packages/satellite-evm/interfaces/EVMConnection.md)
- [`SolanaConnection`](/packages/satellite-solana/interfaces/SolanaConnection.md)

## Properties

### address

> **address**: `string`

Defined in: [types.ts:34](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L34)

Connected account: a `0x` address for EVM, a base58 address for Solana.

***

### chainId

> **chainId**: `string` \| `number`

Defined in: [types.ts:39](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L39)

Chain the wallet is connected to: a numeric chain ID for EVM (for example `1`), a cluster moniker for Solana
(for example `"devnet"` or `"mainnet"`).

***

### connectorType

> **connectorType**: `` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

Defined in: [types.ts:32](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L32)

Connector identifier in the form `"<adapter>:<wallet>"`, for example `"evm:metamask"` or `"solana:phantom"`.

***

### icon?

> `optional` **icon?**: `string`

Defined in: [types.ts:50](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L50)

Wallet icon provided by the wallet, usually a `data:` URI.

***

### isConnected

> **isConnected**: `boolean`

Defined in: [types.ts:48](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L48)

Whether the wallet reports the account as connected.

***

### isContractAddress

> **isContractAddress**: `boolean`

Defined in: [types.ts:46](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L46)

`true` when the account is a smart contract (for example a Safe), as reported by `checkIsContractAddress`.

***

### rpcURL

> **rpcURL**: `string`

Defined in: [types.ts:44](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L44)

RPC URL of the connected chain, set by the adapter. EVM: the default RPC URL of the chain definition; Solana: the
URL configured for the cluster in the adapter's `rpcUrls`.

***

### signMessage?

> `optional` **signMessage?**: (`message`) => `Promise`\<`string`\>

Defined in: [types.ts:58](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L58)

Signs a UTF-8 message with the connected account and resolves to the signature: a hex string for EVM
(`personal_sign`), a base58 string for Solana (`solana:signMessage`). Rejects when the user declines.

#### Parameters

##### message

`string`

The message to sign.

#### Returns

`Promise`\<`string`\>

The signature.
