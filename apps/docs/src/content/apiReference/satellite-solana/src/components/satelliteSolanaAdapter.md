[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# satelliteSolanaAdapter()

> **satelliteSolanaAdapter**(`rpcUrls`): `SatelliteAdapter`\<`UiWallet`, [`SolanaConnection`](../interfaces/SolanaConnection.md)\>

Defined in: [packages/satellite-solana/src/adapters/solanaAdapter.ts:41](https://github.com/TuwaIO/satellite-connect/blob/c27b706a8178d18d1c483220d23a83a7ebe142a6/packages/satellite-solana/src/adapters/solanaAdapter.ts#L41)

Creates a Solana blockchain adapter for the Satellite Connect system

## Parameters

### rpcUrls

`SolanaRPCUrls`

Configuration object containing RPC endpoints for different Solana networks

## Returns

`SatelliteAdapter`\<`UiWallet`, [`SolanaConnection`](../interfaces/SolanaConnection.md)\>

SatelliteAdapter implementation for Solana

## Remarks

This adapter implements the SatelliteAdapter interface for Solana blockchain,
providing connector connection, network switching, and name resolution capabilities.
It uses the Wallet Standard for consistent interactions.

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
