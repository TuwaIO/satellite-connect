# Satellite Connect Core

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/satellite-core.svg)](https://www.npmjs.com/package/@tuwaio/satellite-core)
[![License](https://img.shields.io/npm/l/@tuwaio/satellite-core.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

Core of the Satellite ecosystem for Web3 wallet interactions, providing a universal interface for connecting and interacting with various blockchain wallets.

---

## 🏛️ What is `@tuwaio/satellite-core`?

`@tuwaio/satellite-core` is the foundation package of the Satellite ecosystem, designed to unify Web3 wallet interactions. It provides a single interface for connecting and interacting with wallets across different blockchains (EVM, Solana).

Built with TypeScript, it leverages modern tools for state management and type-safe development.

---

## ✨ Key Features

- **Universal Interface:** Single API for interacting with different blockchain wallets
- **Type Safety:** Full TypeScript support
- **Modular Architecture:** Easy extension for new wallet types
- **State Management:** Built-in connection state management system
- **Bundle Optimization:** Efficient tree-shaking optimization

---

## 💾 Installation

### Requirements
- Node.js 20+
- TypeScript 5.9+
```bash
# Using pnpm (recommended)
pnpm add @tuwaio/satellite-core @tuwaio/orbit-core immer zustand

# Using npm
npm install @tuwaio/satellite-core @tuwaio/orbit-core immer zustand

# Using yarn
yarn add @tuwaio/satellite-core @tuwaio/orbit-core immer zustand
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
