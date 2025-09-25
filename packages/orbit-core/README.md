# Orbit Core

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/orbit-core.svg)](https://www.npmjs.com/package/@tuwaio/orbit-core)
[![License](https://img.shields.io/npm/l/@tuwaio/orbit-core.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/orbit-core/release.yml?branch=main)](https://github.com/TuwaIO/orbit-core/actions)

A powerful, framework-agnostic library for seamless multi-chain blockchain interactions, providing a unified interface for EVM, Solana, and Starknet operations.

---

## 🏛️ What is `@tuwaio/orbit-core`?

`@tuwaio/orbit-core` is the foundation of the TUWA ecosystem. It's designed as a **headless** and **framework-agnostic** library that provides essential infrastructure for multi-chain blockchain interactions. The library doesn't include UI components or framework-specific code, making it versatile for any JavaScript or TypeScript application.

Its primary purpose is to provide a unified interface for interacting with different blockchain architectures through a flexible adapter system. Built with TypeScript for type safety and maintainability, it serves as the backbone for blockchain applications requiring multi-chain support.

---

## ✨ Key Features

- **Multi-Chain Architecture:** Native support for EVM, Solana, and Starknet through a unified adapter interface
- **Framework Independence:** Compatible with any JavaScript framework or vanilla JS
- **Type-Safe Development:** Full TypeScript support with comprehensive type definitions
- **Flexible Adapter System:** Easily extensible for new blockchain architectures
- **Optimized Performance:** Minimal overhead for blockchain operations
- **Robust Error Handling:** Comprehensive error management across different chains

---

## 💾 Installation
```bash
# Using pnpm
pnpm add @tuwaio/orbit-core zustand
# Using npm
npm install @tuwaio/orbit-core zustand
# Using yarn
yarn add @tuwaio/orbit-core zustand
``` 

---

## 🚀 Quick Start

### Basic Usage
```typescript
import { OrbitAdapter, selectAdapterByKey } from '@tuwaio/orbit-core';
// Configure your adapter 
const adapter = { key: OrbitAdapter.EVM };  // adapter implementation
// Select adapter for specific chain 
const evmAdapter = selectAdapterByKey({ adapterKey: OrbitAdapter.EVM, adapter, });
``` 

### Supported Chain Types
```typescript
// Available blockchain adapters 
import { OrbitAdapter } from '@tuwaio/orbit-core';
const chains = { evm: OrbitAdapter.EVM }; // Ethereum, Polygon, BSC, etc. solana: OrbitAdapter.SOLANA, // Solana blockchain starknet: OrbitAdapter.Starknet // Starknet L2
``` 

---

## 🔧 Architecture

Orbit Core is built on these main concepts:

1. **Adapters:** Chain-specific implementations that handle blockchain interactions
2. **Type System:** Comprehensive TypeScript definitions for type-safe development
3. **Utilities:** Helper functions for common blockchain operations

### Core Components

- `OrbitAdapter`: Enum defining supported blockchain types
- `selectAdapterByKey`: Utility for runtime adapter selection
- `createBoundedUseStore`: Store creation helper for state management
- Chain-specific helpers and utilities

---

## ✨ How It Connects to the Ecosystem

The Orbit ecosystem consists of several packages:

- **`@tuwaio/orbit-core`:** The foundation providing core functionality
- **`@tuwaio/orbit-evm`:** EVM-specific helpers implementation
- **`@tuwaio/orbit-solana`:** Solana blockchain helpers

Each package serves a specific purpose while maintaining modularity and flexibility.

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
