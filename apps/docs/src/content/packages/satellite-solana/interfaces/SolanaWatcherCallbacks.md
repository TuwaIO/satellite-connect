# SolanaWatcherCallbacks

Defined in: [satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:22](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L22)

Store state and actions used by [createSolanaConnectionsWatcher](/packages/satellite-solana/functions/createSolanaConnectionsWatcher.md). Pass the store's `disconnect` and
`updateActiveConnection` and its `getState`. Instead of `getState` you can pass the current `activeConnection` and
`connectionError`.

## Properties

### activeConnection?

> `optional` **activeConnection?**: [`SolanaConnection`](/packages/satellite-solana/interfaces/SolanaConnection.md)

Defined in: [satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:24](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L24)

The active connection. Ignored when `getState` is passed.

***

### connectionError?

> `optional` **connectionError?**: `string` \| `TuwaErrorState`

Defined in: [satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:35](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L35)

The store's `connectionError`. While it is set, wallet changes are not copied to the store. Ignored when
`getState` is passed.

***

### disconnect

> **disconnect**: (`connectorType`) => `void`

Defined in: [satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:30](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L30)

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

Defined in: [satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:47](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L47)

Returns the current store state, for example the store's `getState`. It is called once per run.

#### Returns

The current `activeConnection` and `connectionError`.

##### activeConnection?

> `optional` **activeConnection?**: [`SolanaConnection`](/packages/satellite-solana/interfaces/SolanaConnection.md)

The active connection.

##### connectionError?

> `optional` **connectionError?**: `string` \| `TuwaErrorState`

The connection error.

***

### updateActiveConnection

> **updateActiveConnection**: (`connection`) => `void`

Defined in: [satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:41](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L41)

Merges fields into the active connection; the store's `updateActiveConnection`.

#### Parameters

##### connection

`Partial`\<[`SolanaConnection`](/packages/satellite-solana/interfaces/SolanaConnection.md)\>

Fields to merge.

#### Returns

`void`
