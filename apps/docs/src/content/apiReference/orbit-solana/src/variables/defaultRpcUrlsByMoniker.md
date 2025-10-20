[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# defaultRpcUrlsByMoniker

> `const` **defaultRpcUrlsByMoniker**: `Partial`\<`Record`\<`SolanaClusterMoniker`, `string`\>\>

Defined in: [packages/orbit-solana/src/utils/defaultRpcUrlsByMoniker.ts:8](https://github.com/TuwaIO/satellite-connect/blob/8fde9e197b7a14ec109c9b43b6cba4ec9463a434/packages/orbit-solana/src/utils/defaultRpcUrlsByMoniker.ts#L8)

**`Internal`**

The default RPC URLs for each Solana cluster.
Not all clusters need to be defined; undefined ones will fall back to other logic.
