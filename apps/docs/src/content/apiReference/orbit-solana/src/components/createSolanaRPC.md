[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createSolanaRPC()

> **createSolanaRPC**(`rpcUrlOrMoniker`): `Rpc`\<`SolanaRpcApi`\>

Defined in: [packages/orbit-solana/src/utils/createSolanaRPC.ts:35](https://github.com/TuwaIO/satellite-connect/blob/cf65aef85798c48f1e0cdb9aab536fc9148510dc/packages/orbit-solana/src/utils/createSolanaRPC.ts#L35)

**`Internal`**

Retrieves a cached RPC client for a given URL or cluster moniker.
If no cached client exists, it creates a new instance.

## Parameters

### rpcUrlOrMoniker

`string`

Either a full RPC URL or a cluster moniker like 'mainnet'.

## Returns

`Rpc`\<`SolanaRpcApi`\>

The RPC client instance.
