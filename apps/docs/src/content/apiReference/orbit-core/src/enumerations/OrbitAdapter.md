[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# OrbitAdapter

Defined in: [packages/orbit-core/src/types.ts:33](https://github.com/TuwaIO/satellite-connect/blob/80c744e48bd0282af533cb9ca520149d8c1f125d/packages/orbit-core/src/types.ts#L33)

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

Defined in: [packages/orbit-core/src/types.ts:43](https://github.com/TuwaIO/satellite-connect/blob/80c744e48bd0282af533cb9ca520149d8c1f125d/packages/orbit-core/src/types.ts#L43)

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

Defined in: [packages/orbit-core/src/types.ts:52](https://github.com/TuwaIO/satellite-connect/blob/80c744e48bd0282af533cb9ca520149d8c1f125d/packages/orbit-core/src/types.ts#L52)

For the Solana blockchain.
Supports:
- Solana Mainnet
- Devnet
- Testnet

***

### Starknet

> **Starknet**: `"starknet"`

Defined in: [packages/orbit-core/src/types.ts:61](https://github.com/TuwaIO/satellite-connect/blob/80c744e48bd0282af533cb9ca520149d8c1f125d/packages/orbit-core/src/types.ts#L61)

For the Starknet L2 network.
Supports:
- Starknet Mainnet
- Testnet (Goerli)
- Other Starknet deployments
