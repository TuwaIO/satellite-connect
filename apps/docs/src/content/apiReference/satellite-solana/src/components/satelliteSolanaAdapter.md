[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# satelliteSolanaAdapter()

> **satelliteSolanaAdapter**(`rpcUrls`): `SatelliteAdapter`\<`UiWallet`, [`SolanaConnection`](../interfaces/SolanaConnection.md)\>

Defined in: [packages/satellite-solana/src/adapters/solanaAdapter.ts:43](https://github.com/TuwaIO/satellite-connect/blob/2c21a9769a545a040d3a9c69ab8d5776bece2752/packages/satellite-solana/src/adapters/solanaAdapter.ts#L43)

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
