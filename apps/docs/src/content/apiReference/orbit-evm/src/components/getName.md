[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getName()

> **getName**(`address`): `Promise`\<`string` \| `null`\>

Defined in: [packages/orbit-evm/src/utils/ensUtils.ts:30](https://github.com/TuwaIO/satellite-connect/blob/f5b462c7dc3303fb7f6769f339389e88bb5e74c2/packages/orbit-evm/src/utils/ensUtils.ts#L30)

Fetches the primary ENS name for a given Ethereum address from the Ethereum Mainnet.
Includes caching for performance.

## Parameters

### address

`` `0x${string}` ``

The Ethereum address to look up.

## Returns

`Promise`\<`string` \| `null`\>

The ENS name if found, otherwise null.
