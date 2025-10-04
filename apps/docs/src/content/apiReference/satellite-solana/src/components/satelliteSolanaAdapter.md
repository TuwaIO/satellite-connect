[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# satelliteSolanaAdapter()

> **satelliteSolanaAdapter**(`rpcUrls`): `SatelliteAdapter`

Defined in: [packages/satellite-solana/src/adapters/solanaAdapter.ts:39](https://github.com/TuwaIO/satellite-connect/blob/b5a5df814a87c8fe0a316d5477bd4d7f974c2f09/packages/satellite-solana/src/adapters/solanaAdapter.ts#L39)

Creates a Solana blockchain adapter for the Satellite Connect system

## Parameters

### rpcUrls

`SolanaRPCUrls`

Configuration object containing RPC endpoints for different Solana networks

## Returns

`SatelliteAdapter`

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
