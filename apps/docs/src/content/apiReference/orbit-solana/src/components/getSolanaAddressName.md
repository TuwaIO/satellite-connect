[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getSolanaAddressName()

> **getSolanaAddressName**(`address`): `Promise`\<`string`\>

Defined in: [packages/orbit-solana/src/utils/getSolanaAddressName.ts:16](https://github.com/TuwaIO/satellite-connect/blob/a751bf7909b1d5dc4468eac1be6a109ddcd81c6e/packages/orbit-solana/src/utils/getSolanaAddressName.ts#L16)

Searches and returns the account name (label) for a given Solana address
among connected wallets. Includes caching for performance on repeated requests.

## Parameters

### address

`string`

The Solana account address to look up.

## Returns

`Promise`\<`string`\>

A promise that resolves to the account's name/label, or the original address string if the name is not found.
