[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# satelliteEVMAdapter()

> **satelliteEVMAdapter**(`config`, `signInWithSiwe?`): `SatelliteAdapter`\<[`ConnectorEVM`](../type-aliases/ConnectorEVM.md), [`EVMConnection`](../interfaces/EVMConnection.md)\>

Defined in: [packages/satellite-evm/src/adapters/evmAdapter.ts:42](https://github.com/TuwaIO/satellite-connect/blob/3d522c1bbd9feb7d860ee1da50c84040c29aadab/packages/satellite-evm/src/adapters/evmAdapter.ts#L42)

Creates an EVM-compatible adapter for Satellite

## Parameters

### config

`Config`

Wagmi configuration object containing chain and connector settings

### signInWithSiwe?

() => `Promise`\<`void`\>

Optional function for signing in with SIWE

## Returns

`SatelliteAdapter`\<[`ConnectorEVM`](../type-aliases/ConnectorEVM.md), [`EVMConnection`](../interfaces/EVMConnection.md)\>

A configured SatelliteAdapter instance for EVM chains

## Remarks

This adapter implements the SatelliteAdapter interface for Ethereum Virtual Machine (EVM) compatible chains.
It uses wagmi as the underlying library for connector connections and chain interactions.

## Throws

Error if config is not provided

## Example

```typescript
const config = createConfig({
  chains: [mainnet, polygon],
  connectors: [injected()]
});

const evmAdapter = satelliteEVMAdapter(config);
```
