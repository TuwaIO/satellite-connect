[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# disconnect()

> **disconnect**(`uiWallet`): `Promise`\<`void`\>

Defined in: [packages/satellite-solana/src/utils/connectionUtils.ts:74](https://github.com/TuwaIO/satellite-connect/blob/007ac190704e936cd998ed8563488109592839df/packages/satellite-solana/src/utils/connectionUtils.ts#L74)

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
