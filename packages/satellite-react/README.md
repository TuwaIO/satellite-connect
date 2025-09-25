# Satellite Connect React

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/satellite-react.svg)](https://www.npmjs.com/package/@tuwaio/satellite-react)
[![License](https://img.shields.io/npm/l/@tuwaio/satellite-react.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

React components and hooks for the Satellite Connect ecosystem, providing an easy-to-use interface for integrating Web3 wallet functionality into React applications.

---

## 🏛️ What is `@tuwaio/satellite-react`?

`@tuwaio/satellite-react` is the React integration layer for the Satellite Connect ecosystem. It provides a collection of React hooks and components that make it easy to integrate Web3 wallet functionality into your React applications.

Built on top of `@tuwaio/satellite-core`, this package offers a seamless developer experience for React applications requiring Web3 wallet integration.

---

## ✨ Key Features

- **Type Safety:** Full TypeScript support with proper type definitions
- **Chain Agnostic:** Unified support for both EVM and Solana wallets
- **Modern React:** Built with React 19+ features and best practices
- **Multi-Chain Support:** Seamless integration with multiple blockchain networks
- **State Management:** Zustand-based store for efficient state handling

---

## 💾 Installation

### Requirements
- React 19+
- Node.js 20+
- TypeScript 5.9+

```bash
# Using pnpm (recommended)
pnpm add @tuwaio/satellite-react @tuwaio/satellite-core @tuwaio/orbit-core @wagmi/core @wallet-standard/react gill react immer zustand

# Using npm
npm install @tuwaio/satellite-react @tuwaio/satellite-core @tuwaio/orbit-core @wagmi/core @wallet-standard/react gill react immer zustand

# Using yarn
yarn add @tuwaio/satellite-react @tuwaio/satellite-core @tuwaio/orbit-core @wagmi/core @wallet-standard/react gill react immer zustand
```
---

## 🚀 Quick Start

### Basic Setup
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

### Using Hooks
```tsx
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';

function ExampleGettingActiveWalletFromStore() {
  const activeWallet = useSatelliteConnectStore((state) => state.activeWallet);
  return <div>{activeWallet?.address}</div>
}
```
---

### Core Components

1. **Store Access**
    - `useSatelliteConnectStore`: Access to satellite connect store with full type safety
    - Provides access to wallet state, connection methods, and chain management

2. **Provider Components**
    - `SatelliteConnectProvider`: Global context provider with all necessary configurations
    - `EVMWalletsWatcher`: EVM wallet connection state management
    - `SolanaWalletsWatcher`: Solana wallet connection state management

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.

## 👥 Contributors

- **Oleksandr Tkach** - [GitHub](https://github.com/Argeare5)