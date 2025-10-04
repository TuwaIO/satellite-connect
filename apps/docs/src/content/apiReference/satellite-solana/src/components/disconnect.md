[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# disconnect()

> **disconnect**(`uiWallet`): `Promise`\<`void`\>

Defined in: [packages/satellite-solana/src/utils/connectionUtils.ts:69](https://github.com/TuwaIO/satellite-connect/blob/b5a5df814a87c8fe0a316d5477bd4d7f974c2f09/packages/satellite-solana/src/utils/connectionUtils.ts#L69)

Disconnects from a connected wallet

## Parameters

### uiWallet

`UiWallet`

Wallet instance implementing the UI Wallet interface

## Returns

`Promise`\<`void`\>

Promise that resolves when disconnection is complete

## Remarks

Safely disconnects from a wallet if it supports the StandardDisconnect feature.
If the wallet doesn't support disconnection, the operation is silently ignored.

## Example

```typescript
await disconnect(wallet);
console.log('Wallet disconnected');
```
