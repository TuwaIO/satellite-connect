# SolanaConnection

Defined in: [satellite-solana/src/types.ts:9](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/types.ts#L9)

A Solana connection in the Satellite Connect store: `BaseConnector` from `@tuwaio/satellite-core` plus the Wallet
Standard handles of the wallet and account. `chainId` is a cluster moniker (for example `"devnet"`) and
`signMessage` returns a base58 signature.

## Extends

- [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md)

## Properties

### address

> **address**: `string`

Defined in: [satellite-core/src/types.ts:34](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L34)

Connected account: a `0x` address for EVM, a base58 address for Solana.

#### Inherited from

[`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md).[`address`](/packages/satellite-core/interfaces/BaseConnector.md#address)

***

### chainId

> **chainId**: `string` \| `number`

Defined in: [satellite-core/src/types.ts:39](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L39)

Chain the wallet is connected to: a numeric chain ID for EVM (for example `1`), a cluster moniker for Solana
(for example `"devnet"` or `"mainnet"`).

#### Inherited from

[`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md).[`chainId`](/packages/satellite-core/interfaces/BaseConnector.md#chainid)

***

### connectedAccount?

> `optional` **connectedAccount?**: `UiWalletAccount`

Defined in: [satellite-solana/src/types.ts:11](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/types.ts#L11)

Wallet Standard UI handle of the connected account (the first account of the wallet).

***

### connectedWallet?

> `optional` **connectedWallet?**: `UiWallet`

Defined in: [satellite-solana/src/types.ts:13](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/types.ts#L13)

Wallet Standard UI handle of the connected wallet.

***

### connectorType

> **connectorType**: `` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

Defined in: [satellite-core/src/types.ts:32](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L32)

Connector identifier in the form `"<adapter>:<wallet>"`, for example `"evm:metamask"` or `"solana:phantom"`.

#### Inherited from

[`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md).[`connectorType`](/packages/satellite-core/interfaces/BaseConnector.md#connectortype)

***

### icon?

> `optional` **icon?**: `string`

Defined in: [satellite-core/src/types.ts:50](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L50)

Wallet icon provided by the wallet, usually a `data:` URI.

#### Inherited from

[`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md).[`icon`](/packages/satellite-core/interfaces/BaseConnector.md#icon)

***

### isConnected

> **isConnected**: `boolean`

Defined in: [satellite-core/src/types.ts:48](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L48)

Whether the wallet reports the account as connected.

#### Inherited from

[`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md).[`isConnected`](/packages/satellite-core/interfaces/BaseConnector.md#isconnected)

***

### isContractAddress

> **isContractAddress**: `boolean`

Defined in: [satellite-core/src/types.ts:46](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L46)

`true` when the account is a smart contract (for example a Safe), as reported by `checkIsContractAddress`.

#### Inherited from

[`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md).[`isContractAddress`](/packages/satellite-core/interfaces/BaseConnector.md#iscontractaddress)

***

### rpcURL

> **rpcURL**: `string`

Defined in: [satellite-core/src/types.ts:44](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L44)

RPC URL of the connected chain, set by the adapter. EVM: the default RPC URL of the chain definition; Solana: the
URL configured for the cluster in the adapter's `rpcUrls`.

#### Inherited from

[`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md).[`rpcURL`](/packages/satellite-core/interfaces/BaseConnector.md#rpcurl)

***

### signMessage?

> `optional` **signMessage?**: (`message`) => `Promise`\<`string`\>

Defined in: [satellite-core/src/types.ts:58](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L58)

Signs a UTF-8 message with the connected account and resolves to the signature: a hex string for EVM
(`personal_sign`), a base58 string for Solana (`solana:signMessage`). Rejects when the user declines.

#### Parameters

##### message

`string`

The message to sign.

#### Returns

`Promise`\<`string`\>

The signature.

#### Inherited from

[`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md).[`signMessage`](/packages/satellite-core/interfaces/BaseConnector.md#signmessage)
