# Satellite Connect Solana

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/satellite-solana.svg)](https://www.npmjs.com/package/@tuwaio/satellite-solana)
[![License](https://img.shields.io/npm/l/@tuwaio/satellite-solana.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

Low-level Solana wallet connectivity adapters and session watchers built strictly on top of `@solana/kit` primitives for the TUWA Ecosystem.

---

## 🏛️ What is `@tuwaio/satellite-solana`?

`@tuwaio/satellite-solana` is the low-level Solana network connection adapter (Layer 4) of the Satellite framework. It manages Solana provider registrations, signature subscription loops, and session tracking using `@solana/kit` and standard `@wallet-standard` interfaces.

This package facilitates decentralized connection orchestration by interacting directly with the browser or mobile wallet standards without external SaaS/WaaS SDK dependencies.

---

## ✨ Engineering Features

- **@solana/kit & Standard Primitives:** Integrates directly with `@wallet-standard/features` and the `@solana/kit` client engine.
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
pnpm add @tuwaio/satellite-solana @tuwaio/satellite-core @tuwaio/orbit-core @tuwaio/orbit-solana @solana/kit immer zustand wagmi/core @wallet-standard/app @wallet-standard/base @wallet-standard/features @wallet-standard/ui @wallet-standard/ui-registry
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

## 🔐 Sign-In With X (SIWX) Session Integration

The `SolanaConnectorsWatcher` component (and `createSolanaConnectionsWatcher`) accepts a `siwx` state directly compatible with `@tuwaio/siwx-react`. It monitors session status and automatically handles wallet disconnections if the user switches accounts or rejects signing:

```tsx
import { useSiwxSession } from '@tuwaio/siwx-react';
import { SatelliteConnectProvider } from '@tuwaio/satellite-react';
import { SolanaConnectorsWatcher } from '@tuwaio/satellite-react/solana';
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';

function AppProviders({ children }: { children: ReactNode }) {
  const siwxSession = useSiwxSession();

  return (
    <SatelliteConnectProvider adapter={satelliteSolanaAdapter({ rpcUrls: solanaRPCUrls })} autoConnect={true}>
      <SolanaConnectorsWatcher siwx={siwxSession} />
      {children}
    </SatelliteConnectProvider>
  );
}
```

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
