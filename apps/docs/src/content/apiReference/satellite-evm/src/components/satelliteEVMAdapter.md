[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# satelliteEVMAdapter()

> **satelliteEVMAdapter**(`config`, `chains`, `signInWithSiwe?`): `SatelliteAdapter`\<[`ConnectorEVM`](../type-aliases/ConnectorEVM.md), [`EVMConnection`](../interfaces/EVMConnection.md)\>

Defined in: [packages/satellite-evm/src/adapters/evmAdapter.ts:44](https://github.com/TuwaIO/satellite-connect/blob/4dc5e53b7865b93ff739877e5e76169fb4e1bfaa/packages/satellite-evm/src/adapters/evmAdapter.ts#L44)

Creates an EVM-compatible adapter for Satellite

## Parameters

### config

`Config`

Wagmi configuration object containing chain and connector settings

### chains

readonly \[`Chain`, `Chain`\]

The list of chains to use for ENS client creation and other interactions

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

const chains = [mainnet, polygon];
const evmAdapter = satelliteEVMAdapter(config, chains);
```
