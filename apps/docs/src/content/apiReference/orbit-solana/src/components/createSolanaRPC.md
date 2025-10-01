[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# createSolanaRPC()

> **createSolanaRPC**(`rpcUrlOrMoniker`): `Rpc`\<`SolanaRpcApi`\>

Defined in: [packages/orbit-solana/src/utils/createSolanaRPC.ts:35](https://github.com/TuwaIO/satellite-connect/blob/c127bb851e6e0f44c1fb203cade1f2f86bb84bb0/packages/orbit-solana/src/utils/createSolanaRPC.ts#L35)

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
