[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# createEVMConnectionsWatcher()

> **createEVMConnectionsWatcher**(`config`, `callbacks`): () => `void`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:60](https://github.com/TuwaIO/satellite-connect/blob/ee39e42a749421c271c4b00d05d7771326a1ba35/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L60)

Creates and initializes an EVM connections watcher that monitors wagmi connection changes
and synchronizes them with the global state store.

This function provides a pure, framework-agnostic way to watch EVM connections
without being tied to React hooks or components.

## Parameters

### config

[`EVMWatcherConfig`](../interfaces/EVMWatcherConfig.md)

Configuration object containing wagmi config and optional SIWE settings

### callbacks

[`EVMWatcherCallbacks`](../interfaces/EVMWatcherCallbacks.md)

Callback functions for interacting with the global state

## Returns

A cleanup function to stop watching connections

() => `void`

## Example

```typescript
const unwatch = createEVMConnectionsWatcher(
  { wagmiConfig, siwe: { enabled: true, isSignedIn: true, isRejected: false } },
  { activeConnection, disconnect, connectionError, updateActiveConnection }
);

// Later, when you need to stop watching:
unwatch();
```
