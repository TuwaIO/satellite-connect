[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# EVMWatcherCallbacks

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:11](https://github.com/TuwaIO/satellite-connect/blob/6228cd5354f09757a95c77f65457dcbbc22226b4/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L11)

Callback functions interface for the EVM connections watcher.
These callbacks are used to interact with the global state store.

## Properties

### activeConnection

> **activeConnection**: [`EVMConnection`](EVMConnection.md) \| `undefined`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:13](https://github.com/TuwaIO/satellite-connect/blob/6228cd5354f09757a95c77f65457dcbbc22226b4/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L13)

The currently active EVM connection from the global store

***

### connectionError

> **connectionError**: `string` \| `undefined`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:17](https://github.com/TuwaIO/satellite-connect/blob/6228cd5354f09757a95c77f65457dcbbc22226b4/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L17)

Current connection error state, if any

***

### disconnect

> **disconnect**: (`connectorType`) => `void`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:15](https://github.com/TuwaIO/satellite-connect/blob/6228cd5354f09757a95c77f65457dcbbc22226b4/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L15)

Function to disconnect a specific connector type

#### Parameters

##### connectorType

`` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

#### Returns

`void`

***

### updateActiveConnection

> **updateActiveConnection**: (`connection`) => `void`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:19](https://github.com/TuwaIO/satellite-connect/blob/6228cd5354f09757a95c77f65457dcbbc22226b4/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L19)

Function to update the active connection's properties

#### Parameters

##### connection

`Partial`\<[`EVMConnection`](EVMConnection.md)\>

#### Returns

`void`
