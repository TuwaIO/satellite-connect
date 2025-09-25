# Satellite Connect Solana

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/satellite-solana.svg)](https://www.npmjs.com/package/@tuwaio/satellite-solana)
[![License](https://img.shields.io/npm/l/@tuwaio/satellite-solana.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

Solana-specific implementation for the Satellite Connect ecosystem, providing comprehensive utilities and adapters for interacting with Solana wallets and networks.

---

## 🏛️ What is `@tuwaio/satellite-solana`?

`@tuwaio/satellite-solana` is the Solana implementation of the Satellite ecosystem's wallet connection system. It provides specialized adapters and utilities for interacting with Solana-compatible wallets like Phantom, Solflare, and others.

Built on top of `@tuwaio/satellite-core` and leveraging `@tuwaio/orbit-solana` for enhanced Solana interactions.

---

## ✨ Key Features

- **Type Safety:** Full TypeScript support with proper type definitions
- **Mobile Support:** Built-in mobile wallet connection support
- **Modern Architecture:** Built on Gill for optimal performance
- **Multi-Network:** Support for mainnet, devnet and testnet

---

## 💾 Installation

### Requirements
- Node.js 20+
- TypeScript 5.9+

```bash
# Using pnpm (recommended)
pnpm add @tuwaio/satellite-solana @tuwaio/satellite-core @tuwaio/orbit-core @tuwaio/orbit-solana gill @solana-mobile/wallet-standard-mobile immer zustand wagmi/core @wallet-standard/app @wallet-standard/base @wallet-standard/features @wallet-standard/ui @wallet-standard/ui-registry

# Using npm
npm install @tuwaio/satellite-solana @tuwaio/satellite-core @tuwaio/orbit-core @tuwaio/orbit-solana gill @solana-mobile/wallet-standard-mobile immer zustand wagmi/core @wallet-standard/app @wallet-standard/base @wallet-standard/features @wallet-standard/ui @wallet-standard/ui-registry

# Using yarn
yarn add @tuwaio/satellite-solana @tuwaio/satellite-core @tuwaio/orbit-core @tuwaio/orbit-solana gill @solana-mobile/wallet-standard-mobile immer zustand wagmi/core @wallet-standard/app @wallet-standard/base @wallet-standard/features @wallet-standard/ui @wallet-standard/ui-registry
```
---

## 🚀 Quick Start

### Basic Setup
```typescript
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';

// Configure RPC endpoints
const solanaRPCUrls = {
    devnet: 'https://api.devnet.solana.com',
    mainnet: 'https://api.mainnet-beta.solana.com'
};

// Create Solana adapter
const adapter = satelliteSolanaAdapter({
  rpcUrls: solanaRPCUrls
});
```

### Mobile Support Setup

```typescript
import { initializeSolanaMobileConnectors } from '@tuwaio/satellite-solana';

// Initialize mobile connectors
initializeSolanaMobileConnectors({
    rpcUrls: solanaRPCUrls,
    appName: 'Your dApp Name'
});
```
---

### Core Components

1. **Adapters**
   - Wallet-specific implementations
   - Mobile wallet adapters

2. **Mobile Support**
   - Mobile wallet detection
   - Mobile-specific connection flows
   - Universal link handlers

3. **Utils**
   - Connection utilities

---

## 🌐 Supported Wallets

- Phantom
- Solflare
- Backpack
- Trust Wallet (Solana)
- Mobile Wallets (via Mobile Wallet Adapter)
- And other Solana-compatible wallets

---

## 🔗 Network Support

Built-in support for all Solana networks:
- Mainnet
- Devnet
- Testnet

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.

## 👥 Contributors

- **Oleksandr Tkach** - [GitHub](https://github.com/Argeare5)