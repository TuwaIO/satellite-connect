[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# connect()

> **connect**(`uiWallet`, `input?`): `Promise`\<readonly `UiWalletAccount`[]\>

Defined in: [packages/satellite-solana/src/utils/connectionUtils.ts:37](https://github.com/TuwaIO/satellite-connect/blob/7306d7013efe34c392eb892c12ce60d37c9368d9/packages/satellite-solana/src/utils/connectionUtils.ts#L37)

Establishes connection with a wallet using Wallet Standard

## Parameters

### uiWallet

`UiWallet`

Wallet instance implementing the UI Wallet interface

### input?

`Omit`\<`StandardConnectInput`, `"silent"`\>

Optional connection parameters (excluding silent flag)

## Returns

`Promise`\<readonly `UiWalletAccount`[]\>

Promise resolving to array of connected wallet accounts

## Remarks

Connects to a wallet that implements the Wallet Standard interface.
Uses the StandardConnect feature to establish connection and retrieve accounts.
Converts standard wallet accounts to UI wallet accounts.

## Throws

If wallet doesn't support StandardConnect feature

## Throws

If connection attempt fails

## Example

```typescript
const accounts = await connect(wallet, {
  // Optional connection parameters
});
const firstAccount = accounts[0];
console.log('Connected account:', firstAccount.address);
```
