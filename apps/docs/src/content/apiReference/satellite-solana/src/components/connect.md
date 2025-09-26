[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# connect()

> **connect**(`uiWallet`, `input?`): `Promise`\<readonly `UiWalletAccount`[]\>

Defined in: [packages/satellite-solana/src/utils/connectionUtils.ts:37](https://github.com/TuwaIO/satellite-connect/blob/d5f27c9ecfc7c137261f9e98cbe815c1fb13b3f0/packages/satellite-solana/src/utils/connectionUtils.ts#L37)

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
