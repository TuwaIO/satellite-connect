[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# SolanaWatcherCallbacks

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:19](https://github.com/TuwaIO/satellite-connect/blob/2c21a9769a545a040d3a9c69ab8d5776bece2752/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L19)

Callback functions interface for the Solana connections watcher.
These callbacks are used to interact with the global state store.

## Properties

### activeConnection

> **activeConnection**: [`SolanaConnection`](SolanaConnection.md) \| `undefined`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:21](https://github.com/TuwaIO/satellite-connect/blob/2c21a9769a545a040d3a9c69ab8d5776bece2752/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L21)

The currently active Solana connection from the global store

***

### connectionError

> **connectionError**: `string` \| `undefined`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:25](https://github.com/TuwaIO/satellite-connect/blob/2c21a9769a545a040d3a9c69ab8d5776bece2752/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L25)

Current connection error state, if any

***

### disconnect

> **disconnect**: (`connectorType`) => `void`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:23](https://github.com/TuwaIO/satellite-connect/blob/2c21a9769a545a040d3a9c69ab8d5776bece2752/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L23)

Function to disconnect a specific connector type

#### Parameters

##### connectorType

`` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

#### Returns

`void`

***

### updateActiveConnection

> **updateActiveConnection**: (`connection`) => `void`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:27](https://github.com/TuwaIO/satellite-connect/blob/2c21a9769a545a040d3a9c69ab8d5776bece2752/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L27)

Function to update the active connection's properties

#### Parameters

##### connection

`Partial`\<[`SolanaConnection`](SolanaConnection.md)\>

#### Returns

`void`
