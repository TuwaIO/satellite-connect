# @tuwaio/satellite-react

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/satellite-react.svg)](https://www.npmjs.com/package/@tuwaio/satellite-react)
[![License](https://img.shields.io/npm/l/@tuwaio/satellite-react.svg)](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/LICENSE)

`@tuwaio/satellite-react` is the React Layer 4 (L4) package of **Satellite Connect**, the wallet connection project of TUWA Stage 2 ("State & Connection", next to Pulsar). Built on **`react`**, **`zustand`** and [`@tuwaio/satellite-core`](https://satellite.docs.tuwa.io/packages/satellite-core), it provides a provider that creates the connection store, a hook to read it in components, and one headless watcher component per chain that keeps the store in sync with the wallets. It has no UI components: wallet modals and buttons live in Nova Connect.

---

## 🏛️ Core Capabilities

- **Provider:** `SatelliteConnectProvider` creates the store once, passes later `adapter` and `callbackAfterConnected` changes to it, and runs `initializeAutoConnect` after mount, so the last connected wallet is restored in the browser.
- **Hook:** `useSatelliteConnectStore(selector)` reads a value from the store and re-renders when it changes. `SatelliteStoreContext` gives access to the store itself (`getState`, `subscribe`); it is shared on `globalThis`, so packages that bundle their own copy of `@tuwaio/satellite-react` see the same store.
- **Chain watchers:** `EVMConnectorsWatcher` (`/evm`) and `SolanaConnectorsWatcher` (`/solana`) render nothing. They load the watcher of their chain package after mount and copy account and chain changes made in the wallet into the store. With the `siwx` prop, for example the result of `useSiwxSession()` from [`@tuwaio/siwx-react`](https://siwx.docs.tuwa.io/packages/siwx-react), they disconnect the wallet when the sign-in is rejected or fails, or when the wallet moves to another account (or EVM chain) than the session. They restart only when a field of `siwx` changes, not when a new but equal object is passed.
- **Typed connections:** importing `/evm` or `/solana` adds the connection types of that chain to `AllConnections` and `AllConnectors`, so `activeConnection` is typed as `EVMConnection | SolanaConnection` in an app that imports both.

---

## 💾 Installation

The package has three entry points. Install the peer dependencies of the ones you import:

| Import path                      | Provides                                                               | Peer dependencies to install                                                                             |
| -------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `@tuwaio/satellite-react`        | `SatelliteConnectProvider`, `useSatelliteConnectStore`, context, types | `@tuwaio/satellite-core` (>=0.5), `react` (>=19.2.3), `zustand` (5.x)                                    |
| `@tuwaio/satellite-react/evm`    | `EVMConnectorsWatcher`                                                 | Also `@tuwaio/satellite-evm` (>=0.5), `@wagmi/core` (3.x) and `@tuwaio/orbit-core` (>=0.3)               |
| `@tuwaio/satellite-react/solana` | `SolanaConnectorsWatcher`                                              | Also `@tuwaio/satellite-solana` (>=0.5), `@wallet-standard/react` (1.x) and `@tuwaio/orbit-core` (>=0.3) |

The `/evm` and `/solana` peer dependencies are optional, so an EVM-only app does not install Solana packages. The chain packages bring their own peer dependencies, and `@tuwaio/satellite-core` needs `@tuwaio/orbit-core` and `immer`:

```bash
# @tuwaio/satellite-react
pnpm add @tuwaio/satellite-react @tuwaio/satellite-core @tuwaio/orbit-core react zustand immer

# @tuwaio/satellite-react/evm
pnpm add @tuwaio/satellite-evm @tuwaio/orbit-evm @wagmi/core viem

# @tuwaio/satellite-react/solana
pnpm add @tuwaio/satellite-solana @tuwaio/orbit-solana @solana/kit @wallet-standard/react @wallet-standard/base @wallet-standard/features @wallet-standard/ui @wallet-standard/ui-registry @wallet-standard/app @wallet-standard/ui-core react-dom
```

---

## 🚀 Usage

Render the provider and the watchers once, around your app:

```tsx
'use client';

import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { SatelliteConnectProvider, useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { EVMConnectorsWatcher } from '@tuwaio/satellite-react/evm';
import { SolanaConnectorsWatcher } from '@tuwaio/satellite-react/solana';
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';
import { useSiwxSession } from '@tuwaio/siwx-react';
import { createConfig, http, injected } from '@wagmi/core';
import type { ReactNode } from 'react';
import { mainnet } from 'viem/chains';

const appChains = [mainnet] as const;
const wagmiConfig = createConfig({ chains: appChains, connectors: [injected()], transports: { [mainnet.id]: http() } });
const adapters = [
  satelliteEVMAdapter(wagmiConfig, appChains),
  satelliteSolanaAdapter({ rpcUrls: { devnet: 'https://api.devnet.solana.com' } }),
];

export function Providers({ children }: { children: ReactNode }) {
  const siwxSession = useSiwxSession(); // optional: pass the SIWX session to the watchers

  return (
    <SatelliteConnectProvider adapter={adapters} autoConnect>
      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwx={siwxSession} />
      <SolanaConnectorsWatcher siwx={siwxSession} />
      {children}
    </SatelliteConnectProvider>
  );
}

export function ActiveAddress() {
  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);
  const connecting = useSatelliteConnectStore((state) => state.connecting);
  return <span>{connecting ? 'Connecting…' : (activeConnection?.address ?? 'Not connected')}</span>;
}
```

Connect a wallet with `useSatelliteConnectStore((state) => state.connect)`. Ready-made connect modals are in Nova Connect ([storybook](https://stories.tuwa.io/)), and a full-stack app with Nova Connect, SIWX and Pulsar is in the **[Full-Stack React guide](https://docs.tuwa.io/guides/full-stack-react)**.

---

## 🗄️ Browser Storage

The provider's store saves the last connection and the recently connected wallets to `localStorage`, and removes the impersonated address, through `@tuwaio/orbit-core`. The keys, their content and when they change are listed on the [`@tuwaio/satellite-core`](https://satellite.docs.tuwa.io/packages/satellite-core) page. The store state itself is not persisted: server rendering and the first client render start with no connection, and `initializeAutoConnect` restores it after mount (it waits 300 ms and disconnects the wallets of every adapter first). Read `isAutoConnectFinished` from the store before treating a missing connection as a disconnect.

---

## 📚 API Reference

Every export, with signatures and types generated from the source, is documented at **[satellite.docs.tuwa.io/packages/satellite-react](https://satellite.docs.tuwa.io/packages/satellite-react)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/LICENSE) file for details.

## Modules

- [react](/packages/satellite-react/react)
- [evm](/packages/satellite-react/evm)
- [solana](/packages/satellite-react/solana)
