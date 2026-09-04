# Satellite Connect React

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/satellite-react.svg)](https://www.npmjs.com/package/@tuwaio/satellite-react)
[![License](https://img.shields.io/npm/l/@tuwaio/satellite-react.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

React state hooks and context providers for orchestrating framework-agnostic Satellite wallet connector instances.

---

## 🏛️ What is `@tuwaio/satellite-react`?

`@tuwaio/satellite-react` provides the React integration layer for the Satellite framework. It exposes optimized state hooks and context providers to orchestrate and watch framework-agnostic Satellite wallet connector instances.

By mapping underlying Zustand store mutations to React's rendering lifecycle, it enables developers to maintain a synchronized, multi-chain connection state.

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
- Node.js 20-24
- TypeScript 5.9+

```bash
# Using pnpm (recommended), but you can use npm, yarn or bun as well
pnpm add @tuwaio/satellite-react @tuwaio/satellite-core @tuwaio/orbit-core @wagmi/core @wallet-standard/react @solana/kit react immer zustand
```

---

## 🚀 Quick Start

### Basic Setup

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { satelliteEVMAdapter, createDefaultTransports } from '@tuwaio/satellite-evm';
import { SatelliteConnectProvider } from '@tuwaio/satellite-react';
import { EVMConnectorsWatcher } from '@tuwaio/satellite-react/evm';
import { SolanaConnectorsWatcher } from '@tuwaio/satellite-react/solana';
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';
import { WagmiProvider } from 'wagmi';
import { ReactNode } from 'react';
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

### Using Hooks

```tsx
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';

function ExampleGettingActiveWalletFromStore() {
  const activeConnection = useSatelliteConnectStore((state) => state.activeConnection);
  return <div>{activeConnection?.address}</div>;
}
```

---

## 🔐 Sign-In With X (SIWX) Integration

The `EVMConnectorsWatcher` and `SolanaConnectorsWatcher` components accept the `siwx` session state from `@tuwaio/siwx-react`. The watchers automatically monitor connection parity and disconnect the wallet if account switching occurs without a matching session, or if the user rejects signing:

```tsx
import { useSiwxSession } from '@tuwaio/siwx-react';
import { SatelliteConnectProvider } from '@tuwaio/satellite-react';
import { EVMConnectorsWatcher } from '@tuwaio/satellite-react/evm';
import { SolanaConnectorsWatcher } from '@tuwaio/satellite-react/solana';

export function Providers({ children }: { children: ReactNode }) {
  const siwxSession = useSiwxSession();

  return (
    <SatelliteConnectProvider
      adapter={[satelliteEVMAdapter(wagmiConfig, appEVMChains), satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls })]}
      autoConnect={true}
    >
      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwx={siwxSession} />
      <SolanaConnectorsWatcher siwx={siwxSession} />
      {children}
    </SatelliteConnectProvider>
  );
}
```

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
