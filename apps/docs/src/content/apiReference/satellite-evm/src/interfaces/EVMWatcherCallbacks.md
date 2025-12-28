[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# EVMWatcherCallbacks

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:10](https://github.com/TuwaIO/satellite-connect/blob/68d569285389df4b5cdc249ac5ba108cf2cf634f/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L10)

Callback functions interface for the EVM connections watcher.
These callbacks are used to interact with the global state store.

## Properties

### activeConnection

> **activeConnection**: [`EVMConnection`](EVMConnection.md) \| `undefined`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:12](https://github.com/TuwaIO/satellite-connect/blob/68d569285389df4b5cdc249ac5ba108cf2cf634f/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L12)

The currently active EVM connection from the global store

***

### connectionError

> **connectionError**: `string` \| `undefined`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:16](https://github.com/TuwaIO/satellite-connect/blob/68d569285389df4b5cdc249ac5ba108cf2cf634f/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L16)

Current connection error state, if any

***

### disconnect()

> **disconnect**: (`connectorType`) => `void`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:14](https://github.com/TuwaIO/satellite-connect/blob/68d569285389df4b5cdc249ac5ba108cf2cf634f/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L14)

Function to disconnect a specific connector type

#### Parameters

##### connectorType

`` `evm:${string}` `` | `` `solana:${string}` `` | `` `starknet:${string}` ``

#### Returns

`void`

***

### updateActiveConnection()

> **updateActiveConnection**: (`connection`) => `void`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:18](https://github.com/TuwaIO/satellite-connect/blob/68d569285389df4b5cdc249ac5ba108cf2cf634f/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L18)

Function to update the active connection's properties

#### Parameters

##### connection

`Partial`\<[`EVMConnection`](EVMConnection.md)\>

#### Returns

`void`
