[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getAvatar()

> **getAvatar**(`name`): `Promise`\<`null` \| `string`\>

Defined in: [packages/orbit-evm/src/utils/ensUtils.ts:40](https://github.com/TuwaIO/satellite-connect/blob/46085d28e0b4ff146f6da7e03a614830032927cd/packages/orbit-evm/src/utils/ensUtils.ts#L40)

Fetches the avatar URL for a given ENS name from the Ethereum Mainnet.

## Parameters

### name

`string`

The ENS name (e.g., 'vitalik.eth').

## Returns

`Promise`\<`null` \| `string`\>

The URL of the avatar image if found, otherwise null.
