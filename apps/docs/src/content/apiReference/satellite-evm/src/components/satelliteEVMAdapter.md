[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# satelliteEVMAdapter()

> **satelliteEVMAdapter**(`config`, `signInWithSiwe?`): `SatelliteAdapter`\<[`ConnectorEVM`](../type-aliases/ConnectorEVM.md)\>

Defined in: [packages/satellite-evm/src/adapters/evmAdapter.ts:36](https://github.com/TuwaIO/satellite-connect/blob/2d3a9189753a5b1939efba1c2df0a10f91a88d0f/packages/satellite-evm/src/adapters/evmAdapter.ts#L36)

Creates an EVM-compatible adapter for Satellite

## Parameters

### config

`Config`

Wagmi configuration object containing chain and connector settings

### signInWithSiwe?

() => `Promise`\<`void`\>

Optional function for signing in with SIWE

## Returns

`SatelliteAdapter`\<[`ConnectorEVM`](../type-aliases/ConnectorEVM.md)\>

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
