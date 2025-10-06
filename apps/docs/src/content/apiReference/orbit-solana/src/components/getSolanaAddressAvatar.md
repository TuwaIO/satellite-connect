[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# getSolanaAddressAvatar()

> **getSolanaAddressAvatar**(`name`): `Promise`\<`string`\>

Defined in: [packages/orbit-solana/src/utils/getSolanaAddressAvatar.ts:16](https://github.com/TuwaIO/satellite-connect/blob/a7efd7b6f4a16b941fa3073c735cb98b51734d0c/packages/orbit-solana/src/utils/getSolanaAddressAvatar.ts#L16)

Searches and returns the avatar URL (icon) for a given Solana account name (label)
among connected wallets. Includes caching for performance on repeated requests.

## Parameters

### name

`string`

The account name (label) to look up.

## Returns

`Promise`\<`string`\>

A promise that resolves to the account's icon URL, or the original name string if the icon is not found.
