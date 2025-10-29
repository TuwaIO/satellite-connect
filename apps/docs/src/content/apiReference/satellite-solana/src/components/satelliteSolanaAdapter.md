[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# satelliteSolanaAdapter()

> **satelliteSolanaAdapter**(`rpcUrls`): `SatelliteAdapter`\<`UiWallet`, [`SolanaWallet`](../interfaces/SolanaWallet.md)\>

Defined in: [packages/satellite-solana/src/adapters/solanaAdapter.ts:41](https://github.com/TuwaIO/satellite-connect/blob/862e1f7f7a0d3bec8f4708754109774c705e3721/packages/satellite-solana/src/adapters/solanaAdapter.ts#L41)

Creates a Solana blockchain adapter for the Satellite Connect system

## Parameters

### rpcUrls

`SolanaRPCUrls`

Configuration object containing RPC endpoints for different Solana networks

## Returns

`SatelliteAdapter`\<`UiWallet`, [`SolanaWallet`](../interfaces/SolanaWallet.md)\>

SatelliteAdapter implementation for Solana

## Remarks

This adapter implements the SatelliteAdapter interface for Solana blockchain,
providing wallet connection, network switching, and name resolution capabilities.
It uses the Wallet Standard for consistent wallet interactions.

## Example

```typescript
const solanaAdapter = satelliteSolanaAdapter({
  rpcUrls: {
    mainnet: 'https://api.mainnet-beta.solana.com',
    devnet: 'https://api.devnet.solana.com',
    testnet: 'https://api.testnet.solana.com'
  }
});
```
