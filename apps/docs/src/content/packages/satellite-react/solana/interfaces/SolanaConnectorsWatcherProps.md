# SolanaConnectorsWatcherProps

Defined in: [satellite-react/src/solana/SolanaConnectorsWatcher.tsx:12](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/solana/SolanaConnectorsWatcher.tsx#L12)

Props for the [SolanaConnectorsWatcher](/packages/satellite-react/solana/functions/SolanaConnectorsWatcher.md) component.

## Properties

### siwx?

> `optional` **siwx?**: [`SatelliteSiwxState`](/packages/satellite-core/interfaces/SatelliteSiwxState.md)

Defined in: [satellite-react/src/solana/SolanaConnectorsWatcher.tsx:17](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/solana/SolanaConnectorsWatcher.tsx#L17)

Optional Sign-In With X (SIWX) session state, for example the result of `useSiwxSession()` from
`@tuwaio/siwx-react`. The watcher runs again when one of its fields changes.
