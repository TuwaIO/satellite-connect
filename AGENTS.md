# 🤖 Agent Context: Satellite Connect

## 1. Project Philosophy & Goal

- **What is this?** A monorepo for "Satellite Connect" — a headless state management system for Web3 wallet connections. It provides a unified, UI-agnostic interface for interacting with EVM and Solana blockchains.
- **Role in TUWA:** The "Satellite" layer. It manages wallet connectivity, state, and authentication (SIWE) independently of the UI, serving as the bridge between user wallets and dApps.
- **Philosophy:** "Pure Web3", Headless, Self-Custody, Minimal Dependencies. Use standards (SIWE, Wallet Standard) over proprietary methods.

## 2. Tech Stack (Verified)

- **Core:** TypeScript v5.9+, Node.js, pnpm v10+ (Workspace).
- **State Management:** `zustand` v5.x (with `immer` middleware).
- **Web3 (EVM):** `viem` v2.x, `@wagmi/core` v3.x.
- **Web3 (Solana):** `gill` v0.14+ (formerly `rpc-helpers`), `@wallet-standard/*`.
- **Auth:** `siwe` v3.x, `iron-session` v8.x (for SIWE integration).
- **Frameworks:**
  - `apps/docs`: Next.js v16, Nextra v4, Tailwind CSS v4.
  - `packages/*`: Framework Agnostic (React adapter available as `@tuwaio/satellite-react`).
- **Build/Monorepo:**
  - `tsup`: Bundler for `packages/*` (ESM/CJS/DTS).
  - `release-please`: Semantic release management.

## 3. Architecture & Directory Structure

The project is a **pnpm workspace** separating core logic, chain adapters, and framework integrations.

```
satellite-connect/
├── apps/
│   └── docs/                   # Documentation site (Nextjs 16 + Nextra 4)
│       └── src/pages/          # Documentation content (Nextra)
├── packages/
│   ├── satellite-core/         # The Brain. Universal Interface & State.
│   │   ├── src/store/          # Zustand store with Immer middleware
│   │   └── src/types.ts        # Core Type Definitions
│   ├── satellite-evm/          # The Muscle (EVM).
│   │   ├── src/evm/            # EVM Logic & Wagmi Config
│   │   └── src/providers/      # Wagmi Provider Wrappers
│   ├── satellite-solana/       # The Muscle (Solana).
│   │   ├── src/adapters/       # Wallet Standard Adapters
│   │   └── src/utils/          # Gill/Wallet Standard helpers
│   ├── satellite-react/        # React Integration.
│   │   ├── src/hooks/          # React Hooks (useConnect, etc.)
│   │   └── src/providers/      # Context Providers
│   └── satellite-siwe-next-auth/ # Authentication Module.
│       ├── src/server/         # Server-side SIWE logic (Iron Session)
│       └── src/hooks/          # Client-side Auth Hooks
├── package.json                # Root checks & scripts
└── pnpm-workspace.yaml         # Workspace definition
```

### Module Breakdown

- **`satellite-core`**: Contains the central `zustand` store. It defines how the wallet state (connected address, chain ID, status) is mutated and accessed.
- **`satellite-evm`**: Implements the EVM connection logic using `wagmi` and `viem`.
- **`satellite-solana`**: Implements the Solana connection logic using `gill` and `@wallet-standard`.
- **`satellite-siwe-next-auth`**: Provides secure "Sign-In with Ethereum" authentication flow for Next.js applications, utilizing `iron-session` for stateless session management.

## 4. Coding Standards (STRICT)

- **Language:** English ONLY (Code, Comments, Commits).
- **Style:** Functional programming. Immutable state updates via `immer`.
- **Types:** Strict TypeScript. **NO `any`**. Usage of `ts-expect-error` must be justified.
- **Comments:** JSDoc required for **all** exported functions in `packages/*/src`.
  - Must explain _inputs_, _outputs_, and _side effects_.
- **Naming:**
  - Files: `camelCase.ts` (utils, hooks), `PascalCase.tsx` (components).
  - Variables/Functions: `camelCase`.
  - Types/Interfaces: `PascalCase`.

## 5. Key Workflows

- **Build:** `pnpm build` (Runs `pnpm --filter "./packages/**" build` -> `tsup`).
- **Test:** `pnpm test` (Runs `vitest` in isolated packages).
- **Lint:** `pnpm lint` (ESLint)
- **Format:** `pnpm format` (Prettier).
- **Clean:** `pnpm clean` (Removes `node_modules` and `dist` dirs).

## 6. AI Agent Behavior (Mandatory)

- **Post-Work Routine:** After generating or modifying code, you **MUST** run `pnpm lint --fix` (and `pnpm format`) to ensure code quality.
- **Dependency Rule:** Never install new packages without explicit user permission.
- **Hallucination Check:**
  - Do **NOT** import `ethers.js` (We use `viem`).
  - Do **NOT** import `@solana/web3.js` legacy methods (We use `gill` and `@wallet-standard`).
  - Do **NOT** import `next-auth` (We use `iron-session` + `siwe` manual integration in `satellite-siwe-next-auth`).
