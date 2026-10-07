# EVMWatcherConfig

Defined in: [satellite-evm/src/utils/createEVMConnectionsWatcher.ts:58](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L58)

Configuration of [createEVMConnectionsWatcher](/packages/satellite-evm/functions/createEVMConnectionsWatcher.md).

## Properties

### ~~siwe?~~

> `optional` **siwe?**: `object`

Defined in: [satellite-evm/src/utils/createEVMConnectionsWatcher.ts:68](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L68)

Legacy SIWE state, used only when `siwx` is not passed.

#### ~~enabled?~~

> `optional` **enabled?**: `boolean`

`false` turns off the disconnect after a rejected sign-in.

#### ~~isRejected?~~

> `optional` **isRejected?**: `boolean`

Whether the sign-in was rejected.

#### ~~isSignedIn?~~

> `optional` **isSignedIn?**: `boolean`

Whether the user is signed in.

#### Deprecated

Pass `siwx` instead.

***

### siwx?

> `optional` **siwx?**: [`SatelliteSiwxState`](/packages/satellite-core/interfaces/SatelliteSiwxState.md)

Defined in: [satellite-evm/src/utils/createEVMConnectionsWatcher.ts:62](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L62)

Optional SIWX session state. See `SatelliteSiwxState` from `@tuwaio/satellite-core`.

***

### wagmiConfig

> **wagmiConfig**: `Config`

Defined in: [satellite-evm/src/utils/createEVMConnectionsWatcher.ts:60](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L60)

The wagmi config used by the EVM adapter. Its connections are watched.
