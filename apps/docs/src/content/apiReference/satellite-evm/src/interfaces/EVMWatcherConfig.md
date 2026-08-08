[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# EVMWatcherConfig

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:25](https://github.com/TuwaIO/satellite-connect/blob/6228cd5354f09757a95c77f65457dcbbc22226b4/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L25)

Configuration interface for the EVM connections watcher.

## Properties

### ~~siwe?~~

> `optional` **siwe?**: `object`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:31](https://github.com/TuwaIO/satellite-connect/blob/6228cd5354f09757a95c77f65457dcbbc22226b4/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L31)

#### ~~enabled?~~

> `optional` **enabled?**: `boolean`

#### ~~isRejected?~~

> `optional` **isRejected?**: `boolean`

#### ~~isSignedIn?~~

> `optional` **isSignedIn?**: `boolean`

#### Deprecated

Legacy SIWE prop alias for backwards compatibility

***

### siwx?

> `optional` **siwx?**: `SatelliteSiwxState`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:29](https://github.com/TuwaIO/satellite-connect/blob/6228cd5354f09757a95c77f65457dcbbc22226b4/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L29)

Optional Sign-In With X (SIWX) session state

***

### wagmiConfig

> **wagmiConfig**: `Config`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:27](https://github.com/TuwaIO/satellite-connect/blob/6228cd5354f09757a95c77f65457dcbbc22226b4/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L27)

Wagmi configuration object required for connection monitoring
