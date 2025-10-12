[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getRpcUrlForCluster()

> **getRpcUrlForCluster**(`cluster`): `string`

Defined in: [packages/orbit-solana/src/utils/clusterHelpers.ts:25](https://github.com/TuwaIO/satellite-connect/blob/330d436180fd8c24c21d7c546c36112e47df500b/packages/orbit-solana/src/utils/clusterHelpers.ts#L25)

Retrieves the configured RPC URL for a given cluster moniker.

## Parameters

### cluster

`object` & [`SolanaRPCUrls`](../type-aliases/SolanaRPCUrls.md)

The target cluster. Defaults to the wallet's active chain.

## Returns

`string`

The RPC URL or undefined if not found.
