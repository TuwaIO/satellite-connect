[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# unwrapUiWalletHandles()

> **unwrapUiWalletHandles**(`uiWallet`, `uiAccount`): `object`

Defined in: [packages/satellite-solana/src/utils/connectionUtils.ts:24](https://github.com/TuwaIO/satellite-connect/blob/3f5b07315cb97c4319f66a4a3cf4b3c1646a1d35/packages/satellite-solana/src/utils/connectionUtils.ts#L24)

Extracts raw Wallet Standard objects from UI handles.
This is necessary to access actual feature implementations like signMessage.

## Parameters

### uiWallet

`UiWallet`

The UI wallet handle

### uiAccount

`UiWalletAccount`

The UI wallet account handle

## Returns

`object`

The raw underlying Wallet Standard objects, or the original handles if extraction fails

### account

> **account**: `WalletAccount` \| `UiWalletAccount`

### wallet

> **wallet**: `Wallet` \| `UiWallet`
