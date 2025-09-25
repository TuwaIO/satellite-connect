[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getName()

> **getName**(`address`): `Promise`\<`null` \| `string`\>

Defined in: [packages/orbit-evm/src/utils/ensUtils.ts:23](https://github.com/TuwaIO/satellite-connect/blob/46085d28e0b4ff146f6da7e03a614830032927cd/packages/orbit-evm/src/utils/ensUtils.ts#L23)

Fetches the primary ENS name for a given Ethereum address from the Ethereum Mainnet.

## Parameters

### address

`` `0x${string}` ``

The Ethereum address to look up.

## Returns

`Promise`\<`null` \| `string`\>

The ENS name if found, otherwise null.
