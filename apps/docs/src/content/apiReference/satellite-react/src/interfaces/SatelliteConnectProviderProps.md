[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SatelliteConnectProviderProps

Defined in: [packages/satellite-react/src/providers/SatelliteConnectProvider.tsx:11](https://github.com/TuwaIO/satellite-connect/blob/09041998720a3fee0000bf1a7833bb9031de54bc/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L11)

Props for SatelliteConnectProvider component

## Extends

- `SatelliteConnectStoreInitialParameters`\<[`Connector`](../type-aliases/Connector.md), [`Connection`](../type-aliases/Connection.md)\>

## Properties

### adapter

> **adapter**: `SatelliteAdapter`\<`never`, `never`\> \| `SatelliteAdapter`\<`never`, `never`\>[]

Defined in: node\_modules/.pnpm/@tuwaio+orbit-core@1.0.0-fix-errors-handling-alpha.1.d157b2c/node\_modules/@tuwaio/orbit-core/dist/index.d.ts:91

#### Inherited from

`SatelliteConnectStoreInitialParameters.adapter`

***

### autoConnect?

> `optional` **autoConnect**: `boolean`

Defined in: [packages/satellite-react/src/providers/SatelliteConnectProvider.tsx:15](https://github.com/TuwaIO/satellite-connect/blob/09041998720a3fee0000bf1a7833bb9031de54bc/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L15)

Whether to automatically connect to last used connector

***

### callbackAfterConnected?

> `optional` **callbackAfterConnected**: `ConnectedCallback`\<`never`\>

Defined in: packages/satellite-core/dist/index.d.ts:141

Optional callback executed after successful connection

#### Inherited from

`SatelliteConnectStoreInitialParameters.callbackAfterConnected`

***

### children

> **children**: `ReactNode`

Defined in: [packages/satellite-react/src/providers/SatelliteConnectProvider.tsx:13](https://github.com/TuwaIO/satellite-connect/blob/09041998720a3fee0000bf1a7833bb9031de54bc/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L13)

React child components
