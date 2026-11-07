# SatelliteSiwxState

Defined in: [types.ts:509](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L509)

SIWX (Sign-In With X) state read by the connection watchers (`createEVMConnectionsWatcher` from
`@tuwaio/satellite-evm`, `createSolanaConnectionsWatcher` from `@tuwaio/satellite-solana` and the React watcher
components). The result of `useSiwxSession()` from `@tuwaio/siwx-react` matches it.

The watchers disconnect the wallet when the user is not signed in and the sign-in was rejected or failed, and,
while the user is signed in, when the wallet switches to another account (EVM and Solana) or chain (EVM) than the
session. It is UI state: servers must verify the session themselves.

## Properties

### address?

> `optional` **address?**: `string`

Defined in: [types.ts:525](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L525)

Account of the session, as a CAIP-10 account ID (for example `eip155:1:0xAb…`) or a plain address. The watchers
read it with `parseCaip10AccountId` from `@tuwaio/orbit-core` and compare it case-insensitively for EVM and exactly
for Solana.

***

### chainId?

> `optional` **chainId?**: `string`

Defined in: [types.ts:530](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L530)

Chain of the session, as a CAIP-2 chain ID (for example `eip155:1`) or a chain number. Used for EVM only, read with
`toEvmChainId` from `@tuwaio/orbit-core`.

***

### enabled?

> `optional` **enabled?**: `boolean`

Defined in: [types.ts:511](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L511)

`false` turns off the disconnect after a rejected or failed sign-in. Defaults to enabled.

***

### isAuthenticated?

> `optional` **isAuthenticated?**: `boolean`

Defined in: [types.ts:515](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L515)

Same as `isSignedIn`; the name used by `useSiwxSession()` from `@tuwaio/siwx-react`.

***

### isRejected?

> `optional` **isRejected?**: `boolean`

Defined in: [types.ts:517](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L517)

Whether the sign-in was rejected or failed.

***

### isSignedIn?

> `optional` **isSignedIn?**: `boolean`

Defined in: [types.ts:513](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L513)

Whether the user is signed in.

***

### session?

> `optional` **session?**: \{ `address?`: `string`; `chainId?`: `string`; \} \| `null`

Defined in: [types.ts:532](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L532)

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

Defined in: [types.ts:519](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L519)

Sign-in status. `"error"` counts as a rejected sign-in.
