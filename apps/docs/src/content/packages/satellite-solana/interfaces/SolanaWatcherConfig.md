# SolanaWatcherConfig

Defined in: [satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:57](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L57)

Configuration of [createSolanaConnectionsWatcher](/packages/satellite-solana/functions/createSolanaConnectionsWatcher.md).

## Properties

### siwx?

> `optional` **siwx?**: [`SatelliteSiwxState`](/packages/satellite-core/interfaces/SatelliteSiwxState.md)

Defined in: [satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:61](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L61)

Optional SIWX session state. See `SatelliteSiwxState` from `@tuwaio/satellite-core`.

***

### wallets

> **wallets**: readonly `UiWallet`[]

Defined in: [satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:59](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L59)

The registered Wallet Standard wallets, for example from `useWallets()` of `@wallet-standard/react`.
