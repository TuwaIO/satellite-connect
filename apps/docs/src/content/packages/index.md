# Packages

Satellite Connect ships one chain-agnostic core package (**L3**) and three **L4** packages: one adapter per chain platform (EVM, Solana), built on the core, and React bindings for the core store. Install the core and only the L4 packages your app needs. All packages declare their Web3 and state libraries as peer dependencies, so your app keeps a single copy of `zustand`, `immer`, `viem`, `@wagmi/core`, `@solana/kit` or `react`.

Each package page starts with the package README (the same text that is published to npm), followed by the full list of its exports. Every function, type and constant page is generated from the TypeScript source and its JSDoc, so the reference always matches the released code. `@tuwaio/satellite-react` has three entry points (`@tuwaio/satellite-react`, `@tuwaio/satellite-react/evm` and `@tuwaio/satellite-react/solana`), documented as separate modules.

## Packages

- [@tuwaio/satellite-core](/packages/satellite-core)
- [@tuwaio/satellite-evm](/packages/satellite-evm)
- [@tuwaio/satellite-react](/packages/satellite-react)
- [@tuwaio/satellite-solana](/packages/satellite-solana)
