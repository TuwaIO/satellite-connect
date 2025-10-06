[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getName()

> **getName**(`address`): `Promise`\<`null` \| `string`\>

Defined in: [packages/orbit-evm/src/utils/ensUtils.ts:30](https://github.com/TuwaIO/satellite-connect/blob/ddaabde390f0fad9738d4cd9e73d411b6af19daf/packages/orbit-evm/src/utils/ensUtils.ts#L30)

Fetches the primary ENS name for a given Ethereum address from the Ethereum Mainnet.
Includes caching for performance.

## Parameters

### address

`` `0x${string}` ``

The Ethereum address to look up.

## Returns

`Promise`\<`null` \| `string`\>

The ENS name if found, otherwise null.
