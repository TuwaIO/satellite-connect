# SolanaSignerTarget

Defined in: [satellite-solana/src/utils/signerUtils.ts:135](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/signerUtils.ts#L135)

The wallet and account that [createSolanaMessageSigner](/packages/satellite-solana/functions/createSolanaMessageSigner.md) signs with. Pass the Wallet Standard `Wallet` and
`WalletAccount` (see [unwrapUiWalletHandles](/packages/satellite-solana/functions/unwrapUiWalletHandles.md)) or a wallet adapter. When `wallet` or `account` is missing, the
target object itself is used in its place.

## Indexable

> \[`key`: `string`\]: `unknown`

Any other property; the target may be a wallet adapter itself.

## Properties

### account?

> `optional` **account?**: `unknown`

Defined in: [satellite-solana/src/utils/signerUtils.ts:137](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/signerUtils.ts#L137)

The account to sign with, passed to the wallet's `signMessage`.

***

### wallet?

> `optional` **wallet?**: `unknown`

Defined in: [satellite-solana/src/utils/signerUtils.ts:139](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/signerUtils.ts#L139)

The wallet that implements `solana:signMessage`, `signMessages` or `signMessage`.
