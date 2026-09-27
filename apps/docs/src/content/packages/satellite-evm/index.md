# @tuwaio/satellite-evm

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/satellite-evm.svg)](https://www.npmjs.com/package/@tuwaio/satellite-evm)
[![License](https://img.shields.io/npm/l/@tuwaio/satellite-evm.svg)](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/LICENSE)

`@tuwaio/satellite-evm` is the EVM Layer 4 (L4) package of **Satellite Connect**, the wallet connection project of TUWA Stage 2 ("State & Connection", next to Pulsar). Built on **`@wagmi/core`**, **`viem`** and **`@tuwaio/orbit-evm`**, it provides the EVM adapter for [`@tuwaio/satellite-core`](https://satellite.docs.tuwa.io/packages/satellite-core), a watcher that keeps the store in sync with wagmi, and helpers for your wagmi config: default transports, Safe connector options and a connector that impersonates any address for testing. It does not use `ethers.js` or `web3.js`.

---

## 🏛️ Core Capabilities

- **Adapter:** `satelliteEVMAdapter(wagmiConfig, chains)` connects the connectors of your wagmi config (injected wallets found through EIP-6963, WalletConnect, Safe, Coinbase…) by connector type, such as `"evm:metamask"`. It asks the wallet to switch chains, reads native balances, builds block explorer links (`undefined` when the chain has no explorer), resolves ENS names and avatars on Ethereum Mainnet, and checks whether the account is a smart contract.
- **Watcher:** `createEVMConnectionsWatcher` subscribes to wagmi's `watchConnections` and copies account and chain changes made in the wallet into the store; it disconnects the store when the wallet disconnects. With a SIWX session it also disconnects when the sign-in is rejected or fails, or when the wallet switches to another account or chain than the session. Pass the store's `getState`, and the watcher reads the current state on every event. React apps use `EVMConnectorsWatcher` from [`@tuwaio/satellite-react/evm`](https://satellite.docs.tuwa.io/packages/satellite-react) instead.
- **Contract accounts:** `checkIsWalletAddressContract` reads the account's code on the requested chain and caches the result in memory per chain and address.
- **wagmi config helpers:** `createDefaultTransports(chains)` creates an `http()` transport for every chain; `safeSdkOptions` are the options for the `safe` connector of `@wagmi/connectors`, with anchored Safe{Wallet} origins; `impersonated()` is a development connector that acts as a wallet for the address saved in `localStorage` and forwards requests to your node.

---

## 💾 Installation

```bash
pnpm add @tuwaio/satellite-evm @tuwaio/satellite-core @tuwaio/orbit-core @tuwaio/orbit-evm @wagmi/core viem zustand immer
```

> [!IMPORTANT]
> `@tuwaio/satellite-core` (>=0.5), `@tuwaio/orbit-core` (>=0.3), `@tuwaio/orbit-evm` (>=0.3), `@wagmi/core` (3.x) and `viem` (2.x) are peer dependencies and must be installed alongside `@tuwaio/satellite-evm`. `zustand` and `immer` are the peer dependencies of `@tuwaio/satellite-core`. Add `@wagmi/connectors` if you use the `safe`, `walletConnect` or `coinbaseWallet` connectors.

---

## 🚀 Usage

```typescript
import { createDefaultTransports, impersonated, safeSdkOptions, satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { safe } from '@wagmi/connectors';
import { createConfig, injected } from '@wagmi/core';
import { mainnet, sepolia } from 'viem/chains';

export const appChains = [mainnet, sepolia] as const;

export const wagmiConfig = createConfig({
  chains: appChains,
  connectors: [injected(), safe({ ...safeSdkOptions }), impersonated({})],
  transports: createDefaultTransports(appChains), // public RPC URLs: pass your own http(url) transports in production
  ssr: true,
});

export const evmAdapter = satelliteEVMAdapter(wagmiConfig, appChains);
```

Pass `evmAdapter` to `createSatelliteConnectStore` from [`@tuwaio/satellite-core`](https://satellite.docs.tuwa.io/packages/satellite-core) or to `SatelliteConnectProvider` from [`@tuwaio/satellite-react`](https://satellite.docs.tuwa.io/packages/satellite-react), and run the watcher next to it. The complete React setup is on the **[`@tuwaio/satellite-react`](https://satellite.docs.tuwa.io/packages/satellite-react)** page; the watcher without React is shown on the **[`createEVMConnectionsWatcher`](https://satellite.docs.tuwa.io/packages/satellite-evm/functions/createEVMConnectionsWatcher)** page.

---

## 🗄️ Browser Storage

The package writes nothing to `localStorage`. The `impersonated` connector reads `satellite-connect:impersonatedAddress` (set with `impersonatedHelpers.setImpersonated` from `@tuwaio/orbit-core`, for example by Nova Connect) on every request; `@tuwaio/satellite-core` removes the key on `disconnectAll` and when the last connection is disconnected. The keys that the store writes for EVM connections are listed on the [`@tuwaio/satellite-core`](https://satellite.docs.tuwa.io/packages/satellite-core) page. wagmi keeps its own state in the `storage` of your wagmi config.

---

## 🌐 External Services

| Helper                                               | Host                                                                                                                          | Purpose                                                              |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Adapter `getBalance`, `checkIsWalletAddressContract` | The wagmi transport of the chain                                                                                              | `eth_getBalance`, `eth_getCode`                                      |
| Adapter `getName`, `getAvatar`, `getAddress`         | The default RPC URL of `mainnet` in your `chains` (viem's `mainnet` definition when it is missing), not your wagmi transports | ENS resolution on Ethereum Mainnet                                   |
| Adapter `getAvatar`                                  | The URL in the ENS `avatar` record, `ipfs.io` or `arweave.net` for IPFS and Arweave avatars                                   | Avatar metadata (viem's `getEnsAvatar`)                              |
| `createDefaultTransports`                            | The default RPC URL of each chain definition                                                                                  | Every RPC request of the wagmi config                                |
| `impersonated`                                       | The default RPC URL of the chain                                                                                              | Every request except accounts and chain switching, including signing |

The default RPC URLs of the chain definitions are public and rate-limited. Explorer links point to the `blockExplorers` of the chain definitions and are not requested by the package.

---

## 📚 API Reference

Every export, with signatures and types generated from the source, is documented at **[satellite.docs.tuwa.io/packages/satellite-evm](https://satellite.docs.tuwa.io/packages/satellite-evm)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/LICENSE) file for details.

## Interfaces

- [EVMConnection](/packages/satellite-evm/interfaces/EVMConnection.md)
- [EVMWatcherCallbacks](/packages/satellite-evm/interfaces/EVMWatcherCallbacks.md)
- [EVMWatcherConfig](/packages/satellite-evm/interfaces/EVMWatcherConfig.md)

## Type Aliases

- [ConnectorEVM](/packages/satellite-evm/type-aliases/ConnectorEVM.md)
- [ImpersonatedParameters](/packages/satellite-evm/type-aliases/ImpersonatedParameters.md)

## Variables

- [safeSdkOptions](/packages/satellite-evm/variables/safeSdkOptions.md)

## Functions

- [checkIsWalletAddressContract](/packages/satellite-evm/functions/checkIsWalletAddressContract.md)
- [createDefaultTransports](/packages/satellite-evm/functions/createDefaultTransports.md)
- [createEVMConnectionsWatcher](/packages/satellite-evm/functions/createEVMConnectionsWatcher.md)
- [impersonated](/packages/satellite-evm/functions/impersonated.md)
- [satelliteEVMAdapter](/packages/satellite-evm/functions/satelliteEVMAdapter.md)
