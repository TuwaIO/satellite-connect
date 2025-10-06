[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# setChainId()

> **setChainId**(`chainId`): `string` \| `number`

Defined in: [packages/orbit-core/src/utils/сhainHelpers.ts:21](https://github.com/TuwaIO/satellite-connect/blob/19c1978f86b646632c45c0cd954d6819ec442178/packages/orbit-core/src/utils/сhainHelpers.ts#L21)

Sets the chain ID to a Solana-specific format if the chain is a Solana network.

## Parameters

### chainId

The original chain ID or name.

`string` | `number`

## Returns

`string` \| `number`

- The formatted chain ID prefixed with 'solana:' if Solana, otherwise the original.
