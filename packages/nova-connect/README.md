# Nova Connect

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/nova-connect.svg)](https://www.npmjs.com/package/@tuwaio/nova-connect)
[![License](https://img.shields.io/npm/l/@tuwaio/nova-connect.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/nova-connect/release.yml?branch=main)](https://github.com/TuwaIO/nova-uikit/actions)

Feature-rich React components for connecting Web3 wallets with a comprehensive customization system and support for multiple blockchain networks.

---

## 🏛️ What is `@tuwaio/nova-connect`?

`@tuwaio/nova-connect` is a comprehensive solution for integrating Web3 wallets into React applications. The package provides ready-to-use components with deep customization and support for both EVM and Solana blockchains.

Built on top of the Satellite Connect ecosystem, Nova Connect offers a unified interface for working with various wallet types and blockchain networks.

---

## ✨ Key Features

- **🎨 Full Customization**: Comprehensive customization system for all components and behaviors.
- **⚡ TypeScript**: Full TypeScript support with proper type definitions.
- **🌐 Multi-Blockchain**: Unified support for EVM and Solana wallets.
- **🔗 Modern React**: Built using React 19+ features and best practices.
- **🎯 Ready-made Components**: Connection button, modals, network selectors.
- **♿ Accessibility**: Full ARIA and keyboard navigation support.
- **🎭 Internationalization**: Support for multiple languages.
- **🔄 State Management**: Zustand-based store for efficient state management.
- **📱 Responsiveness**: Mobile-first design.

---

## 💾 Installation

### Requirements
- React 19+
- Node.js 24+
- TypeScript 5.9+

```bash
# Using pnpm (recommended)
pnpm add @tuwaio/nova-connect @tuwaio/satellite-core @tuwaio/orbit-core @tuwaio/pulsar-core @tuwaio/satellite-evm @tuwaio/satellite-solana @wagmi/core @wallet-standard/react viem zustand

# Using npm
npm install @tuwaio/nova-connect @tuwaio/satellite-core @tuwaio/orbit-core @tuwaio/pulsar-core @tuwaio/satellite-evm @tuwaio/satellite-solana @wagmi/core @wallet-standard/react viem zustand

# Using yarn
yarn add @tuwaio/nova-connect @tuwaio/satellite-core @tuwaio/orbit-core @tuwaio/pulsar-core @tuwaio/satellite-evm @tuwaio/satellite-solana @wagmi/core @wallet-standard/react viem zustand
````

-----

## 🚀 Quick Start

### Basic Provider Setup

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { EVMWalletsWatcher, SatelliteConnectProvider, SolanaWalletsWatcher } from '@tuwaio/satellite-react';
import { initializeSolanaMobileConnectors, satelliteSolanaAdapter } from '@tuwaio/satellite-solana';
import { ReactNode } from 'react';
import { WagmiProvider } from 'wagmi';
import { createWagmiConfig } from '@tuwaio/satellite-evm';
import { Chain, mainnet, polygon, arbitrum } from 'viem/chains';

export const appConfig = {
  appName: 'My Nova Connect App',
};

export const solanaRPCUrls = {
  mainnet: '[https://api.mainnet-beta.solana.com](https://api.mainnet-beta.solana.com)',
};

export const appEVMChains = [mainnet, polygon, arbitrum] as readonly [Chain, ...Chain[]];

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
          adapters={[satelliteEVMAdapter({ wagmiConfig }), satelliteSolanaAdapter()]}
          appName={appConfig.appName}
        >
          <EVMWalletsWatcher />
          <SolanaWalletsWatcher />
          {children}
        </SatelliteConnectProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### Using NovaConnectButton

```tsx
import { NovaConnectButton } from '@tuwaio/nova-connect';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';

function App() {
  const store = useSatelliteConnectStore();

  return (
    <div>
      <NovaConnectButton
        store={store}
        appChains={appEVMChains}
        solanaRPCUrls={solanaRPCUrls}
        withBalance
        withChain
        withImpersonated
      />
    </div>
  );
}
```

-----

## 🎨 Customization

Nova Connect provides three levels of customization:

### Basic Customization

```tsx
<NovaConnectButton
  store={store}
  appChains={appEVMChains}
  solanaRPCUrls={solanaRPCUrls}
  className="custom-button"
  labels={{
    connectWallet: 'Connect Wallet',
    disconnect: 'Disconnect',
  }}
/>
```

### Advanced Customization

```tsx
<NovaConnectButton
  store={store}
  appChains={appEVMChains}
  solanaRPCUrls={solanaRPCUrls}
  customization={{
    connectButton: {
      classNames: {
        button: ({ buttonData }) => `btn ${buttonData.isConnected ? 'btn-connected' : 'btn-connect'}`,
      },
    },
    provider: {
      errors: {
        position: 'bottom-right',
        autoClose: 5000,
      },
    },
  }}
/>
```

### Full Provider Customization

```tsx
<NovaConnectButton
  store={store}
  appChains={appEVMChains}
  solanaRPCUrls={solanaRPCUrls}
  customization={{
    provider: {
      // Custom components
      components: {
        ErrorsProvider: CustomErrorsProvider,
        LabelsProvider: CustomLabelsProvider,
      },
      // Label customization
      labels: {
        merge: (defaultLabels, userLabels) => ({ ...defaultLabels, ...userLabels }),
        transform: (mergedLabels, context) => ({
          ...mergedLabels,
          connectWallet: context.isConnected ? 'Reconnect' : 'Connect Wallet',
        }),
      },
      // Lifecycle hooks
      initialization: {
        onConnectionStateChange: (isConnected, wallet, context) => {
          console.log('Connection state changed:', isConnected);
        },
      },
    },
  }}
/>
```

-----

## 🧩 Key Components

### 1. **NovaConnectButton**

- Main component for wallet connection.
- Built-in support for balance display and network selector.
- Full customization system.

### 2. **NovaConnectProvider**

- Context provider with state management.
- Customizable error handling.
- Flexible internationalization system.

### 3. **Hooks**

- `useWalletBalance`: Get the wallet balance.

-----

## 🌍 Internationalization

Nova Connect supports full label customization:

```tsx
const customLabels = {
  connectWallet: 'Connect Wallet',
  disconnect: 'Disconnect',
  connecting: 'Connecting...',
  connected: 'Connected',
  // ... other labels
};

<NovaConnectButton
  store={store}
  labels={customLabels}
  // ... other props
/>
```

-----

## ♿ Accessibility

Nova Connect fully supports accessibility standards:

- ARIA labels and descriptions
- Keyboard navigation
- Screen reader support
- Semantic HTML elements
- High contrast

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.

## 👥 Contributors

- **Oleksandr Tkach** - [GitHub](https://github.com/Argeare5)