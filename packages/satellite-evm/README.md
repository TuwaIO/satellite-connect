# Satellite Connect EVM

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/satellite-evm.svg)](https://www.npmjs.com/package/@tuwaio/satellite-evm)
[![License](https://img.shields.io/npm/l/@tuwaio/satellite-evm.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

Low-level EVM wallet connectivity adapters built strictly on top of `viem` and `wagmi` primitives for the TUWA Ecosystem.

---

## 🏛️ What is `@tuwaio/satellite-evm`?

`@tuwaio/satellite-evm` is the low-level EVM network connection adapter (Layer 4) of the Satellite framework. It implements native connection watchers, cryptographic signature handlers, and smart contract verification layers directly on top of `viem` and `@wagmi/core`.

By bypassing proprietary wallet connection wrappers, this package ensures direct execution on raw client protocols and enforces strict RPC endpoint isolation.

---

## ✨ Engineering Features

- **Direct Wagmi Alignment:** Deep integration with `@wagmi/core` configurations, avoiding wrapper bloat.
- **Custom Connection Watchers:** Low-level event listener hooks tracking provider chain changes, account switches, and connection states.
- **Contract Wallet Checks:** Native, caching verification utilities (`checkIsWalletAddressContract`) for verifying EIP-1271 signatures or contract accounts.
- **RPC Transport Isolation:** Isolated transport rules with explicit path mapping using the `createDefaultTransports` controller.

---

## 💾 Installation

### Requirements

- Node.js 20-24
- TypeScript 5.9+

```bash
# Using pnpm (recommended), but you can use npm, yarn or bun as well
pnpm add @tuwaio/satellite-evm @tuwaio/satellite-core viem @wagmi/core immer zustand @tuwaio/orbit-core @tuwaio/orbit-evm
```

---

## 🚀 Quick Start

### Basic Configuration

```typescript
import { createDefaultTransports } from '@tuwaio/satellite-evm';
import { createConfig } from '@wagmi/core';
import { injected } from '@wagmi/connectors';
import { mainnet, sepolia } from 'viem/chains';
import type { Chain } from 'viem/chains';

export const appEVMChains = [mainnet, sepolia] as readonly [Chain, ...Chain[]];

export const wagmiConfig = createConfig({
  connectors: [injected()],
  transports: createDefaultTransports(appEVMChains), // Automatically creates http transports
  chains: appEVMChains,
  ssr: true, // Enable SSR support if needed (e.g., in Next.js)
});
```

---

## 🔌 Using the EVM Adapter

The core of this package is the `satelliteEVMAdapter`. It bridges the Satellite Connect system with the underlying `wagmi` configuration and functionalities.

### Creating the Adapter

You create the adapter by passing your `wagmiConfig` to the `satelliteEVMAdapter` function.

```typescript
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { wagmiConfig } from './your-wagmi-config'; // Import your configured wagmiConfig

export const evmAdapter = satelliteEVMAdapter(wagmiConfig, appEVMChains);
```

### Integrating with Satellite Connect Provider

Use the created adapter within the `SatelliteConnectProvider` from `@tuwaio/satellite-react`.

```tsx
import { SatelliteConnectProvider, EVMConnectorsWatcher } from '@tuwaio/satellite-react';
import { WagmiProvider } from 'wagmi';
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { wagmiConfig } from './your-wagmi-config';
import { evmAdapter } from './your-evm-adapter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Wagmi requires react-query

const queryClient = new QueryClient();

function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SatelliteConnectProvider
          adapter={evmAdapter} // Pass the EVM adapter
          autoConnect={true} // Optional: enable auto-connect
        >
          <EVMConnectorsWatcher wagmiConfig={wagmiConfig} /> {/* Manages EVM wallet state */}
          {children}
        </SatelliteConnectProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

---

## 🔐 Sign-In With X (SIWX) Session Integration

The `EVMConnectorsWatcher` component accepts a `siwx` prop directly compatible with `@tuwaio/siwx-react`. It monitors session status and automatically handles wallet disconnections if the user switches accounts or chains without an active SIWX session.

```tsx
import { useSiwxSession } from '@tuwaio/siwx-react';
import { SatelliteConnectProvider } from '@tuwaio/satellite-react';
import { EVMConnectorsWatcher } from '@tuwaio/satellite-react/evm';
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';

function AppProviders({ children }: { children: ReactNode }) {
  const siwxSession = useSiwxSession();

  return (
    <SatelliteConnectProvider adapter={satelliteEVMAdapter(wagmiConfig, appEVMChains)} autoConnect={true}>
      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwx={siwxSession} />
      {children}
    </SatelliteConnectProvider>
  );
}
```

---

## 🛠️ Core Utilities

- **`createDefaultTransports`**: Helper to create default `http` transports for each chain in your `wagmiConfig`.
- **`checkIsWalletAddressContract`**: Utility to check if a connected address is a smart contract address. The result is cached in memory.
- **`createEVMConnectionsWatcher`**: Framework-agnostic utility to monitor wagmi connection changes and synchronize them with the global state store. Handles account switches, network changes, disconnections, and optional SIWX session rejection scenarios. Returns a cleanup function.

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
