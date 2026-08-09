[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# satelliteSolanaAdapter()

> **satelliteSolanaAdapter**(`rpcUrls`): `SatelliteAdapter`\<`UiWallet`, [`SolanaConnection`](../interfaces/SolanaConnection.md)\>

Defined in: [packages/satellite-solana/src/adapters/solanaAdapter.ts:42](https://github.com/TuwaIO/satellite-connect/blob/a9c59d21dd2d9973e0bf3f8de40c612adc6daaeb/packages/satellite-solana/src/adapters/solanaAdapter.ts#L42)

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
