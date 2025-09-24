[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getAddress()

> **getAddress**(`name`): `Promise`\<`null` \| `` `0x${string}` ``\>

Defined in: [packages/orbit-evm/src/utils/ensUtils.ts:57](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/orbit-evm/src/utils/ensUtils.ts#L57)

Fetches the Ethereum address associated with a given ENS name from the Ethereum Mainnet.

## Parameters

### name

`string`

The ENS name to resolve (e.g., 'vitalik.eth').

## Returns

`Promise`\<`null` \| `` `0x${string}` ``\>

The associated Ethereum address (lowercase) or null if not found.
