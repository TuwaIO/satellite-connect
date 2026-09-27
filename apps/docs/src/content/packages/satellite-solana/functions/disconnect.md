# disconnect()

> **disconnect**(`uiWallet`): `Promise`\<`void`\>

Defined in: [satellite-solana/src/utils/connectionUtils.ts:95](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/connectionUtils.ts#L95)

Disconnects a Wallet Standard wallet with its `standard:disconnect` feature.

## Parameters

### uiWallet

`UiWallet`

The wallet to disconnect.

## Returns

`Promise`\<`void`\>

Resolves when the wallet has disconnected.

## Throws

A `WalletStandardError` when the wallet does not implement `standard:disconnect` (the wallets of
`getAvailableSolanaConnectors` from `@tuwaio/orbit-solana` always do), or the wallet's error.
