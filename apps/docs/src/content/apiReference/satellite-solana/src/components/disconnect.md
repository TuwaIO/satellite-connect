[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# disconnect()

> **disconnect**(`uiWallet`): `Promise`\<`void`\>

Defined in: [packages/satellite-solana/src/utils/connectionUtils.ts:97](https://github.com/TuwaIO/satellite-connect/blob/f4dd3c589ab3d4fae68f1fa76b66bf3119d7f69f/packages/satellite-solana/src/utils/connectionUtils.ts#L97)

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
