[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# EVMWatcherConfig

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:24](https://github.com/TuwaIO/satellite-connect/blob/37fae20045ef920c9be887de3328f1f6b04fb02d/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L24)

Configuration interface for the EVM connections watcher.

## Properties

### siwe?

> `optional` **siwe**: `object`

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:28](https://github.com/TuwaIO/satellite-connect/blob/37fae20045ef920c9be887de3328f1f6b04fb02d/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L28)

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

Defined in: [packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts:26](https://github.com/TuwaIO/satellite-connect/blob/37fae20045ef920c9be887de3328f1f6b04fb02d/packages/satellite-evm/src/utils/createEVMConnectionsWatcher.ts#L26)

Wagmi configuration object required for connection monitoring
