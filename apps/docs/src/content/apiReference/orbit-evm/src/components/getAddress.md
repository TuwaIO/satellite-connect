[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getAddress()

> **getAddress**(`name`): `Promise`\<`null` \| `` `0x${string}` ``\>

Defined in: [packages/orbit-evm/src/utils/ensUtils.ts:82](https://github.com/TuwaIO/satellite-connect/blob/b5a5df814a87c8fe0a316d5477bd4d7f974c2f09/packages/orbit-evm/src/utils/ensUtils.ts#L82)

Fetches the Ethereum address associated with a given ENS name from the Ethereum Mainnet.
Includes caching for performance.

## Parameters

### name

`string`

The ENS name to resolve (e.g., 'vitalik.eth').

## Returns

`Promise`\<`null` \| `` `0x${string}` ``\>

The associated Ethereum address (lowercase) or null if not found.
