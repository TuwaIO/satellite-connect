[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# createSolanaConnectionsWatcher()

> **createSolanaConnectionsWatcher**(`config`, `callbacks`): () => `void`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:66](https://github.com/TuwaIO/satellite-connect/blob/7f7b46da9477d72f17c5cd560cd8fa30754245f4/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L66)

Creates and initializes a Solana connections watcher that monitors wallet standard changes
and synchronizes them with the global state store.

This function provides a pure, framework-agnostic way to watch Solana wallet connections
without being tied to React hooks or components.

Unlike EVM connections, Solana uses the Wallet Standard which doesn't provide
native watchers, so this function implements the watching logic directly.

## Parameters

### config

[`SolanaWatcherConfig`](../interfaces/SolanaWatcherConfig.md)

Configuration object containing wallets array from Wallet Standard

### callbacks

[`SolanaWatcherCallbacks`](../interfaces/SolanaWatcherCallbacks.md)

Callback functions for interacting with the global state

## Returns

A cleanup function to stop watching connections (currently a no-op as Wallet Standard doesn't provide native watchers)

() => `void`

## Example

```typescript
const unwatch = createSolanaConnectionsWatcher(
  { wallets },
  { activeConnection, disconnect, connectionError, updateActiveConnection }
);

// Later, when you need to stop watching (currently no cleanup needed):
unwatch();
```

## Remarks

The Solana watcher works differently from the EVM watcher because:
- It relies on the Wallet Standard's wallets array changes
- It doesn't have native connection event listeners like wagmi
- The watching is done by comparing wallet state changes in the wallets array
