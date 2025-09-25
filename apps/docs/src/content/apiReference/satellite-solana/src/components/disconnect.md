[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# disconnect()

> **disconnect**(`uiWallet`): `Promise`\<`void`\>

Defined in: [packages/satellite-solana/src/utils/connectionUtils.ts:69](https://github.com/TuwaIO/satellite-connect/blob/8af5ba76f248b2d5386322999904d21ced4220f4/packages/satellite-solana/src/utils/connectionUtils.ts#L69)

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
