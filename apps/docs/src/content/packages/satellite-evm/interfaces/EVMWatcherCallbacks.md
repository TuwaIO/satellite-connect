# EVMWatcherCallbacks

Defined in: [satellite-evm/src/utils/createEVMConnectionsWatcher.ts:21](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L21)

Store state and actions used by [createEVMConnectionsWatcher](/packages/satellite-evm/functions/createEVMConnectionsWatcher.md). Pass the store's `disconnect` and
`updateActiveConnection` and its `getState`, so the watcher always reads the current state. Instead of `getState`
you can pass the current `activeConnection` and `connectionError`; they are then read once, when the watcher is
created.

## Properties

### activeConnection?

> `optional` **activeConnection?**: [`EVMConnection`](/packages/satellite-evm/interfaces/EVMConnection.md)

Defined in: [satellite-evm/src/utils/createEVMConnectionsWatcher.ts:23](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L23)

The active connection when the watcher is created. Ignored when `getState` is passed.

***

### connectionError?

> `optional` **connectionError?**: `string` \| `TuwaErrorState`

Defined in: [satellite-evm/src/utils/createEVMConnectionsWatcher.ts:34](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L34)

The store's `connectionError` when the watcher is created. While it is set, wallet changes are not copied to the
store. Ignored when `getState` is passed.

***

### disconnect

> **disconnect**: (`connectorType`) => `void`

Defined in: [satellite-evm/src/utils/createEVMConnectionsWatcher.ts:29](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L29)

Disconnects a connection; the store's `disconnect`.

#### Parameters

##### connectorType

`ConnectorType`

The connector to disconnect.

#### Returns

`void`

***

### getState?

> `optional` **getState?**: () => `object`

Defined in: [satellite-evm/src/utils/createEVMConnectionsWatcher.ts:47](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L47)

Returns the current store state, for example the store's `getState`. The watcher calls it when it starts and on
every wagmi event, so it does not have to be recreated when the active connection or the error changes.

#### Returns

The current `activeConnection` and `connectionError`.

##### activeConnection?

> `optional` **activeConnection?**: [`EVMConnection`](/packages/satellite-evm/interfaces/EVMConnection.md)

The active connection.

##### connectionError?

> `optional` **connectionError?**: `string` \| `TuwaErrorState`

The connection error.

***

### updateActiveConnection

> **updateActiveConnection**: (`connection`) => `void`

Defined in: [satellite-evm/src/utils/createEVMConnectionsWatcher.ts:40](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L40)

Merges fields into the active connection; the store's `updateActiveConnection`.

#### Parameters

##### connection

`Partial`\<[`EVMConnection`](/packages/satellite-evm/interfaces/EVMConnection.md)\>

Fields to merge.

#### Returns

`void`
