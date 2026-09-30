# Satellite Connect

[![License](https://img.shields.io/npm/l/@tuwaio/satellite-core.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

<img src="https://cdn.jsdelivr.net/gh/TuwaIO/workflows@main/preview/repos/satellite_connect.png" alt="Satellite Connect" width="400" style="border-radius: 10px; text-align: center; margin-bottom: 20px; margin-top: 20px; margin-left: auto; margin-right: auto; display: block;" />

**Satellite Connect** is the wallet connection project of TUWA Stage 2: a headless, framework-agnostic store for EVM and Solana wallet connections. It keeps the connected wallets and the active one outside your components, reconnects the last wallet after a page reload, follows account and network changes made in the wallet, and disconnects when a Sign-In With X session no longer matches the wallet, with no UI components and no hosted services.

Satellite Connect is built only on modern Web3 libraries: `@wagmi/core` and `viem` for EVM, the Wallet Standard and `@solana/kit` for Solana, on top of [Orbit Utils](https://orbit.docs.tuwa.io/). It does not use `ethers.js`, `web3.js`, `@solana/web3.js` or `gill`, and it does not depend on any Wallet-as-a-Service platform.

📖 **Documentation:** [satellite.docs.tuwa.io](https://satellite.docs.tuwa.io)

---

## 🏛️ Ecosystem Layer Architecture

TUWA is built in stages. Satellite Connect sits in **Stage 2 (State & Connection)** next to [Pulsar](https://pulsar.docs.tuwa.io/), above [SIWX](https://siwx.docs.tuwa.io/) and [Orbit Utils](https://orbit.docs.tuwa.io/) (Stage 1) and below [Quasar](https://docs.tuwa.io/quasar) (Stage 3) and [Nova UI Kit](https://stories.tuwa.io/) (Stage 4). Nova Connect renders Satellite Connect's state as connect modals, Pulsar reads the last connection it saves, and its watchers keep the wallet in line with a SIWX session; all of them are optional.

Inside the monorepo, packages are split into two layers:

### Layer 3: Core (L3)

- **[`@tuwaio/satellite-core`](./packages/satellite-core)**: the connection store (vanilla Zustand), the adapter contract, auto-connect and the SIWX state type. Peer dependencies: `@tuwaio/orbit-core`, `zustand`, `immer`.

### Layer 4: Chains and React (L4)

- **[`@tuwaio/satellite-evm`](./packages/satellite-evm)**: the EVM adapter and connections watcher, the contract account check and wagmi config helpers (default transports, Safe options, an impersonation connector). Peer dependencies: `@tuwaio/orbit-evm`, `@wagmi/core`, `viem`.
- **[`@tuwaio/satellite-solana`](./packages/satellite-solana)**: the Solana adapter, connections watcher and message signer. Peer dependencies: `@tuwaio/orbit-solana`, `@solana/kit` and the `@wallet-standard` packages.
- **[`@tuwaio/satellite-react`](./packages/satellite-react)**: the provider, the store hook and the chain watcher components (`@tuwaio/satellite-react/evm`, `@tuwaio/satellite-react/solana`). Peer dependencies: `react`, `zustand`, plus the chain packages of the entry points you import.

The EVM and Solana packages have `@tuwaio/satellite-core` as a peer dependency. The former `@tuwaio/satellite-siwe-next-auth` package is deprecated and no longer part of this repository: use [SIWX](https://siwx.docs.tuwa.io/) (`@tuwaio/siwx-react`, `@tuwaio/siwx-server`).

---

## 🔧 Monorepo Structure

```
satellite-connect/
├── apps/
│   └── docs/                   # satellite.docs.tuwa.io (Next.js 16 + Nextra 4)
│       ├── src/content/        # Hand-written MDX pages + generated `packages/` reference
│       └── typedoc/            # TypeDoc plugins, Packages overview page and sidebar templates
├── packages/
│   ├── satellite-core/         # L3: connection store, adapter contract, SIWX state type
│   ├── satellite-evm/          # L4: EVM adapter, watcher and wagmi helpers (@wagmi/core, viem)
│   ├── satellite-solana/       # L4: Solana adapter, watcher and signer (Wallet Standard, @solana/kit)
│   └── satellite-react/        # L4: provider, hook and watcher components (entry points ., ./evm, ./solana)
└── typedoc.json                # Reference generation (TypeDoc "packages" strategy)
```

---

## 💾 Installation

Install the L3 core and the L4 packages your app needs:

```bash
# L3 Core
pnpm add @tuwaio/satellite-core @tuwaio/orbit-core zustand immer

# L4 EVM
pnpm add @tuwaio/satellite-evm @tuwaio/orbit-evm @wagmi/core viem

# L4 Solana
pnpm add @tuwaio/satellite-solana @tuwaio/orbit-solana @solana/kit @wallet-standard/base @wallet-standard/features @wallet-standard/ui @wallet-standard/ui-registry @wallet-standard/app @wallet-standard/ui-core

# L4 React (add @wallet-standard/react and react-dom for @tuwaio/satellite-react/solana)
pnpm add @tuwaio/satellite-react react
```

---

## 🚀 Architectural Usage Example

A React app with EVM wallets. The provider creates the store and restores the last connection, the watcher follows the wallet, and components connect wallets and read the active connection:

```tsx
'use client';

import { formatConnectorName, OrbitAdapter } from '@tuwaio/orbit-core';
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { SatelliteConnectProvider, useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { EVMConnectorsWatcher } from '@tuwaio/satellite-react/evm';
import { createConfig, http, injected } from '@wagmi/core';
import type { ReactNode } from 'react';
import { mainnet } from 'viem/chains';

const appChains = [mainnet] as const;
const wagmiConfig = createConfig({ chains: appChains, connectors: [injected()], transports: { [mainnet.id]: http() } });
const evmAdapter = satelliteEVMAdapter(wagmiConfig, appChains);

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SatelliteConnectProvider adapter={evmAdapter} autoConnect>
      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} />
      {children}
    </SatelliteConnectProvider>
  );
}

export function WalletButtons() {
  const getConnectors = useSatelliteConnectStore((state) => state.getConnectors);
  const connect = useSatelliteConnectStore((state) => state.connect);
  const disconnect = useSatelliteConnectStore((state) => state.disconnect);
  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);

  if (activeConnection) {
    return <button onClick={() => disconnect()}>Disconnect {activeConnection.address}</button>;
  }

  return (getConnectors()[OrbitAdapter.EVM] ?? []).map((connector) => (
    <button
      key={connector.name}
      onClick={() =>
        connect({ connectorType: `${OrbitAdapter.EVM}:${formatConnectorName(connector.name)}`, chainId: mainnet.id })
      }
    >
      {connector.name}
    </button>
  ));
}
```

Solana wallets work the same way with `satelliteSolanaAdapter` and `SolanaConnectorsWatcher`. See the [`@tuwaio/satellite-react`](https://satellite.docs.tuwa.io/packages/satellite-react) page for both chains and SIWX.

---

## 🛠️ Development

```bash
pnpm install                                    # installs dependencies and builds all packages
pnpm build                                      # builds packages with tsup (ESM, CJS, types)
pnpm test                                       # runs vitest in every package
pnpm lint                                       # runs ESLint
pnpm docs:gen                                   # regenerates the Packages reference in apps/docs
pnpm --filter @tuwaio/satellite-connect-docs dev  # runs the docs site locally
```

The Packages reference is generated from each package's entry points (`src/index.ts`, plus `src/evm/index.ts` and `src/solana/index.ts` for `satellite-react`), JSDoc and README, and is regenerated by the pre-commit hook. Source links point to `main`, so a regeneration only changes the pages whose source actually changed. The tests of the L4 packages use the built `@tuwaio/satellite-core`: run `pnpm build` after changing it.

---

## 🤝 Contribution & Auditing

Please review our ecosystem **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

## 📄 License

Licensed under the **Apache-2.0 License**. See the [LICENSE](./LICENSE) file for details.
