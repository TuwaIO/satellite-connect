[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# defaultRpcUrlsByMoniker

> `const` **defaultRpcUrlsByMoniker**: `Partial`\<`Record`\<`SolanaClusterMoniker`, `string`\>\>

Defined in: [packages/orbit-solana/src/utils/defaultRpcUrlsByMoniker.ts:8](https://github.com/TuwaIO/satellite-connect/blob/15a38cd0c67a47dfd6de17f989a2c01f56c19d69/packages/orbit-solana/src/utils/defaultRpcUrlsByMoniker.ts#L8)

**`Internal`**

The default RPC URLs for each Solana cluster.
Not all clusters need to be defined; undefined ones will fall back to other logic.
