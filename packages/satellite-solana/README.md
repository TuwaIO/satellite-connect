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

- Node.js 20-24
- TypeScript 5.9+

```bash
# Using pnpm (recommended), but you can use npm, yarn or bun as well
pnpm add @tuwaio/satellite-solana @tuwaio/satellite-core @tuwaio/orbit-core @tuwaio/orbit-solana gill immer zustand wagmi/core @wallet-standard/app @wallet-standard/base @wallet-standard/features @wallet-standard/ui @wallet-standard/ui-registry
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

---

### Core Components

1. **Adapters**
   - Wallet-specific implementations

2. **Utils**
   - Connection utilities

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
