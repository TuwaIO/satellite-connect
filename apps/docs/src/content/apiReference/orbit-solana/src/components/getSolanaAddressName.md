[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getSolanaAddressName()

> **getSolanaAddressName**(`address`): `Promise`\<`string`\>

Defined in: [packages/orbit-solana/src/utils/getSolanaAddressName.ts:17](https://github.com/TuwaIO/satellite-connect/blob/330d436180fd8c24c21d7c546c36112e47df500b/packages/orbit-solana/src/utils/getSolanaAddressName.ts#L17)

Searches and returns the account name (label) for a given Solana address
among connected wallets. Includes caching for performance on repeated requests.

## Parameters

### address

`string`

The Solana account address to look up.

## Returns

`Promise`\<`string`\>

A promise that resolves to the account's name/label, or the original address string if the name is not found.
