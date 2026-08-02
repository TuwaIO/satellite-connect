[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# EVMWatcherConfig

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:24](https://github.com/TuwaIO/satellite-connect/blob/258cbb671232d38bb23e4151bf5ebf573dc2fd3b/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L24)

Configuration interface for the EVM connections watcher.

## Properties

### siwe?

> `optional` **siwe?**: `object`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:28](https://github.com/TuwaIO/satellite-connect/blob/258cbb671232d38bb23e4151bf5ebf573dc2fd3b/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L28)

Optional Sign-In With Ethereum (SIWE) configuration

#### enabled

> **enabled**: `boolean`

Whether SIWE authentication is enabled

#### isRejected

> **isRejected**: `boolean`

Whether the user has rejected the SIWE signature request

#### isSignedIn

> **isSignedIn**: `boolean`

Whether the user is currently signed in via SIWE

***

### wagmiConfig

> **wagmiConfig**: `Config`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:26](https://github.com/TuwaIO/satellite-connect/blob/258cbb671232d38bb23e4151bf5ebf573dc2fd3b/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L26)

Wagmi configuration object required for connection monitoring
