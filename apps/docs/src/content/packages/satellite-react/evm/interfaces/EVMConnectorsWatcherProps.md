# EVMConnectorsWatcherProps

Defined in: [satellite-react/src/evm/EVMConnectorsWatcher.tsx:12](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/evm/EVMConnectorsWatcher.tsx#L12)

Props for the [EVMConnectorsWatcher](/packages/satellite-react/evm/functions/EVMConnectorsWatcher.md) component.

## Properties

### ~~siwe?~~

> `optional` **siwe?**: `object`

Defined in: [satellite-react/src/evm/EVMConnectorsWatcher.tsx:30](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/evm/EVMConnectorsWatcher.tsx#L30)

Legacy SIWE state, used only when `siwx` is not passed.

#### ~~enabled?~~

> `optional` **enabled?**: `boolean`

Whether sign-in is enabled. `false` turns off the disconnect on rejection.

#### ~~isRejected?~~

> `optional` **isRejected?**: `boolean`

Whether the user rejected the sign-in or it failed.

#### ~~isSignedIn?~~

> `optional` **isSignedIn?**: `boolean`

Whether the user is signed in.

#### Deprecated

Pass `siwx` instead.

***

### siwx?

> `optional` **siwx?**: [`SatelliteSiwxState`](/packages/satellite-core/interfaces/SatelliteSiwxState.md)

Defined in: [satellite-react/src/evm/EVMConnectorsWatcher.tsx:23](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/evm/EVMConnectorsWatcher.tsx#L23)

Optional Sign-In With X (SIWX) session state, for example the result of `useSiwxSession()` from
`@tuwaio/siwx-react`. The watcher is restarted when one of its fields changes.

***

### wagmiConfig

> **wagmiConfig**: `Config`

Defined in: [satellite-react/src/evm/EVMConnectorsWatcher.tsx:17](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/evm/EVMConnectorsWatcher.tsx#L17)

The wagmi `Config` from `@wagmi/core` that the EVM adapter uses. Its connections are watched with
`watchConnections`.
