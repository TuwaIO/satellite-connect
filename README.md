# Satellite Connect 🛰️

[![License](https://img.shields.io/npm/l/@tuwaio/satellite-core.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

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

### Chain-Specific Adapters
- **[@tuwaio/satellite-evm](./packages/satellite-evm)**
  - EVM wallet integrations (MetaMask, WalletConnect, etc.)
  - Built on Wagmi and Viem
  - Multi-chain EVM support

- **[@tuwaio/satellite-solana](./packages/satellite-solana)**
  - Solana wallet support (Phantom, Solflare, etc.)
  - Mobile wallet adapter support
  - Built on Gill and @wallet-standard

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
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { EVMWalletsWatcher, SatelliteConnectProvider, SolanaWalletsWatcher } from '@tuwaio/satellite-react';
import { initializeSolanaMobileConnectors, satelliteSolanaAdapter } from '@tuwaio/satellite-solana';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { createWagmiConfig } from '@tuwaio/satellite-evm';
import { Chain, mainnet, sepolia } from 'viem/chains';

export const appConfig = {
  appName: 'Satellite EVM Test App',
};

export const solanaRPCUrls = {
  devnet: 'https://api.devnet.solana.com',
};

export const appEVMChains = [mainnet, sepolia] as readonly [Chain, ...Chain[]];

export const wagmiConfig = createWagmiConfig({
  ...appConfig,
  chains: appEVMChains,
  ssr: true,
  syncConnectedChain: true,
});


const queryClient = new QueryClient();

initializeSolanaMobileConnectors({
  rpcUrls: solanaRPCUrls,
  ...appConfig,
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <SatelliteConnectProvider
          adapter={[satelliteEVMAdapter(wagmiConfig), satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls })]}
          autoConnect={true}
        >
          <EVMWalletsWatcher wagmiConfig={wagmiConfig} />
          <SolanaWalletsWatcher />
          {children}
        </SatelliteConnectProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

## 🌐 Supported Wallets

### EVM
- MetaMask
- WalletConnect v2
- Coinbase Wallet
- Trust Wallet
- Rainbow

### Solana
- Phantom
- Solflare
- Backpack
- Trust Wallet (Solana)
- Mobile Wallets

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.

## 👥 Contributors

- **Oleksandr Tkach** - [GitHub](https://github.com/Argeare5)