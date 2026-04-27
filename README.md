# Satellite Connect 🛰️

[![License](https://img.shields.io/npm/l/@tuwaio/satellite-core.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

<img src="https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/repos/satellite_connect.png" alt="Satellite Connect" width="400" style="border-radius: 10px; text-align: center; margin-bottom: 20px; margin-top: 20px; margin-left: auto; margin-right: auto; display: block;" />

Universal Web3 wallet connection system with multi-chain support for modern dApps. Integrates EVM and Solana wallets seamlessly.

---

## 🏛️ Overview

Satellite Connect is a comprehensive ecosystem for Web3 wallet integrations, providing a unified interface for connecting and managing wallets across different blockchain networks. Built with TypeScript and modern tooling, it offers a seamless developer experience for both EVM and Solana blockchain applications.

## 📦 Packages

The Satellite Connect ecosystem consists of several packages:

### Core Packages

- **[@tuwaio/satellite-core](./packages/satellite-core)**
  - Foundation package with universal wallet interface
  - Chain-agnostic connection management
  - TypeScript-first development

- **[@tuwaio/satellite-react](./packages/satellite-react)**
  - React components and hooks
  - Full React 19+ support

- **[@tuwaio/satellite-siwe-next-auth](./packages/satellite-siwe-next-auth)**
  - Secure, server-side SIWE (Sign-In with Ethereum) authentication
  - Next.js App Router compatible API handlers
  - Uses Iron Session for secure, encrypted cookie management

### Chain-Specific Adapters

- **[@tuwaio/satellite-evm](./packages/satellite-evm)**
  - EVM wallet integrations (MetaMask, WalletConnect, etc.)
  - Built on Wagmi and Viem
  - Multi-chain EVM support

- **[@tuwaio/satellite-solana](./packages/satellite-solana)**
  - Solana wallet support (Phantom, Solflare, etc.)
  - Built on Gill and @wallet-standard

-----

## ✨ Key Features

- **Universal Interface:** Single API for all supported wallets
- **Multi-Chain Support:**
  - EVM networks (Ethereum, Polygon, etc.)
  - Solana (Mainnet, Devnet, Testnet)
- **Modern Architecture:**
  - React 19+ support
  - TypeScript 5.9+
  - Tree-shaking optimization
- **Mobile Ready:**
  - Mobile wallet support
  - Universal links handling

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

export const appEVMChains = [
  mainnet,
  sepolia,
] as readonly [Chain, ...Chain[]];

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
