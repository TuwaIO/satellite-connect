# Satellite Connect 🛰️

[![License](https://img.shields.io/npm/l/@tuwaio/satellite-core.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

<p align="center">
  <img src="https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/repos/satellite_connect.png" alt="Satellite Connect" width="450" style="border-radius: 12px; margin: 24px auto;" />
</p>

Headless, multi-chain connection orchestration layer and cryptographic identity mapping framework for the TUWA Ecosystem.

---

## 🏛️ Overview

Satellite represents Layer 3 (Connectivity Core) and Layer 4 (Network Connection Adapters) of the TUWA stack. Engineered with a strict purist approach, it provides a developer-first connection orchestration layer for Web3 applications. By rejecting bloated third-party Wallet-as-a-Service (WaaS) SDKs and custodial/MPC systems, Satellite guarantees complete application sovereignty and zero vendor lock-in. All operations execute directly on top of raw protocol primitives using `viem`, `@wagmi/core`, and `gill`.

## 📦 Monorepo Architecture

The Satellite ecosystem is modular and structured as a strict hierarchy of framework-agnostic core logic, low-level network adapters, and framework bindings:

### 1. Connectivity Core (Layer 3)

- **[@tuwaio/satellite-core](./packages/satellite-core)**
  - Framework-agnostic type-safe state engine for tracking multi-chain connection lifecycles and active wallet sessions.
  - Core abstractions and universal interfaces for cryptographic identity mapping.

### 2. Headless Network Connection Adapters (Layer 4)

- **[@tuwaio/satellite-evm](./packages/satellite-evm)**
  - Low-level EVM wallet connectivity adapters built strictly on top of `viem` and `wagmi` primitives.
- **[@tuwaio/satellite-solana](./packages/satellite-solana)**
  - Low-level Solana wallet connectivity adapters and session watchers built strictly on top of `gill` primitives.

### 3. Framework Bindings & Auth

- **[@tuwaio/satellite-react](./packages/satellite-react)**
  - React state hooks and context providers for orchestrating framework-agnostic Satellite wallet connector instances.
- **[@tuwaio/satellite-siwe-next-auth](./packages/satellite-siwe-next-auth)**
  - Robust server-side session authentication adapter mapping cryptographic signatures to the SIWE standard and NextAuth.

---

## ✨ Architectural Principles

- **Zero Vendor Lock-In:** Complete ownership of the wallet connection pipeline without reliance on proprietary third-party connection clouds or authentication services.
- **Decoupled Architecture:** Connection logic and session tracking are completely decoupled from visual representation (Nova) and cloud indexing/persistence (Quasar).
- **Direct Low-Level Execution:** Interacts directly with native providers using pure standards (`viem`, `@wagmi/core`, `gill`, and Wallet Standard).
- **Type-Safe Session Store:** Powered by Zustand and Immer for highly optimized, predictable state transitions across multiple chains.

## 💾 Installation

```bash
# Core functionality
pnpm add @tuwaio/satellite-core # see peer deps to add all packages correct

# React integration
pnpm add @tuwaio/satellite-react # see peer deps to add all packages correct

# Chain-specific adapters
pnpm add @tuwaio/satellite-evm    # For EVM support
pnpm add @tuwaio/satellite-solana # For Solana support
```

## 🚀 Quick Start

### Basic Setup with React

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { satelliteEVMAdapter, createDefaultTransports } from '@tuwaio/satellite-evm';
import { SatelliteConnectProvider } from '@tuwaio/satellite-react';
import { EVMConnectorsWatcher } from '@tuwaio/satellite-react/evm';
import { SolanaConnectorsWatcher } from '@tuwaio/satellite-react/solana';
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';
import { WagmiProvider } from 'wagmi';
import { injected } from '@wagmi/connectors';
import { ReactNode } from 'react';
import { createConfig, http } from '@wagmi/core';
import { mainnet, sepolia } from 'viem/chains';
import type { Chain } from 'viem/chains';

export const appEVMChains = [mainnet, sepolia] as readonly [Chain, ...Chain[]];

export const wagmiConfig = createConfig({
  connectors: [injected()],
  transports: createDefaultTransports(appEVMChains), // Automatically creates http transports
  chains: appEVMChains,
  ssr: true, // Enable SSR support if needed (e.g., in Next.js)
});

export const solanaRPCUrls = {
  devnet: 'https://api.devnet.solana.com',
};

const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SatelliteConnectProvider
          adapter={[satelliteEVMAdapter(wagmiConfig, appEVMChains), satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls })]}
          autoConnect={true}
        >
          <EVMConnectorsWatcher wagmiConfig={wagmiConfig} />
          <SolanaConnectorsWatcher />
          {children}
        </SatelliteConnectProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
