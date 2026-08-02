[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# connect()

> **connect**(`uiWallet`, `input?`): `Promise`\<\{ `accounts`: `UiWalletAccount`[]; `uiWallet`: `UiWallet`; \}\>

Defined in: [packages/satellite-solana/src/utils/connectionUtils.ts:38](https://github.com/TuwaIO/satellite-connect/blob/258cbb671232d38bb23e4151bf5ebf573dc2fd3b/packages/satellite-solana/src/utils/connectionUtils.ts#L38)

Establishes connection with a wallet using Wallet Standard

## Parameters

### uiWallet

`UiWallet`

Wallet instance implementing the UI Wallet interface

### input?

`Omit`\<`StandardConnectInput`, `"silent"`\>

Optional connection parameters (excluding silent flag)

## Returns

`Promise`\<\{ `accounts`: `UiWalletAccount`[]; `uiWallet`: `UiWallet`; \}\>

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
