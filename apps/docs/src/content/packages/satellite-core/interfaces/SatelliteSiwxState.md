# SatelliteSiwxState

Defined in: [types.ts:353](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L353)

SIWX (Sign-In With X) state read by the connection watchers (`createEVMConnectionsWatcher` from
`@tuwaio/satellite-evm`, `createSolanaConnectionsWatcher` from `@tuwaio/satellite-solana` and the React watcher
components). The result of `useSiwxSession()` from `@tuwaio/siwx-react` matches it.

The watchers disconnect the wallet when the user is not signed in and the sign-in was rejected or failed, and,
while the user is signed in, when the wallet switches to another account (EVM and Solana) or chain (EVM) than the
session. It is UI state: servers must verify the session themselves.

## Properties

### address?

> `optional` **address?**: `string`

Defined in: [types.ts:369](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L369)

Account of the session, as a CAIP-10 account ID (for example `eip155:1:0xAb…`) or a plain address. The watchers
read it with `parseCaip10AccountId` from `@tuwaio/orbit-core` and compare it case-insensitively for EVM and exactly
for Solana.

***

### chainId?

> `optional` **chainId?**: `string`

Defined in: [types.ts:374](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L374)

Chain of the session, as a CAIP-2 chain ID (for example `eip155:1`) or a chain number. Used for EVM only, read with
`toEvmChainId` from `@tuwaio/orbit-core`.

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [types.ts:355](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L355)

`false` turns off the disconnect after a rejected or failed sign-in. Defaults to enabled.

***

### isAuthenticated?

> `optional` **isAuthenticated?**: `boolean`

Defined in: [types.ts:359](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L359)

Same as `isSignedIn`; the name used by `useSiwxSession()` from `@tuwaio/siwx-react`.

***

### isRejected?

> `optional` **isRejected?**: `boolean`

Defined in: [types.ts:361](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L361)

Whether the sign-in was rejected or failed.

***

### isSignedIn?

> `optional` **isSignedIn?**: `boolean`

Defined in: [types.ts:357](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L357)

Whether the user is signed in.

***

### session?

> `optional` **session?**: \{ `address?`: `string`; `chainId?`: `string`; \} \| `null`

Defined in: [types.ts:376](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L376)

Session with `address` and `chainId`, used when the top-level fields are missing.

#### Union Members

##### Type Literal

\{ `address?`: `string`; `chainId?`: `string`; \}

##### address?

> `optional` **address?**: `string`

Account of the session.

##### chainId?

> `optional` **chainId?**: `string`

Chain of the session.

***

`null`

***

### status?

> `optional` **status?**: `string`

Defined in: [types.ts:363](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L363)

Sign-in status. `"error"` counts as a rejected sign-in.
