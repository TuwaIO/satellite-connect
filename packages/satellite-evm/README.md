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

- **Chain Management:** Built-in utilities for handling multiple EVM chains
- **Type Safety:** Full TypeScript support with proper type definitions
- **Wagmi Integration:** Seamless integration with @wagmi/core utilities
- **Modern Architecture:** Built on Viem for optimal performance

---

## 💾 Installation

### Requirements

- Node.js 20-24
- TypeScript 5.9+

```bash
# Using pnpm (recommended), but you can use npm, yarn or bun as well
pnpm add @tuwaio/satellite-evm @tuwaio/satellite-core viem @wagmi/core immer zustand @tuwaio/orbit-core @tuwaio/orbit-evm
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

export const evmAdapter = satelliteEVMAdapter(wagmiConfig);
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
            autoConnect={true}   // Optional: enable auto-connect
          >
            <EVMConnectorsWatcher wagmiConfig={wagmiConfig} /> {/* Manages EVM wallet state */}
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
// Example: SIWE integration with @tuwaio/satellite-siwe-next-auth

import { useSiweAuth, SiweNextAuthProvider } from '@tuwaio/satellite-siwe-next-auth';
import { SatelliteConnectProvider } from '@tuwaio/satellite-react';
import { EVMConnectorsWatcher } from '@tuwaio/satellite-react/evm';
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './your-wagmi-config'; // Your Wagmi config
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState } from 'react';

// Step 1: Create SatelliteConnectProvider wrapper that consumes SIWE context
function SatelliteSiweProvider({ children }: { children: ReactNode }) {
  // Get SIWE auth state and methods from the provider above
  const { signInWithSiwe, enabled: siweEnabled, isRejected, isSignedIn } = useSiweAuth();

  return (
    <SatelliteConnectProvider
      // Create the adapter, passing signInWithSiwe if SIWE is enabled
      adapter={satelliteEVMAdapter(wagmiConfig, siweEnabled ? signInWithSiwe : undefined)}
      autoConnect={true}
    >
      {/* Pass SIWE state to watcher for handling disconnections on SIWE rejection */}
      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwe={{ isSignedIn, isRejected, enabled: siweEnabled }} />
      {children}
    </SatelliteConnectProvider>
  );
}

// Step 2: Compose all providers in the correct order
// Create QueryClient 
const queryClient = new QueryClient();

function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* SIWE Provider must wrap SatelliteSiweProvider to provide context */}
        <SiweNextAuthProvider wagmiConfig={wagmiConfig} enabled={true}>
          <SatelliteSiweProvider>
            {children}
          </SatelliteSiweProvider>
        </SiweNextAuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

// Step 3: Use Providers in your application layout
function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      {/* Your application components */}
      {children}
    </Providers>
  );
}
```

-----

- ## 🛠️ Core Utilities

- **`createDefaultTransports`**: Helper to create default `http` transports for each chain in your `wagmiConfig`.
- **`checkIsWalletAddressContract`**: Utility to check if a connected address is a smart contract address. The result is cached in memory.
- **`createEVMConnectionsWatcher`**: Framework-agnostic utility to monitor wagmi connection changes and synchronize them with the global state store. Handles account switches, network changes, disconnections, and optional SIWE rejection scenarios. Returns a cleanup function.

-----

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
