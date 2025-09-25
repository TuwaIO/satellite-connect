[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getSolanaExplorerLink()

> **getSolanaExplorerLink**(`url?`, `cluster?`): `string`

Defined in: [packages/orbit-solana/src/utils/getSolanaExplorerLink.ts:15](https://github.com/TuwaIO/satellite-connect/blob/f8f5982b4939a6a74eb2eb686216730e40bd72ef/packages/orbit-solana/src/utils/getSolanaExplorerLink.ts#L15)

Generates a full URL to a transaction on a Solana explorer like Solscan.

## Parameters

### url?

`string`

The url after baseUrl.

### cluster?

`SolanaClusterMoniker`

The optional cluster name ('devnet', 'testnet') to add as a query parameter.

## Returns

`string`

The full URL to the transaction on the explorer.
