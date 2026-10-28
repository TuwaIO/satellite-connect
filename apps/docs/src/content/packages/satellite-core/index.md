# @tuwaio/satellite-core

`@tuwaio/satellite-core` is the Layer 3 (L3) core package of **Satellite Connect**, the wallet connection project of TUWA Stage 2 ("State & Connection", next to Pulsar). Built on **`zustand`** (a vanilla store), **`immer`** and **`@tuwaio/orbit-core`**, it keeps the wallet connections of an app in one store: which wallets are connected, which one is active, and the errors of the last connect or network switch. It has no chain logic, UI or network requests of its own: the chain adapters are [`@tuwaio/satellite-evm`](https://satellite.docs.tuwa.io/packages/satellite-evm) and [`@tuwaio/satellite-solana`](https://satellite.docs.tuwa.io/packages/satellite-solana), and the React bindings are [`@tuwaio/satellite-react`](https://satellite.docs.tuwa.io/packages/satellite-react).

---

## 🏛️ Core Capabilities

- **Connection store:** `createSatelliteConnectStore` returns a vanilla Zustand store with `connect`, `disconnect`, `disconnectAll`, `switchConnection`, `switchNetwork` and `updateActiveConnection`. `connect`, `disconnect`, `switchConnection` and `switchNetwork` never reject: failures are stored in `connectionError` and `switchNetworkError` as `{ message, raw }` objects (`normalizeError` from `@tuwaio/orbit-core`) or logged.
- **Several wallets at once:** `connections` holds every connected wallet by connector type (`"evm:metamask"`, `"solana:phantom"`), and `activeConnection` is the one in use. Connecting a wallet that is already connected only makes it active; disconnecting the active wallet activates the next one.
- **Chain adapters:** pass one adapter or an array, one per chain family. Each connector type goes to the adapter of its prefix (`evm`, `solana`); without one, `connect` stores an error and calls no adapter. Adapters implement the `SatelliteAdapter` contract, so other chains can be added.
- **Wallet lists that follow the wallets:** `getConnectors` lists the wallets the adapters can connect now. `watchConnectors` tells a list that is on screen, such as a connect modal, when wallets were added or removed, for example the installed EIP-6963 wallets that wagmi adds after it hydrates a config created with `ssr: true`. It follows the adapters that implement the optional `watchConnectors` of `SatelliteAdapter` (the EVM adapter does), subscribes to them only in the browser and only while it has subscribers, and moves the subscription when `updateParameters` replaces the adapters.
- **Auto-connect:** `initializeAutoConnect` restores the last active wallet after a page load, in the chain it was saved with and without a prompt (through the adapter's `reconnect`), except wallets that need a user action to connect (WalletConnect, Coinbase and Base Account, Bitget, the impersonated wallet) and wallets of a chain family without an adapter. Only that wallet comes back: the other wallets of the last session stay authorized in their extensions, and the user connects them again by picking them (the adapter's `connect` may show the wallet's prompt, such as MetaMask's account picker). It waits up to 1.5 s for the last wallet to register; a wallet that is no longer installed is skipped without an error and forgotten as the last connection (it stays among the recent wallets), and a wallet that no longer authorizes the site (locked, or the site was disconnected in the wallet) is skipped without a prompt. Inside Safe{Wallet} it restores the Safe connector instead, with or without auto-connect: the app counts as running inside Safe{Wallet} when it is in an HTTPS iframe and the Safe connector of the EVM adapter gets the Safe's chain from the parent window. `isAutoConnectFinished` turns `true` when it is done, so UIs can tell a wallet that is still reconnecting from one that is not coming back.
- **No disconnects of other tabs:** wallets such as MetaMask keep one permission for the whole site and revoke it on a disconnect, for every tab. So `initializeAutoConnect` disconnects only connections this page opened through Satellite (the store's, and those an adapter opened and lists with `getLiveConnections`, such as the wallets an earlier store on the same adapters connected) other than the last active one, and without auto-connect it disconnects nothing. Wallets that your wallet library restored by itself, such as wagmi connections restored by `WagmiProvider`, are left as they are. `disconnectAll` is the explicit "disconnect everything" for a logout: it disconnects every connection of the store and the other connections the adapters opened in this page.
- **Contract accounts:** after a new connection, the adapter's `checkIsContractAddress` result is saved in `isContractAddress`, so UIs can tell smart accounts such as Safe from EOAs.
- **SIWX state:** `SatelliteSiwxState` is the Sign-In With X state that the chain watchers read. The result of `useSiwxSession()` from [`@tuwaio/siwx-react`](https://siwx.docs.tuwa.io/packages/siwx-react) matches it.

The store's Immer instance does not freeze state (connections hold wallet objects that must stay mutable) and leaves the global Immer settings of your app unchanged.

---

## 💾 Installation

```bash
pnpm add @tuwaio/satellite-core @tuwaio/orbit-core zustand immer
```

> [!IMPORTANT]
> `@tuwaio/orbit-core` (>=0.6), `zustand` (5.x) and `immer` (11.x) are peer dependencies and must be installed alongside `@tuwaio/satellite-core`. Add [`@tuwaio/satellite-evm`](https://satellite.docs.tuwa.io/packages/satellite-evm) and/or [`@tuwaio/satellite-solana`](https://satellite.docs.tuwa.io/packages/satellite-solana) for the chain adapters, and [`@tuwaio/satellite-react`](https://satellite.docs.tuwa.io/packages/satellite-react) for React apps.

---

## 🚀 Usage

The store works without a UI framework. Create it once with your adapters:

```typescript
import { createSatelliteConnectStore } from '@tuwaio/satellite-core';
import { type ConnectorEVM, type EVMConnection, satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { createConfig, http, injected } from '@wagmi/core';
import { mainnet } from 'viem/chains';

const wagmiConfig = createConfig({
  chains: [mainnet],
  connectors: [injected()],
  transports: { [mainnet.id]: http() },
});

export const satelliteStore = createSatelliteConnectStore<ConnectorEVM, EVMConnection>({
  adapter: satelliteEVMAdapter(wagmiConfig, [mainnet]),
  callbackAfterConnected: (connection) => console.log('Connected', connection.address),
});

// Once per page load, in the browser: reconnect the last connected wallet.
void satelliteStore.getState().initializeAutoConnect(true);

satelliteStore.subscribe((state) => {
  console.log(state.activeConnection?.address, state.connectionError?.message);
});

// The connector type is `evm:` plus the connector name in lower case without spaces.
export const connectMetaMask = () =>
  satelliteStore.getState().connect({ connectorType: 'evm:metamask', chainId: mainnet.id });
```

To follow account and chain changes made in the wallet, run the watcher of the chain package (`createEVMConnectionsWatcher`, `createSolanaConnectionsWatcher`). The React setup, with both chains and the watchers, is on the **[`@tuwaio/satellite-react`](https://satellite.docs.tuwa.io/packages/satellite-react)** page, and a full-stack app with Nova Connect, SIWX and Pulsar is in the **[Full-Stack React guide](https://docs.tuwa.io/guides/full-stack-react)**.

---

## 🗄️ Browser Storage

The store state lives in memory and is not persisted. The actions keep three keys up to date through the helpers of `@tuwaio/orbit-core`. The first two are in `localStorage` while the store's `rememberWallet` is `true` (the default) and in `sessionStorage`, kept only until the tab closes, while it is `false`; create the store with `rememberWallet: false` and call `setRememberWallet` from a "Remember this wallet" checkbox to let the user choose:

| Key                                                 | Content                                                                                                                                                                                                           | Written                                                                                                                                              | Removed                                                                |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `orbit-core:lastConnectedConnector`                 | `{ connectorType, chainId, address }` of the active connection (`chainId` is the chain the wallet is connected to, as normalized by the adapter: a number for EVM, a cluster moniker such as `devnet` for Solana) | By `connect`, `switchConnection`, `disconnect` while other connections remain, and `updateActiveConnection` when the active connection changes chain | When the last connection is disconnected                               |
| `orbit-core:recentlyConnectedConnectorsListHelpers` | `{ [connectorType]: { address, disconnectedTimestamp, icon } }`, the time in milliseconds                                                                                                                         | On every `connect`                                                                                                                                   | Entries older than 7 days, by `initializeAutoConnect`                  |
| `satellite-connect:impersonatedAddress`             | The address used by the `impersonated` connector of `@tuwaio/satellite-evm`                                                                                                                                       | By your app or Nova Connect (`impersonatedHelpers.setImpersonated`)                                                                                  | By `initializeAutoConnect`, `disconnectAll` and on the last disconnect |

- `initializeAutoConnect` reads the last connection (from `sessionStorage` first) and removes the impersonated address, so an impersonated session does not survive a reload. It sets `rememberWallet` to the choice the connection was saved with. When the last wallet does not register within 1.5 s, it removes the last connection; when the wallet no longer authorizes the site, it keeps it, so a later page load restores the wallet once it does.
- Nothing is saved but these fields: no RPC URLs (they may contain API keys), no wallet objects and no store state. Connection errors stay in memory.
- On the server (no `window`), nothing is read or written. Server rendering starts with no connection; the connection is restored in the browser after `initializeAutoConnect`.
- Other packages read these keys: `@tuwaio/pulsar-solana` finds the connected Solana wallet and its cluster from the last connection, `@tuwaio/pulsar-evm` uses its address as a fallback, and Nova Connect lists the recently connected wallets. Changing what is saved changes their behavior.

---

## 📚 API Reference

Every export, with signatures and types generated from the source, is documented at **[satellite.docs.tuwa.io/packages/satellite-core](https://satellite.docs.tuwa.io/packages/satellite-core)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/LICENSE) file for details.

## Interfaces

- [BaseConnector](/packages/satellite-core/interfaces/BaseConnector.md)
- [SatelliteSiwxState](/packages/satellite-core/interfaces/SatelliteSiwxState.md)

## Type Aliases

- [ConnectedCallback](/packages/satellite-core/type-aliases/ConnectedCallback.md)
- [Connector](/packages/satellite-core/type-aliases/Connector.md)
- [ConnectorsInitProps](/packages/satellite-core/type-aliases/ConnectorsInitProps.md)
- [ISatelliteConnectStore](/packages/satellite-core/type-aliases/ISatelliteConnectStore.md)
- [SatelliteAdapter](/packages/satellite-core/type-aliases/SatelliteAdapter.md)
- [SatelliteConnectStoreInitialParameters](/packages/satellite-core/type-aliases/SatelliteConnectStoreInitialParameters.md)

## Functions

- [createSatelliteConnectStore](/packages/satellite-core/functions/createSatelliteConnectStore.md)
