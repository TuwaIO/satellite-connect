# SatelliteSiwxState

Defined in: [types.ts:339](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L339)

SIWX (Sign-In With X) state read by the connection watchers (`createEVMConnectionsWatcher` from
`@tuwaio/satellite-evm`, `createSolanaConnectionsWatcher` from `@tuwaio/satellite-solana` and the React watcher
components). The result of `useSiwxSession()` from `@tuwaio/siwx-react` matches it.

The watchers disconnect the wallet when the user is not signed in and the sign-in was rejected or failed, and,
while the user is signed in, when the wallet switches to another account (EVM and Solana) or chain (EVM) than the
session. It is UI state: servers must verify the session themselves.

## Properties

### address?

> `optional` **address?**: `string`

Defined in: [types.ts:354](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L354)

Account of the session, as a CAIP-10 account ID (for example `eip155:1:0xAb…`) or a plain address. Compared
case-insensitively for EVM.

***

### chainId?

> `optional` **chainId?**: `string`

Defined in: [types.ts:356](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L356)

Chain of the session, as a CAIP-2 chain ID (for example `eip155:1`) or a chain reference. Used for EVM only.

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [types.ts:341](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L341)

`false` turns off the disconnect after a rejected or failed sign-in. Defaults to enabled.

***

### isAuthenticated?

> `optional` **isAuthenticated?**: `boolean`

Defined in: [types.ts:345](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L345)

Same as `isSignedIn`; the name used by `useSiwxSession()` from `@tuwaio/siwx-react`.

***

### isRejected?

> `optional` **isRejected?**: `boolean`

Defined in: [types.ts:347](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L347)

Whether the sign-in was rejected or failed.

***

### isSignedIn?

> `optional` **isSignedIn?**: `boolean`

Defined in: [types.ts:343](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L343)

Whether the user is signed in.

***

### session?

> `optional` **session?**: \{ `address?`: `string`; `chainId?`: `string`; \} \| `null`

Defined in: [types.ts:358](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L358)

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

Defined in: [types.ts:349](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L349)

Sign-in status. `"error"` counts as a rejected sign-in.
