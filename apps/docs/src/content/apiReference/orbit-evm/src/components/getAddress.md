[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getAddress()

> **getAddress**(`name`): `Promise`\<`` `0x${string}` `` \| `null`\>

Defined in: [packages/orbit-evm/src/utils/ensUtils.ts:81](https://github.com/TuwaIO/satellite-connect/blob/f5b462c7dc3303fb7f6769f339389e88bb5e74c2/packages/orbit-evm/src/utils/ensUtils.ts#L81)

Fetches the Ethereum address associated with a given ENS name from the Ethereum Mainnet.
Includes caching for performance.

## Parameters

### name

`string`

The ENS name to resolve (e.g., 'vitalik.eth').

## Returns

`Promise`\<`` `0x${string}` `` \| `null`\>

The associated Ethereum address (lowercase) or null if not found.
