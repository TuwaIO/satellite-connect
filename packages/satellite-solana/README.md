# Satellite Connect Solana

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/satellite-solana.svg)](https://www.npmjs.com/package/@tuwaio/satellite-solana)
[![License](https://img.shields.io/npm/l/@tuwaio/satellite-solana.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

Low-level Solana wallet connectivity adapters and session watchers built strictly on top of `gill` primitives for the TUWA Ecosystem.

---

## 🏛️ What is `@tuwaio/satellite-solana`?

`@tuwaio/satellite-solana` is the low-level Solana network connection adapter (Tier 4) of the Satellite framework. It manages Solana provider registrations, signature subscription loops, and session tracking using `gill` and standard `@wallet-standard` interfaces.

This package facilitates decentralized connection orchestration by interacting directly with the browser or mobile wallet standards without external SaaS/WaaS SDK dependencies.

---

## ✨ Engineering Features

- **Gill & Standard Primitives:** Integrates directly with `@wallet-standard/features` and the `gill` client engine.
- **Custom Connection Watchers:** Implements native watchers to monitor wallet status changes, session termination, and network transitions.
- **RPC Endpoint Isolation:** Enforces isolated RPC connection configurations across Mainnet Beta, Devnet, and Testnet.
- **Mobile Wallet Standard Mapping:** Native alignment with mobile wallet standard wrappers without proprietary relay networks.

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
  mainnet: 'https://api.mainnet-beta.solana.com',
};

// Create Solana adapter
const adapter = satelliteSolanaAdapter({
  rpcUrls: solanaRPCUrls,
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
