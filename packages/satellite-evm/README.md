# Satellite Connect EVM

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/satellite-evm.svg)](https://www.npmjs.com/package/@tuwaio/satellite-evm)
[![License](https://img.shields.io/npm/l/@tuwaio/satellite-evm.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

EVM-specific implementation for the Satellite ecosystem, providing comprehensive utilities and adapters for interacting with EVM wallets and chains.

---

## 🏛️ What is `@tuwaio/satellite-evm`?

`@tuwaio/satellite-evm` is the EVM implementation of the Satellite ecosystem's wallet connection system. It provides specialized adapters and utilities for interacting with EVM-compatible wallets like MetaMask, WalletConnect, and others.

Built on top of `@tuwaio/satellite-core`, this package integrates seamlessly with modern Web3 libraries like `viem` and `@wagmi/core`.

---

## ✨ Key Features

- **EVM Wallet Support:** Native support for popular EVM wallets
- **Chain Management:** Built-in utilities for handling multiple EVM chains
- **Type Safety:** Full TypeScript support with proper type definitions
- **Wagmi Integration:** Seamless integration with @wagmi/core utilities
- **Modern Architecture:** Built on Viem for optimal performance

---

## 💾 Installation

### Requirements

- Node.js 20+
- TypeScript 5.9+

```bash
# Using pnpm (recommended)
pnpm add @tuwaio/satellite-evm @tuwaio/satellite-core viem @wagmi/core immer zustand @tuwaio/orbit-core @tuwaio/orbit-evm

# Using npm
npm install @tuwaio/satellite-evm @tuwaio/satellite-core viem @wagmi/core immer zustand @tuwaio/orbit-core @tuwaio/orbit-evm

# Using yarn
yarn add @tuwaio/satellite-evm @tuwaio/satellite-core viem @wagmi/core immer zustand @tuwaio/orbit-core @tuwaio/orbit-evm
````

-----

## 🚀 Quick Start

### Basic Configuration

```typescript
import { createDefaultTransports } from '@tuwaio/satellite-evm';
import { createConfig } from '@wagmi/core';
import { injected } from '@wagmi/connectors';
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
```

-----

## 🔌 Using the EVM Adapter

The core of this package is the `satelliteEVMAdapter`. It bridges the Satellite Connect system with the underlying `wagmi` configuration and functionalities.

### Creating the Adapter

You create the adapter by passing your `wagmiConfig` to the `satelliteEVMAdapter` function.

```typescript
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { wagmiConfig } from './your-wagmi-config'; // Import your configured wagmiConfig

const evmAdapter = satelliteEVMAdapter(wagmiConfig);
```

### Integrating with Satellite Connect Provider

Use the created adapter within the `SatelliteConnectProvider` from `@tuwaio/satellite-react`.

```tsx
import { SatelliteConnectProvider, EVMWalletsWatcher } from '@tuwaio/satellite-react';
import { WagmiProvider } from 'wagmi';
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { wagmiConfig } from './your-wagmi-config';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; // Wagmi requires react-query

const queryClient = new QueryClient();

function AppProviders({ children }: { children: React.ReactNode }) {
  const evmAdapter = satelliteEVMAdapter(wagmiConfig);

  return (
    <WagmiProvider config={wagmiConfig}>
       <QueryClientProvider client={queryClient}>
          <SatelliteConnectProvider
            adapter={evmAdapter} // Pass the EVM adapter
            autoConnect={true}   // Optional: enable auto-connect
          >
            <EVMWalletsWatcher wagmiConfig={wagmiConfig} /> {/* Manages EVM wallet state */}
            {children}
          </SatelliteConnectProvider>
        </QueryClientProvider>
    </WagmiProvider>
  );
}
```

-----

## 🔐 Sign-In with Ethereum (SIWE) Integration

The `satelliteEVMAdapter` seamlessly integrates with SIWE solutions like `@tuwaio/satellite-siwe-next-auth`. You can pass the `signInWithSiwe` function (obtained from the SIWE provider/hook) as the second argument to the adapter.

This ensures that the SIWE flow is automatically triggered after a successful wallet connection.

```tsx
// Example within a React component using @tuwaio/satellite-siwe-next-auth

import { useSiweAuth, SiweNextAuthProvider } from '@tuwaio/satellite-siwe-next-auth';
import { SatelliteConnectProvider } from '@tuwaio/satellite-react';
import { EVMWalletsWatcher } from '@tuwaio/satellite-react/evm';
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './your-wagmi-config'; // Your Wagmi config
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  // Assuming SiweNextAuthProvider is wrapping this component higher up
  const { signInWithSiwe, enabled: siweEnabled, isRejected, isSignedIn } = useSiweAuth();

  // Create the adapter, passing signInWithSiwe if SIWE is enabled
  const evmAdapter = satelliteEVMAdapter(wagmiConfig, siweEnabled ? signInWithSiwe : undefined);

  return (
      <SatelliteConnectProvider
        adapter={evmAdapter}
        autoConnect={true}
      >
        {/* Pass siwe state to watcher for handling disconnections on SIWE rejection */}
        <EVMWalletsWatcher wagmiConfig={wagmiConfig} siwe={{ isSignedIn, isRejected, enabled: siweEnabled }} />
        {/* Your application components */}
      </SatelliteConnectProvider>
  );
}


// Wrap your main application layout with necessary providers
function RootLayout({ children }: { children: React.ReactNode }) {
 return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
         {/* SIWE Provider wraps SatelliteConnectProvider */}
        <SiweNextAuthProvider wagmiConfig={wagmiConfig} enabled={true}>
            {children} {/* App component will be rendered here */}
        </SiweNextAuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
 );
}
```

-----

## 🛠️ Core Utilities

- **`createDefaultTransports`**: Helper to create default `http` transports for each chain in your `wagmiConfig`.
- **`checkIsWalletAddressContract`**: Utility to check if a connected address is a smart contract address. The result is cached in memory.

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
