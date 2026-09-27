# connect()

> **connect**(`uiWallet`, `input?`): `Promise`\<\{ `accounts`: `UiWalletAccount`[]; `uiWallet`: `UiWallet`; \}\>

Defined in: [satellite-solana/src/utils/connectionUtils.ts:64](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/connectionUtils.ts#L64)

Connects a Wallet Standard wallet with its `standard:connect` feature. The wallet may show a prompt.

## Parameters

### uiWallet

`UiWallet`

The wallet to connect.

### input?

`Omit`\<`StandardConnectInput`, `"silent"`\>

Options of `standard:connect`, without `silent`.

## Returns

`Promise`\<\{ `accounts`: `UiWalletAccount`[]; `uiWallet`: `UiWallet`; \}\>

`uiWallet`: the current UI handle of the same wallet (a handle is a snapshot, and the new one lists the
connected accounts); `accounts`: UI handles of the accounts the wallet returned.

## Throws

A `WalletStandardError` when the wallet does not implement `standard:connect`, the wallet's error
when the user rejects, or `[SATELLITE-SOLANA] The wallet did not return any accounts.`

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
