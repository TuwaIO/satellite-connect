[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# unwrapUiWalletHandles()

> **unwrapUiWalletHandles**(`uiWallet`, `uiAccount`): `object`

Defined in: [packages/satellite-solana/src/utils/connectionUtils.ts:24](https://github.com/TuwaIO/satellite-connect/blob/90ad85d5eac112b83bb1ee0f100cd870087e5567/packages/satellite-solana/src/utils/connectionUtils.ts#L24)

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
