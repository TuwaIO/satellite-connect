# satelliteEVMAdapter()

> **satelliteEVMAdapter**(`config`, `chains`): [`SatelliteAdapter`](/packages/satellite-core/type-aliases/SatelliteAdapter.md)\<[`ConnectorEVM`](/packages/satellite-evm/type-aliases/ConnectorEVM.md), [`EVMConnection`](/packages/satellite-evm/interfaces/EVMConnection.md)\>

Defined in: [satellite-evm/src/adapters/evmAdapter.ts:87](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/adapters/evmAdapter.ts#L87)

Creates the EVM adapter for the Satellite Connect store (`createSatelliteConnectStore` from `@tuwaio/satellite-core`
or `SatelliteConnectProvider` from `@tuwaio/satellite-react`). It implements `SatelliteAdapter` with `@wagmi/core`:
- `getConnectors` returns the connectors of `config`. A connector matches a `connectorType` such as `"evm:metamask"`
  through `formatConnectorName` from `@tuwaio/orbit-core` (for example, the `Safe` connector is `"evm:safe"`).
- `watchConnectors` calls `onChange` (with no arguments) on every change of the connectors of `config`, through
  wagmi's `watchConnectors`: when wagmi adds the installed EIP-6963 wallets while a config created with `ssr: true`
  is hydrated, when a wallet announces itself later, and when other code changes the connectors. It subscribes to the
  connectors store of `config` until the returned function is called.
- `connect` runs wagmi's `connect` with the requested chain and returns an [EVMConnection](/packages/satellite-evm/interfaces/EVMConnection.md): the account (the
  zero address if wagmi reports none), the chain (`1` if unknown), the first default RPC URL of the chain, the
  connector icon and a `signMessage` that signs with wagmi's `signMessage`. An injected wallet shows its connect
  prompt (wagmi requests `wallet_requestPermissions`, then `eth_requestAccounts`). A wallet that wagmi already holds
  in this page (an earlier store on the same config connected it, or `WagmiProvider` restored it) is taken over
  without a request: it becomes wagmi's current connection, and wagmi's `switchChain` asks it to move to the
  requested chain (when it declines, the connection stays on its chain).
- `reconnect` restores a wallet without a prompt, for `initializeAutoConnect`: a wallet that wagmi already holds in
  this page is taken over as by `connect`; otherwise, when the connector reports authorized accounts
  (`eth_accounts` for injected wallets), wagmi's `connect` runs with `isReconnecting`, so the connector reads those
  accounts instead of asking for them. It resolves to `undefined` when the wallet reports no accounts (locked, or the
  site was disconnected in the wallet). When the wallet is on another chain than the requested one, wagmi's
  `switchChain` asks it to switch; when it declines, the connection stays on its chain.
- `getLiveConnections` lists, as [EVMConnection](/packages/satellite-evm/interfaces/EVMConnection.md) objects, the live wagmi connections that this adapter object
  opened or took over (with `connect` or `reconnect`) and has not disconnected. The record of their connectors lives
  in memory, in the adapter object. Connections that other code opened or restored on the same config (for example
  `WagmiProvider`, or a store with another adapter object) are not listed.
- `disconnect` disconnects the given connection with wagmi's `disconnect`. Without a connection (or with one that is
  not connected), it disconnects only the live connections of `getLiveConnections` (of that connection's connector
  type), never a connector without a connection or a connection opened by other code: wagmi's injected connector
  sends `wallet_revokePermissions` on every disconnect, and wallets such as MetaMask revoke the site's permission for
  every tab of the origin. Two stores on one wagmi config with their own adapter objects do not close each other's
  wallets this way (a wallet both of them connected is still one wagmi connection).
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
