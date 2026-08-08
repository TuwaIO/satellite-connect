[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# SatelliteSiwxState

Defined in: [packages/satellite-core/src/types.ts:162](https://github.com/TuwaIO/satellite-connect/blob/3b9b29dfeb0db3d935b54fec90e327942c962dcf/packages/satellite-core/src/types.ts#L162)

Unified Sign-In With X (SIWX) state interface for Satellite connection watchers.
Centralizes SIWX state definitions across satellite-evm, satellite-solana, and satellite-react.

## Properties

### address?

> `optional` **address?**: `string`

Defined in: [packages/satellite-core/src/types.ts:174](https://github.com/TuwaIO/satellite-connect/blob/3b9b29dfeb0db3d935b54fec90e327942c962dcf/packages/satellite-core/src/types.ts#L174)

Active session wallet address (CAIP-10 or raw hex)

***

### chainId?

> `optional` **chainId?**: `string`

Defined in: [packages/satellite-core/src/types.ts:176](https://github.com/TuwaIO/satellite-connect/blob/3b9b29dfeb0db3d935b54fec90e327942c962dcf/packages/satellite-core/src/types.ts#L176)

Active session chain identifier (CAIP-2 format, e.g. eip155:1 or solana:mainnet)

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:164](https://github.com/TuwaIO/satellite-connect/blob/3b9b29dfeb0db3d935b54fec90e327942c962dcf/packages/satellite-core/src/types.ts#L164)

Flag indicating if SIWX authentication flow is enabled

***

### isAuthenticated?

> `optional` **isAuthenticated?**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:168](https://github.com/TuwaIO/satellite-connect/blob/3b9b29dfeb0db3d935b54fec90e327942c962dcf/packages/satellite-core/src/types.ts#L168)

Alias for isSignedIn (direct compatibility with useSiwxSession from @tuwaio/siwx-react)

***

### isRejected?

> `optional` **isRejected?**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:170](https://github.com/TuwaIO/satellite-connect/blob/3b9b29dfeb0db3d935b54fec90e327942c962dcf/packages/satellite-core/src/types.ts#L170)

Flag indicating if the SIWX signature request was rejected or errored

***

### isSignedIn?

> `optional` **isSignedIn?**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:166](https://github.com/TuwaIO/satellite-connect/blob/3b9b29dfeb0db3d935b54fec90e327942c962dcf/packages/satellite-core/src/types.ts#L166)

Flag indicating if the user is currently signed in via SIWX

***

### session?

> `optional` **session?**: \{ `address?`: `string`; `chainId?`: `string`; \} \| `null`

Defined in: [packages/satellite-core/src/types.ts:178](https://github.com/TuwaIO/satellite-connect/blob/3b9b29dfeb0db3d935b54fec90e327942c962dcf/packages/satellite-core/src/types.ts#L178)

Session object (direct compatibility with useSiwxSession from @tuwaio/siwx-react)

***

### status?

> `optional` **status?**: `string`

Defined in: [packages/satellite-core/src/types.ts:172](https://github.com/TuwaIO/satellite-connect/blob/3b9b29dfeb0db3d935b54fec90e327942c962dcf/packages/satellite-core/src/types.ts#L172)

Current status string from session store
