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
import { satelliteEVMAdapter, createDefaultTransports, initAllConnectors } from '@tuwaio/satellite-evm';
import { SatelliteConnectProvider } from '@tuwaio/satellite-react';
import { EVMWalletsWatcher } from '@tuwaio/satellite-react/evm';
import { SolanaWalletsWatcher } from '@tuwaio/satellite-react/solana';
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';
import { WagmiProvider } from 'wagmi';
import { ReactNode } from 'react';
import { createConfig, http } from '@wagmi/core';
import { mainnet, sepolia } from 'viem/chains';
import type { Chain } from 'viem/chains';

export const appConfig = {
   appName: 'Satellite EVM Test App',
   // Ensure you have WalletConnect Project ID in your environment variables
   projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID ?? 'YOUR_OWN_PROJECT_ID',
};

export const appEVMChains = [
   mainnet,
   sepolia,
] as readonly [Chain, ...Chain[]];

export const wagmiConfig = createConfig({
   connectors: initAllConnectors({
      ...appConfig,
      // Optional: Add app details for WalletConnect modal
      description: 'My awesome dApp',
      appUrl: '[https://my-dapp.com](https://my-dapp.com)',
      appIcons: ['[https://my-dapp.com/icon.png](https://my-dapp.com/icon.png)'],
   }),
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
