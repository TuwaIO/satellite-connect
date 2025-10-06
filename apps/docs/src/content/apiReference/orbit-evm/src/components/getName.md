[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getName()

> **getName**(`address`): `Promise`\<`null` \| `string`\>

Defined in: [packages/orbit-evm/src/utils/ensUtils.ts:30](https://github.com/TuwaIO/satellite-connect/blob/4db4fd2faf1732916ae8fd5a07ca3381fe492a8f/packages/orbit-evm/src/utils/ensUtils.ts#L30)

Fetches the primary ENS name for a given Ethereum address from the Ethereum Mainnet.
Includes caching for performance.

## Parameters

### address

`` `0x${string}` ``

The Ethereum address to look up.

## Returns

`Promise`\<`null` \| `string`\>

The ENS name if found, otherwise null.
