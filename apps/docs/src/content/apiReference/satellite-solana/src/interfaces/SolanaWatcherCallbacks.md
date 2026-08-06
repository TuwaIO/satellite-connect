[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# SolanaWatcherCallbacks

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:17](https://github.com/TuwaIO/satellite-connect/blob/4507c0660975dc03feb11b4ff14b744b072de0ae/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L17)

Callback functions interface for the Solana connections watcher.
These callbacks are used to interact with the global state store.

## Properties

### activeConnection

> **activeConnection**: [`SolanaConnection`](SolanaConnection.md) \| `undefined`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:19](https://github.com/TuwaIO/satellite-connect/blob/4507c0660975dc03feb11b4ff14b744b072de0ae/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L19)

The currently active Solana connection from the global store

***

### connectionError

> **connectionError**: `string` \| `undefined`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:23](https://github.com/TuwaIO/satellite-connect/blob/4507c0660975dc03feb11b4ff14b744b072de0ae/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L23)

Current connection error state, if any

***

### disconnect

> **disconnect**: (`connectorType`) => `void`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:21](https://github.com/TuwaIO/satellite-connect/blob/4507c0660975dc03feb11b4ff14b744b072de0ae/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L21)

Function to disconnect a specific connector type

#### Parameters

##### connectorType

`` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

#### Returns

`void`

***

### updateActiveConnection

> **updateActiveConnection**: (`connection`) => `void`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:25](https://github.com/TuwaIO/satellite-connect/blob/4507c0660975dc03feb11b4ff14b744b072de0ae/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L25)

Function to update the active connection's properties

#### Parameters

##### connection

`Partial`\<[`SolanaConnection`](SolanaConnection.md)\>

#### Returns

`void`
