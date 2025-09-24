[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getSolanaAvatar()

> **getSolanaAvatar**(`rpcUrl`, `name`): `Promise`\<`null` \| `string`\>

Defined in: [packages/orbit-solana/src/utils/snsUtils.ts:79](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/orbit-solana/src/utils/snsUtils.ts#L79)

Retrieves the avatar URL from the 'pic' record of a .sol domain name.

## Parameters

### rpcUrl

`string`

The RPC endpoint URL.

### name

`string`

The .sol domain name (e.g., "bonfida.sol").

## Returns

`Promise`\<`null` \| `string`\>

The URL of the avatar or null if not found or set.
