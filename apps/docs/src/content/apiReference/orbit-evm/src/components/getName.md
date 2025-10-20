[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getName()

> **getName**(`address`): `Promise`\<`string` \| `null`\>

Defined in: [packages/orbit-evm/src/utils/ensUtils.ts:30](https://github.com/TuwaIO/satellite-connect/blob/8fde9e197b7a14ec109c9b43b6cba4ec9463a434/packages/orbit-evm/src/utils/ensUtils.ts#L30)

Fetches the primary ENS name for a given Ethereum address from the Ethereum Mainnet.
Includes caching for performance.

## Parameters

### address

`` `0x${string}` ``

The Ethereum address to look up.

## Returns

`Promise`\<`string` \| `null`\>

The ENS name if found, otherwise null.
