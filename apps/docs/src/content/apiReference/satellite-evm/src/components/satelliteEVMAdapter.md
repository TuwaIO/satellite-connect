[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# satelliteEVMAdapter()

> **satelliteEVMAdapter**(`config`, `chains`): `SatelliteAdapter`\<[`ConnectorEVM`](../type-aliases/ConnectorEVM.md), [`EVMConnection`](../interfaces/EVMConnection.md)\>

Defined in: [packages/satellite-evm/src/adapters/evmAdapter.ts:45](https://github.com/TuwaIO/satellite-connect/blob/471b799ec718c8b01877f1f886081d2f499b024b/packages/satellite-evm/src/adapters/evmAdapter.ts#L45)

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
