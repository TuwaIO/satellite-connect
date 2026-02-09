[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SolanaWatcherCallbacks

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:16](https://github.com/TuwaIO/satellite-connect/blob/a80143e55994ba10ebdcbc9213a0f098e5ef5a9d/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L16)

Callback functions interface for the Solana connections watcher.
These callbacks are used to interact with the global state store.

## Properties

### activeConnection

> **activeConnection**: [`SolanaConnection`](SolanaConnection.md) \| `undefined`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:18](https://github.com/TuwaIO/satellite-connect/blob/a80143e55994ba10ebdcbc9213a0f098e5ef5a9d/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L18)

The currently active Solana connection from the global store

***

### connectionError

> **connectionError**: `string` \| `undefined`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:22](https://github.com/TuwaIO/satellite-connect/blob/a80143e55994ba10ebdcbc9213a0f098e5ef5a9d/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L22)

Current connection error state, if any

***

### disconnect()

> **disconnect**: (`connectorType`) => `void`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:20](https://github.com/TuwaIO/satellite-connect/blob/a80143e55994ba10ebdcbc9213a0f098e5ef5a9d/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L20)

Function to disconnect a specific connector type

#### Parameters

##### connectorType

`` `evm:${string}` `` | `` `solana:${string}` `` | `` `starknet:${string}` ``

#### Returns

`void`

***

### updateActiveConnection()

> **updateActiveConnection**: (`connection`) => `void`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:24](https://github.com/TuwaIO/satellite-connect/blob/a80143e55994ba10ebdcbc9213a0f098e5ef5a9d/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L24)

Function to update the active connection's properties

#### Parameters

##### connection

`Partial`\<[`SolanaConnection`](SolanaConnection.md)\>

#### Returns

`void`
