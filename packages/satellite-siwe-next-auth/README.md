# Satellite SIWE Next.js Auth

[![NPM Version](https://img.shields.io/npm/v/@tuwaio/satellite-siwe-next-auth.svg)](https://www.npmjs.com/package/@tuwaio/satellite-siwe-next-auth)
[![License](https://img.shields.io/npm/l/@tuwaio/satellite-siwe-next-auth.svg)](./LICENSE)
[![Build Status](https://img.shields.io/github/actions/workflow/status/TuwaIO/satellite-connect/release.yml?branch=main)](https://github.com/TuwaIO/satellite-connect/actions)

A robust connector module for enabling secure Web3 authentication (Sign-In with Ethereum, SIWE) in Next.js App Router using **Iron Session** for state management.

-----

## 🏛️ What is `@tuwaio/satellite-siwe-next-auth`?

`@tuwaio/satellite-siwe-next-auth` provides a secure, boilerplate-free solution for integrating **Sign-In with Ethereum (SIWE)** authentication into Next.js applications using the **App Router**.

It replaces the complexity of traditional NextAuth setup by leveraging **Iron Session** for robust, encrypted, server-side session management, ensuring a seamless and fully decentralized authentication experience.

Built on top of **Wagmi/Viem** for signature generation.

-----

## ✨ Key Features

- **Full App Router Support:** Provides a single-file API handler designed specifically for the Next.js `app/api/[...]/route.ts` pattern.
- **No NextAuth Dependency:** Uses the lightweight **Iron Session** for session encryption, eliminating compatibility issues with NextAuth.
- **Auto-Session Management:** Handles automatic re-authentication and session cleanup upon wallet disconnection or address/chain change.
- **Flexible Configuration:** Allows custom configuration of Iron Session settings (password, cookie name) and support for **Async Hooks** (e.g., `afterVerify`, `afterLogout`).

-----

## 💾 Installation

### Requirements

- Node.js 20+
- TypeScript 5.9+
- Wagmi v2+
- Viem v2+
- Iron Session v8+

```bash
# Using pnpm (recommended)
pnpm add @tuwaio/satellite-siwe-next-auth siwe iron-session wagmi viem

# Using npm
npm install @tuwaio/satellite-siwe-next-auth siwe iron-session wagmi viem
```

### Environment Setup

This package requires two **private** server environment variables for security:

| Variable | Description |
| :--- | :--- |
| `SIWE_SESSION_SECRET` | **Required.** A cryptographically secure secret (minimum 32 characters) used by Iron Session to encrypt the session cookie. |
| `SIWE_SESSION_URL` | **Required.** The full base URL of your application (e.g., `http://localhost:3000` or `https://myapp.com`). Used for SIWE domain verification. |

**Example `.env.local`:**

```env
SIWE_SESSION_SECRET="oowX51fBPYHSVQxPbktPrfM8Lb3Kbeg3oQ6aCKdeLLo="
SIWE_SESSION_URL="http://localhost:3000"
```

-----

## 🚀 Quick Start

### 1. Server Setup (API Route)

Create the dynamic API route file at **`src/api/siwe/[...siwe]/route.ts`** and export the handler from the package. This handles `/login`, `/logout`, and `/session` requests.

```typescript
// src/api/siwe/[...siwe]/route.ts

import { createSiweApiHandler } from '@tuwaio/satellite-siwe-next-auth/server';

// Initialize the handler. Configuration is read from the .env file by default.
const siweApiHandler = createSiweApiHandler();

// Export the methods expected by Next.js App Router
export const { GET, POST, DELETE } = siweApiHandler;
```

### 2. Client Setup (Provider)

Wrap your application in the `SiweNextAuthProvider`. This provider manages the authentication state, session fetching, and handles auto-sign-out/re-authentication on wallet changes.

```tsx
// src/providers/Providers.tsx

import { SiweNextAuthProvider } from '@tuwaio/satellite-siwe-next-auth';
// ... other imports (WagmiProvider, QueryClientProvider)

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {/* WAGMI AND REACT-QUERY MUST WRAP THE SIWE PROVIDER */}
        <SiweNextAuthProvider
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

### 3. Usage (Login Component)

Use the `useSiweAuth` hook to access the sign-in function and state.

```tsx
// src/components/WalletConnect.tsx

import { useSiweAuth } from '@tuwaio/satellite-siwe-next-auth';
// ... other imports (Wagmi hooks, etc.)

export function SatelliteConnectProviders({ children }: { children: React.ReactNode }) {
  const { signInWithSiwe, isSignedIn, isRejected, enabled } = useSiweAuth();
  
  // Example usage: Pass signInWithSiwe as the connection handler to a wallet adapter
  // The adapter will call signInWithSiwe() after a wallet connection is established.
  return (
    <SatelliteConnectProvider
      adapter={[
        // Pass signInWithSiwe to your EVM adapter
        satelliteEVMAdapter(wagmiConfig, enabled ? signInWithSiwe : undefined), 
        // ...
      ]}
      autoConnect={true}
    >
      {/* ... your components */}
    </SatelliteConnectProvider>
  );
}
```

-----

## ⚙️ Custom Configuration

The `createSiweApiHandler` accepts an optional configuration object to override session settings and define asynchronous hooks.

### Configuration Parameters (`SiweApiConfig` Type)

| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `session.password` | `string` | `SIWE_SESSION_SECRET` | Overrides the secret key for encryption. |
| `session.cookieName` | `string` | `'satellite_siwe'` | Overrides the name of the session cookie. |
| `session.cookieOptions` | `SiweCookieOptions` | `{ maxAge: 30 days, secure: false (dev) }` | Allows overriding standard cookie settings (e.g., `maxAge`). |
| `options.afterVerify` | `() => Promise<void>` | `undefined` | Hook executed **after** the SIWE signature is cryptographically verified. Ideal for fetching user data. |
| `options.afterLogout` | `() => Promise<void>` | `undefined` | Hook executed **after** the session cookie is destroyed. |

### Example Custom Initialization

```typescript
// src/api/siwe/[...siwe]/route.ts

import { createSiweApiHandler } from '@tuwaio/satellite-siwe-next-auth/server';

const siweApiHandler = createSiweApiHandler({
    // Custom Session Settings
    session: {
        cookieName: "my_app_session",
        cookieOptions: {
            maxAge: 60 * 60 * 24 * 7, // 7 days
        }
    },
    // Custom Hooks
    options: {
        afterVerify: async () => {
            // This logic runs on the server side after a valid signature is confirmed.
            console.log("User verified, ready to create DB record.");
        },
        afterLogout: () => {
            console.log("User session destroyed.");
        }
    }
});

export const { GET, POST, DELETE } = siweApiHandler;
```

-----

## 🤝 Contributing & Support

Contributions are welcome! Please read our main **[Contribution Guidelines](https://github.com/TuwaIO/workflows/blob/main/CONTRIBUTING.md)**.

If you find this library useful, please consider supporting its development. Every contribution helps!

[**➡️ View Support Options**](https://github.com/TuwaIO/workflows/blob/main/Donation.md)

## 📄 License

This project is licensed under the **Apache-2.0 License** - see the [LICENSE](./LICENSE) file for details.
