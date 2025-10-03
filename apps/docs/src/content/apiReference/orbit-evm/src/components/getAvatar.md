[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getAvatar()

> **getAvatar**(`name`): `Promise`\<`null` \| `string`\>

Defined in: [packages/orbit-evm/src/utils/ensUtils.ts:55](https://github.com/TuwaIO/satellite-connect/blob/7153c192e149741492d64e5f5fb21e5234c768e4/packages/orbit-evm/src/utils/ensUtils.ts#L55)

Fetches the avatar URL for a given ENS name from the Ethereum Mainnet.
Includes caching for performance.

## Parameters

### name

`string`

The ENS name (e.g., 'vitalik.eth').

## Returns

`Promise`\<`null` \| `string`\>

The URL of the avatar image if found, otherwise null.
