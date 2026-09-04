[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# createEVMConnectionsWatcher()

> **createEVMConnectionsWatcher**(`config`, `callbacks`): () => `void`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:65](https://github.com/TuwaIO/satellite-connect/blob/14a9f32627aa746db56b202f0e66e6d122b4003c/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L65)

Creates and initializes an EVM connections watcher that monitors wagmi connection changes
and synchronizes them with the global state store.

This function provides a pure, framework-agnostic way to watch EVM connections
without being tied to React hooks or components.

## Parameters

### config

[`EVMWatcherConfig`](../interfaces/EVMWatcherConfig.md)

Configuration object containing wagmi config and optional SIWX session settings

### callbacks

[`EVMWatcherCallbacks`](../interfaces/EVMWatcherCallbacks.md)

Callback functions for interacting with the global state

## Returns

A cleanup function to stop watching connections

() => `void`

## Example

```typescript
const unwatch = createEVMConnectionsWatcher(
  { wagmiConfig, siwx: { enabled: true, isSignedIn: true, isRejected: false } },
  { activeConnection, disconnect, connectionError, updateActiveConnection }
);

// Later, when you need to stop watching:
unwatch();
```

## Remarks

Evaluates session parity on account and network switches. If `siwx` is enabled and
the active session address or chainId does not match the newly connected wallet state,
it automatically triggers a `disconnect()` to prevent stale session attacks.
