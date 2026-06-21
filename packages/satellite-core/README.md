# Satellite Connect Core

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/satellite-core.svg)](https://www.npmjs.com/package/@tuwaio/satellite-core)
[![License](https://img.shields.io/npm/l/@tuwaio/satellite-core.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

Framework-agnostic type-safe state engine for tracking multi-chain connection lifecycles and active wallet sessions in the TUWA Ecosystem.

---

## 🏛️ What is `@tuwaio/satellite-core`?

`@tuwaio/satellite-core` represents the core state management and cryptographic identity mapping layer of the Satellite framework. It functions as a framework-agnostic state tracker keeping absolute synchronization between multi-chain provider events and unified application session layers.

By employing Zustand and Immer, it operates as a type-safe state engine without direct UI bindings, establishing a clean separation of concerns.

---

## ✨ Core Primitives

- **Cryptographic Identity Mapping:** Standardized session and address models across EVM and Solana chains.
- **Connection Orchestration:** Framework-agnostic lifecycle management for active sessions and protocol-level connections.
- **Type-Safe Session Store:** Deterministic and immutable state transitions powered by Zustand and Immer.
- **Provider Event Synchronization:** Real-time event watchers for network mutations, account switches, and disconnections.
- **Zero UI Coupling:** Fully headless execution designed to feed directly into bindings or custom interfaces.

---

## 💾 Installation

### Requirements

- Node.js 20-24
- TypeScript 5.9+

```bash
# Using pnpm (recommended), but you can use npm, yarn or bun as well
pnpm add @tuwaio/satellite-core @tuwaio/orbit-core immer zustand
```

---

## 🔧 Architecture

The package is structured around these core components:

### Build System

- Built with `tsup`
- Supports CommonJS and ESM formats
- Generates TypeScript declarations

### Core Modules

- **Store:** Connection state management system
- **Types:** Type system for unified wallet operations

---

## ✨ Ecosystem Integration

Satellite Core works in conjunction with other ecosystem packages:

- **`@tuwaio/satellite-core`:** Base functionality (this package)
- **`@tuwaio/satellite-evm`:** EVM wallet integration
- **`@tuwaio/satellite-solana`:** Solana wallet integration
- **`@tuwaio/satellite-react`:** React hooks and components
- **`@tuwaio/satellite-siwe-next-auth`:** React hooks and components for SIWE auth in the next js app

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
