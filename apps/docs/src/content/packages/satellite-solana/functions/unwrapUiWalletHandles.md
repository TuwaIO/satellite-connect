# unwrapUiWalletHandles()

> **unwrapUiWalletHandles**(`uiWallet`, `uiAccount`): `object`

Defined in: [satellite-solana/src/utils/connectionUtils.ts:24](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/connectionUtils.ts#L24)

Returns the Wallet Standard `Wallet` and `WalletAccount` behind UI handles, which carry the feature implementations
(for example `solana:signMessage`). Uses the registry of `@wallet-standard/ui-registry`.

## Parameters

### uiWallet

`UiWallet`

The UI wallet handle.

### uiAccount

`UiWalletAccount`

The UI account handle.

## Returns

The underlying wallet and account, or the handles themselves when they are not registered.

### account

> **account**: `WalletAccount` \| `UiWalletAccount`

The Wallet Standard account, or `uiAccount` when it is not registered.

### wallet

> **wallet**: `Wallet` \| `UiWallet`

The Wallet Standard wallet, or `uiWallet` when it is not registered.
