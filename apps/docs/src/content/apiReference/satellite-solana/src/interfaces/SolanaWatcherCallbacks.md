[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# SolanaWatcherCallbacks

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:18](https://github.com/TuwaIO/satellite-connect/blob/6228cd5354f09757a95c77f65457dcbbc22226b4/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L18)

Callback functions interface for the Solana connections watcher.
These callbacks are used to interact with the global state store.

## Properties

### activeConnection

> **activeConnection**: [`SolanaConnection`](SolanaConnection.md) \| `undefined`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:20](https://github.com/TuwaIO/satellite-connect/blob/6228cd5354f09757a95c77f65457dcbbc22226b4/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L20)

The currently active Solana connection from the global store

***

### connectionError

> **connectionError**: `string` \| `undefined`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:24](https://github.com/TuwaIO/satellite-connect/blob/6228cd5354f09757a95c77f65457dcbbc22226b4/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L24)

Current connection error state, if any

***

### disconnect

> **disconnect**: (`connectorType`) => `void`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:22](https://github.com/TuwaIO/satellite-connect/blob/6228cd5354f09757a95c77f65457dcbbc22226b4/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L22)

Function to disconnect a specific connector type

#### Parameters

##### connectorType

`` `evm:${string}` `` \| `` `solana:${string}` `` \| `` `starknet:${string}` ``

#### Returns

`void`

***

### updateActiveConnection

> **updateActiveConnection**: (`connection`) => `void`

Defined in: [packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts:26](https://github.com/TuwaIO/satellite-connect/blob/6228cd5354f09757a95c77f65457dcbbc22226b4/packages/satellite-solana/src/utils/createSolanaConnectionsWatcher.ts#L26)

Function to update the active connection's properties

#### Parameters

##### connection

`Partial`\<[`SolanaConnection`](SolanaConnection.md)\>

#### Returns

`void`
