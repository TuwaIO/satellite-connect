# connect()

> **connect**(`uiWallet`, `input?`): `Promise`\<\{ `accounts`: `UiWalletAccount`[]; `uiWallet`: `UiWallet`; \}\>

Defined in: [satellite-solana/src/utils/connectionUtils.ts:67](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/connectionUtils.ts#L67)

Connects a Wallet Standard wallet with its `standard:connect` feature. The wallet may show a prompt, unless
`input.silent` is `true`: then it returns only the accounts that already authorize the app, without a prompt.

## Parameters

### uiWallet

`UiWallet`

The wallet to connect.

### input?

`StandardConnectInput`

Options of `standard:connect`, such as `silent`.

## Returns

`Promise`\<\{ `accounts`: `UiWalletAccount`[]; `uiWallet`: `UiWallet`; \}\>

`uiWallet`: the current UI handle of the same wallet (a handle is a snapshot, and the new one lists the
connected accounts); `accounts`: UI handles of the accounts the wallet returned.

## Throws

A `WalletStandardError` when the wallet does not implement `standard:connect`, the wallet's error
when the user rejects (some wallets, such as Phantom, also reject a silent connect when the app is not authorized),
or `[SATELLITE-SOLANA] The wallet did not return any accounts.` (for example after a silent connect of a wallet that
does not authorize the app).

## Example

```ts
import { getAvailableSolanaConnectors } from '@tuwaio/orbit-solana';
import { connect } from '@tuwaio/satellite-solana';

const [wallet] = getAvailableSolanaConnectors();
if (wallet) {
  const { accounts } = await connect(wallet);
  console.log('Connected account:', accounts[0].address);
}
```
