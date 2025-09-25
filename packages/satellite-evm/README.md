# Satellite Connect EVM

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/satellite-evm.svg)](https://www.npmjs.com/package/@tuwaio/satellite-evm)
[![License](https://img.shields.io/npm/l/@tuwaio/satellite-evm.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

EVM-specific implementation for the Satellite ecosystem, providing comprehensive utilities and adapters for interacting with EVM wallets and chains.

---

## 🏛️ What is `@tuwaio/satellite-evm`?

`@tuwaio/satellite-evm` is the EVM implementation of the Satellite ecosystem's wallet connection system. It provides specialized adapters and utilities for interacting with EVM-compatible wallets and chains like MetaMask, WalletConnect, and others.

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
pnpm add @tuwaio/satellite-evm @tuwaio/satellite-core viem @wagmi/core @wallet-standard/ui immer zustand @wagmi/connectors @tuwaio/orbit-core @tuwaio/orbit-evm

# Using npm
npm install @tuwaio/satellite-evm @tuwaio/satellite-core viem @wagmi/core @wallet-standard/ui immer zustand @wagmi/connectors @tuwaio/orbit-core @tuwaio/orbit-evm

# Using yarn
yarn add @tuwaio/satellite-evm @tuwaio/satellite-core viem @wagmi/core @wallet-standard/ui immer zustand @wagmi/connectors @tuwaio/orbit-core @tuwaio/orbit-evm
```
---

## 🚀 Quick Start

### Basic Configuration
```typescript
import { createWagmiConfig } from '@tuwaio/satellite-evm';
import { mainnet, sepolia } from 'viem/chains';

const config = createWagmiConfig({
appName: 'Your App Name',
projectId: 'your-wallet-project-id',
chains: [mainnet, sepolia],
});
```
---

### Core Components

1. **Adapters**
   - Wallet-specific implementations
   - Chain management utilities
   - Connection state handlers

2. **Connectors**
   - Chain configuration
   - Network management
   - Provider utilities

3. **Utils**
   - Create wagmi config helper with connectors

---

## 🌐 Supported Wallets

- MetaMask
- WalletConnect v2
- Coinbase Wallet
- And other EVM-compatible wallets

---

## 🔗 Chain Support

Built-in support for major EVM networks:
- Ethereum Mainnet
- Sepolia Testnet
- Polygon
- Arbitrum
- Optimism
- And other EVM-compatible networks

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.

## 👥 Contributors

- **Oleksandr Tkach** - [GitHub](https://github.com/Argeare5)