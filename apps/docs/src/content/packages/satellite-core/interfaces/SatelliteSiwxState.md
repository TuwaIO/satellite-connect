# SatelliteSiwxState

Defined in: [types.ts:350](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L350)

SIWX (Sign-In With X) state read by the connection watchers (`createEVMConnectionsWatcher` from
`@tuwaio/satellite-evm`, `createSolanaConnectionsWatcher` from `@tuwaio/satellite-solana` and the React watcher
components). The result of `useSiwxSession()` from `@tuwaio/siwx-react` matches it.

The watchers disconnect the wallet when the user is not signed in and the sign-in was rejected or failed, and,
while the user is signed in, when the wallet switches to another account (EVM and Solana) or chain (EVM) than the
session. It is UI state: servers must verify the session themselves.

## Properties

### address?

> `optional` **address?**: `string`

Defined in: [types.ts:365](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L365)

Account of the session, as a CAIP-10 account ID (for example `eip155:1:0xAb…`) or a plain address. Compared
case-insensitively for EVM.

***

### chainId?

> `optional` **chainId?**: `string`

Defined in: [types.ts:367](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L367)

Chain of the session, as a CAIP-2 chain ID (for example `eip155:1`) or a chain reference. Used for EVM only.

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [types.ts:352](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L352)

`false` turns off the disconnect after a rejected or failed sign-in. Defaults to enabled.

***

### isAuthenticated?

> `optional` **isAuthenticated?**: `boolean`

Defined in: [types.ts:356](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L356)

Same as `isSignedIn`; the name used by `useSiwxSession()` from `@tuwaio/siwx-react`.

***

### isRejected?

> `optional` **isRejected?**: `boolean`

Defined in: [types.ts:358](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L358)

Whether the sign-in was rejected or failed.

***

### isSignedIn?

> `optional` **isSignedIn?**: `boolean`

Defined in: [types.ts:354](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L354)

Whether the user is signed in.

***

### session?

> `optional` **session?**: \{ `address?`: `string`; `chainId?`: `string`; \} \| `null`

Defined in: [types.ts:369](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L369)

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

Defined in: [types.ts:360](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L360)

Sign-in status. `"error"` counts as a rejected sign-in.
