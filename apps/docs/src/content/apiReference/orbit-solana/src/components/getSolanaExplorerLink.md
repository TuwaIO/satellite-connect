[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getSolanaExplorerLink()

> **getSolanaExplorerLink**(`url?`, `cluster?`): `string`

Defined in: [packages/orbit-solana/src/utils/getSolanaExplorerLink.ts:14](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/orbit-solana/src/utils/getSolanaExplorerLink.ts#L14)

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
