[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# OrbitAdapter

Defined in: [packages/orbit-core/src/types.ts:45](https://github.com/TuwaIO/satellite-connect/blob/f8f5982b4939a6a74eb2eb686216730e40bd72ef/packages/orbit-core/src/types.ts#L45)

Defines the supported blockchain adapters in the Orbit system.
Each adapter corresponds to a specific blockchain architecture and implements
the necessary interfaces for that chain's functionality.

## Example

```typescript
// Using adapter types in configuration
const config = {
  chainType: OrbitAdapter.EVM,
  // other configuration...
};

// Checking adapter compatibility
if (chainType === OrbitAdapter.SOLANA) {
  // Solana-specific logic
}
```

## Enumeration Members

### EVM

> **EVM**: `"evm"`

Defined in: [packages/orbit-core/src/types.ts:55](https://github.com/TuwaIO/satellite-connect/blob/f8f5982b4939a6a74eb2eb686216730e40bd72ef/packages/orbit-core/src/types.ts#L55)

For Ethereum Virtual Machine (EVM) compatible chains.
Supports networks like:
- Ethereum Mainnet
- Polygon
- Binance Smart Chain
- Avalanche
- Other EVM-compatible L1/L2 chains

***

### SOLANA

> **SOLANA**: `"solana"`

Defined in: [packages/orbit-core/src/types.ts:64](https://github.com/TuwaIO/satellite-connect/blob/f8f5982b4939a6a74eb2eb686216730e40bd72ef/packages/orbit-core/src/types.ts#L64)

For the Solana blockchain.
Supports:
- Solana Mainnet
- Devnet
- Testnet

***

### Starknet

> **Starknet**: `"starknet"`

Defined in: [packages/orbit-core/src/types.ts:73](https://github.com/TuwaIO/satellite-connect/blob/f8f5982b4939a6a74eb2eb686216730e40bd72ef/packages/orbit-core/src/types.ts#L73)

For the Starknet L2 network.
Supports:
- Starknet Mainnet
- Testnet (Goerli)
- Other Starknet deployments
