[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# satelliteEVMAdapter()

> **satelliteEVMAdapter**(`config`, `chains`): `SatelliteAdapter`\<[`ConnectorEVM`](../type-aliases/ConnectorEVM.md), [`EVMConnection`](../interfaces/EVMConnection.md)\>

Defined in: [packages/satellite-evm/src/adapters/evmAdapter.ts:45](https://github.com/TuwaIO/satellite-connect/blob/6efff89526a9aa4efe6cb3f9d4d0db788f4cf062/packages/satellite-evm/src/adapters/evmAdapter.ts#L45)

Creates an EVM-compatible adapter for Satellite

## Parameters

### config

`Config`

Wagmi configuration object containing chain and connector settings

### chains

readonly \[`Chain`, `Chain`\]

The list of chains to use for ENS client creation and other interactions

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
