[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# satelliteEVMAdapter()

> **satelliteEVMAdapter**(`config`): `SatelliteAdapter`

Defined in: [packages/satellite-evm/src/adapters/evmAdapter.ts:43](https://github.com/TuwaIO/satellite-connect/blob/5ea2bf35da638317e8edf885c3993433cb84e778/packages/satellite-evm/src/adapters/evmAdapter.ts#L43)

Creates an EVM-compatible adapter for Satellite

## Parameters

### config

`Config`

Wagmi configuration object containing chain and connector settings

## Returns

`SatelliteAdapter`

A configured SatelliteAdapter instance for EVM chains

## Remarks

This adapter implements the SatelliteAdapter interface for Ethereum Virtual Machine (EVM) compatible chains.
It uses wagmi as the underlying library for wallet connections and chain interactions.

## Throws

Error if config is not provided

## Example

```typescript
const config = createConfig({
  chains: [mainnet, polygon],
  connectors: [
    new InjectedConnector(),
    new WalletConnectConnector({ projectId: 'your_project_id' })
  ]
});

const evmAdapter = satelliteEVMAdapter(config);
```
