[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getSolanaName()

> **getSolanaName**(`rpcUrl`, `address`): `Promise`\<`null` \| `string`\>

Defined in: [packages/orbit-solana/src/utils/snsUtils.ts:41](https://github.com/TuwaIO/satellite-connect/blob/b81ca5cd9ff4ba89081ddbf83cf1417d89a09170/packages/orbit-solana/src/utils/snsUtils.ts#L41)

Performs a reverse lookup to find the .sol domain name for a given wallet address.
Results are cached to avoid redundant network requests.

## Parameters

### rpcUrl

`string`

The RPC endpoint URL.

### address

`string`

The public key of the wallet as a string.

## Returns

`Promise`\<`null` \| `string`\>

The .sol domain name (e.g., "bonfida.sol") or null if not found.
