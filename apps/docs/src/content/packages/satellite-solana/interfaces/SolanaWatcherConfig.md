# SolanaWatcherConfig

Defined in: [satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:58](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L58)

Configuration of [createSolanaConnectionsWatcher](/packages/satellite-solana/functions/createSolanaConnectionsWatcher.md).

## Properties

### siwx?

> `optional` **siwx?**: [`SatelliteSiwxState`](/packages/satellite-core/interfaces/SatelliteSiwxState.md)

Defined in: [satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:62](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L62)

Optional SIWX session state. See `SatelliteSiwxState` from `@tuwaio/satellite-core`.

***

### wallets

> **wallets**: readonly `UiWallet`[]

Defined in: [satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:60](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L60)

The registered Wallet Standard wallets, for example from `useWallets()` of `@wallet-standard/react`.
