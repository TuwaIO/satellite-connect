[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# satelliteSolanaAdapter()

> **satelliteSolanaAdapter**(`rpcUrls`): `SatelliteAdapter`

Defined in: [packages/satellite-solana/src/adapters/solanaAdapter.ts:33](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-solana/src/adapters/solanaAdapter.ts#L33)

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
