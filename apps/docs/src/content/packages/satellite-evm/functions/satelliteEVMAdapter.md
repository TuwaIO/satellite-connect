# satelliteEVMAdapter()

> **satelliteEVMAdapter**(`config`, `chains`): [`SatelliteAdapter`](/packages/satellite-core/type-aliases/SatelliteAdapter.md)\<[`ConnectorEVM`](/packages/satellite-evm/type-aliases/ConnectorEVM.md), [`EVMConnection`](/packages/satellite-evm/interfaces/EVMConnection.md)\>

Defined in: [satellite-evm/src/adapters/evmAdapter.ts:62](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/adapters/evmAdapter.ts#L62)

Creates the EVM adapter for the Satellite Connect store (`createSatelliteConnectStore` from `@tuwaio/satellite-core`
or `SatelliteConnectProvider` from `@tuwaio/satellite-react`). It implements `SatelliteAdapter` with `@wagmi/core`:
- `getConnectors` returns the connectors of `config`. A connector matches a `connectorType` such as `"evm:metamask"`
  through `formatConnectorName` from `@tuwaio/orbit-core` (for example, the `Safe` connector is `"evm:safe"`).
- `connect` runs wagmi's `connect` with the requested chain and returns an [EVMConnection](/packages/satellite-evm/interfaces/EVMConnection.md): the account (the
  zero address if wagmi reports none), the chain (`1` if unknown), the first default RPC URL of the chain, the
  connector icon and a `signMessage` that signs with wagmi's `signMessage`.
- `disconnect` disconnects the given connection, or every connector of `config`.
- `checkAndSwitchNetwork` asks the wallet to switch chains with `checkAndSwitchChain` from `@tuwaio/orbit-evm`.
- `getBalance` reads the native balance through the wagmi transports and formats it with the chain's decimals.
- `getExplorerUrl(url?, chainId?)` joins `url` to the block explorer of `chainId` (looked up in `chains`, then in
  `config`), or of the connected chain when `chainId` is omitted. It returns `undefined` when the chain has no
  explorer.
- `getName`, `getAvatar` and `getAddress` resolve ENS names on Ethereum Mainnet with `@tuwaio/orbit-evm`, which
  caches the results in memory.
- `checkIsContractAddress` is [checkIsWalletAddressContract](/packages/satellite-evm/functions/checkIsWalletAddressContract.md); `getSafeConnectorChainId` returns the chain of
  the `Safe` connector; `switchConnection` runs wagmi's `switchConnection`.

## Parameters

### config

`Config`

The wagmi config of the app.

### chains

readonly \[`Chain`, `Chain`\]

The app chains. ENS lookups use the Ethereum Mainnet entry of this list (its default RPC URL), or
viem's `mainnet` when it is missing.

## Returns

[`SatelliteAdapter`](/packages/satellite-core/type-aliases/SatelliteAdapter.md)\<[`ConnectorEVM`](/packages/satellite-evm/type-aliases/ConnectorEVM.md), [`EVMConnection`](/packages/satellite-evm/interfaces/EVMConnection.md)\>

The EVM adapter.

## Throws

`Satellite EVM adapter requires a wagmi config object.` when `config` is missing.

## Example

```ts
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { createConfig, http, injected } from '@wagmi/core';
import { mainnet, sepolia } from 'viem/chains';

const chains = [mainnet, sepolia] as const;
const wagmiConfig = createConfig({
  chains,
  connectors: [injected()],
  transports: { [mainnet.id]: http(), [sepolia.id]: http() },
});

export const evmAdapter = satelliteEVMAdapter(wagmiConfig, chains);
```
