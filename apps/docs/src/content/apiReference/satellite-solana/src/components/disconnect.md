[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# disconnect()

> **disconnect**(`uiWallet`): `Promise`\<`void`\>

Defined in: [packages/satellite-solana/src/utils/connectionUtils.ts:69](https://github.com/TuwaIO/satellite-connect/blob/ab2889dc16e93ed4e3266b0857ac4dc0998ff86f/packages/satellite-solana/src/utils/connectionUtils.ts#L69)

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
