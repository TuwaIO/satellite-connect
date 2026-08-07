# Satellite SIWE Next.js Auth

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/satellite-siwe-next-auth.svg)](https://www.npmjs.com/package/@tuwaio/satellite-siwe-next-auth)
[![License](https://img.shields.io/npm/l/@tuwaio/satellite-siwe-next-auth.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

Robust server-side session authentication adapter mapping cryptographic signatures to the SIWE standard and NextAuth.

> [!WARNING]
> **DEPRECATED**: This package is deprecated and will not receive further feature updates.
> Please migrate to [`@tuwaio/siwx-react`](https://www.npmjs.com/package/@tuwaio/siwx-react) and [`@tuwaio/siwx-server`](https://www.npmjs.com/package/@tuwaio/siwx-server) for CAIP-122 multi-chain authentication.

---

## 🏛️ What is `@tuwaio/satellite-siwe-next-auth`?

`@tuwaio/satellite-siwe-next-auth` implements the session authentication logic for the Satellite framework in Next.js App Router environments. It maps user-provided cryptographic signatures directly to the SIWE standard, bridging them to active application sessions.

By bypassing standard client-heavy authentication pipelines, this package utilizes server-encrypted **Iron Session** cookies to verify and enforce session state across API routes and Server Components.

Built on top of **Wagmi/Viem** for signature generation and verification.

---

## ✨ Key Features

- **Full App Router Support:** Provides a single-file API handler designed specifically for the Next.js `app/api/[...]/route.ts` pattern.
- **No NextAuth Dependency:** Uses the lightweight **Iron Session** for session encryption, eliminating compatibility issues with NextAuth.
- **Auto-Session Management:** Handles automatic re-authentication and session cleanup upon wallet disconnection or address/chain change.
- **Flexible Configuration:** Allows custom configuration of Iron Session settings (password, cookie name) and support for **Async Hooks** (e.g., `afterVerify`, `afterLogout`).

---

## 💾 Installation

### Requirements

- Node.js 20-24
- TypeScript 5.9+
- Wagmi v3+
- Viem v2+
- Iron Session v8+

> [!WARNING]  
> **DEPRECATED**: This package is deprecated and will be removed in a future release. Please migrate to `@tuwaio/siwx` for all Sign-In With X functionality.

```bash
# Using pnpm (recommended), but you can use npm, yarn or bun as well
pnpm add @tuwaio/satellite-siwe-next-auth siwe iron-session wagmi @wagmi/core viem
```

### Environment Setup

This package requires two **private** server environment variables for security:

| Variable              | Description                                                                                                                                    |
| :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| `SIWE_SESSION_SECRET` | **Required.** A cryptographically secure secret (minimum 32 characters) used by Iron Session to encrypt the session cookie.                    |
| `SIWE_SESSION_URL`    | **Required.** The full base URL of your application (e.g., `http://localhost:3000` or `https://myapp.com`). Used for SIWE domain verification. |

**Example `.env`:**

```env
SIWE_SESSION_SECRET="oowX51fBPYHSVQxPbktPrfM8Lb3Kbeg3oQ6aCKdeLLo="
SIWE_SESSION_URL="http://localhost:3000"
```

---

## 🚀 Quick Start

### 1. Server Setup (API Route)

Create the dynamic API route file at **`app/api/siwe/[...siwe]/route.ts`** and export the handler from the package. This handles `/login`, `/logout`, and `/session` requests.

```typescript
// app/api/siwe/[...siwe]/route.ts

import { createSiweApiHandler } from '@tuwaio/satellite-siwe-next-auth/server';

// Initialize the handler. Configuration is read from the .env file by default.
const siweApiHandler = createSiweApiHandler();

// Export the methods expected by Next.js App Router
export const { GET, POST, DELETE } = siweApiHandler;
```

### 2. Client Setup (Providers)

Wrap your application in the `SiweNextAuthProvider`. This provider manages the authentication state, session fetching, and handles auto-sign-out/re-authentication on wallet changes.

```tsx
// src/providers/Providers.tsx

'use client';

import { ReactNode, useState } from 'react';
import { WagmiProvider, createConfig, http } from 'wagmi';
import { mainnet, sepolia } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SiweNextAuthProvider } from '@tuwaio/satellite-siwe-next-auth';

// 1. Configure Wagmi
export const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// 2. Create Query Client
const queryClient = new QueryClient();

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* SiweNextAuthProvider must be inside Wagmi and QueryClient providers */}
        <SiweNextAuthProvider
          wagmiConfig={wagmiConfig}
          enabled={true}
          onSignOut={() => console.log('User signed out')}
          onSignIn={(session) => console.log('User signed in:', session)}
        >
          {children}
        </SiweNextAuthProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
```

### 3. Integrating with Satellite Connect

Use the `useSiweAuth` hook to integrate SIWE authentication into the `SatelliteConnectProvider`.

```tsx
// src/providers/SatelliteSiweProvider.tsx

'use client';

import { ReactNode } from 'react';
import { SatelliteConnectProvider, EVMConnectorsWatcher } from '@tuwaio/satellite-react';
import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
import { useSiweAuth } from '@tuwaio/satellite-siwe-next-auth';
import { wagmiConfig } from './Providers'; // Your Wagmi config

export function SatelliteSiweProvider({ children }: { children: ReactNode }) {
  // Get SIWE auth state and methods
  const { signInWithSiwe, enabled: siweEnabled, isSignedIn, isRejected } = useSiweAuth();

  return (
    <SatelliteConnectProvider
      // Pass the EVM adapter with SIWE integration
      adapter={satelliteEVMAdapter(
        wagmiConfig,
        wagmiConfig.chains as readonly [Chain, ...Chain[]],
        siweEnabled ? signInWithSiwe : undefined,
      )}
      autoConnect={true}
    >
      {/* EVMConnectorsWatcher handles disconnections and account changes */}
      <EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwe={{ isSignedIn, isRejected, enabled: siweEnabled }} />
      {children}
    </SatelliteConnectProvider>
  );
}
```

---

## ⚙️ Custom Configuration

The `createSiweApiHandler` accepts an optional configuration object to override session settings and define asynchronous hooks.

### Configuration Parameters (`SiweApiConfig` Type)

| Parameter               | Type                  | Default                                    | Description                                                                                             |
| :---------------------- | :-------------------- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------ |
| `session.password`      | `string`              | `SIWE_SESSION_SECRET`                      | Overrides the secret key for encryption.                                                                |
| `session.cookieName`    | `string`              | `'satellite_siwe'`                         | Overrides the name of the session cookie.                                                               |
| `session.cookieOptions` | `SiweCookieOptions`   | `{ maxAge: 30 days, secure: false (dev) }` | Allows overriding standard cookie settings (e.g., `maxAge`).                                            |
| `options.afterVerify`   | `() => Promise<void>` | `undefined`                                | Hook executed **after** the SIWE signature is cryptographically verified. Ideal for fetching user data. |
| `options.afterLogout`   | `() => Promise<void>` | `undefined`                                | Hook executed **after** the session cookie is destroyed.                                                |

### Example Custom Initialization

```typescript
// app/api/siwe/[...siwe]/route.ts

import { createSiweApiHandler } from '@tuwaio/satellite-siwe-next-auth/server';

const siweApiHandler = createSiweApiHandler({
  // Custom Session Settings
  session: {
    cookieName: 'my_app_session',
    cookieOptions: {
      maxAge: 60 * 60 * 24 * 7, // 7 days
    },
  },
  // Custom Hooks
  options: {
    afterVerify: async () => {
      // This logic runs on the server side after a valid signature is confirmed.
      console.log('User verified, ready to create DB record.');
    },
    afterLogout: () => {
      console.log('User session destroyed.');
    },
  },
});

export const { GET, POST, DELETE } = siweApiHandler;
```

---

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
