[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# createSolanaConnectionsWatcher()

> **createSolanaConnectionsWatcher**(`config`, `callbacks`): () => `void`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:63](https://github.com/TuwaIO/satellite-connect/blob/22adf069ed75795efa77b02fc7c5f28791f37973/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L63)

Creates and initializes a Solana connections watcher that monitors wallet standard changes
and synchronizes them with the global state store.

## Parameters

### config

[`SolanaWatcherConfig`](../interfaces/SolanaWatcherConfig.md)

Configuration object containing wallets array and optional SIWX settings

### callbacks

[`SolanaWatcherCallbacks`](../interfaces/SolanaWatcherCallbacks.md)

Callback functions for interacting with the global state

## Returns

A cleanup function to stop watching connections

() => `void`

## Example

```typescript
const unwatch = createSolanaConnectionsWatcher(
  { wallets, siwx: { enabled: true, isSignedIn: true, address: '5eykt4UsFv8P8NJdTREpY1vzqKqZKvdpKuc147dw2N9d' } },
  { activeConnection, disconnect, connectionError, updateActiveConnection }
);

// Unsubscribe when unmounting
unwatch();
```

## Remarks

Evaluates session parity on Solana wallet account changes. If `siwx` is enabled and
the active session address does not match the newly selected account address,
it automatically triggers a `disconnect()` to protect session boundaries.
