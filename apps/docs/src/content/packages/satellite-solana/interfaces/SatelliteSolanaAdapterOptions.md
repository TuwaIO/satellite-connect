# SatelliteSolanaAdapterOptions

Defined in: [satellite-solana/src/adapters/solanaAdapter.ts:26](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/adapters/solanaAdapter.ts#L26)

Options of [satelliteSolanaAdapter](/packages/satellite-solana/functions/satelliteSolanaAdapter.md): the RPC URLs, and the SNS lookups of `getName` and `getAvatar`, each off
by default.

## Extends

- `SolanaRPCUrls`

## Properties

### snsAvatar?

> `optional` **snsAvatar?**: `boolean`

Defined in: [satellite-solana/src/adapters/solanaAdapter.ts:36](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/adapters/solanaAdapter.ts#L36)

Let `getAvatar` ask the Bonfida SNS image API (`image-api.bonfida.com`) for the picture of a `.sol` domain, which
the request carries. Off by default, and then every avatar is an identicon drawn here.

***

### snsName?

> `optional` **snsName?**: `boolean`

Defined in: [satellite-solana/src/adapters/solanaAdapter.ts:31](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/adapters/solanaAdapter.ts#L31)

Let `getName` ask the Bonfida SNS API (`sns-api.bonfida.com`) for the favorite `.sol` domain of an address, which
the request carries. Off by default, and then `getName` returns the address.
