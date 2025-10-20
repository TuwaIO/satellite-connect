[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getAvatar()

> **getAvatar**(`name`): `Promise`\<`string` \| `null`\>

Defined in: [packages/orbit-evm/src/utils/ensUtils.ts:55](https://github.com/TuwaIO/satellite-connect/blob/ba01e3fc506b94850a7d649660df8876351061d8/packages/orbit-evm/src/utils/ensUtils.ts#L55)

Fetches the avatar URL for a given ENS name from the Ethereum Mainnet.
Includes caching for performance.

## Parameters

### name

`string`

The ENS name (e.g., 'vitalik.eth').

## Returns

`Promise`\<`string` \| `null`\>

The URL of the avatar image if found, otherwise null.
