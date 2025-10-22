[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SatelliteConnectProviderProps

Defined in: [packages/satellite-react/src/providers/SatelliteConnectProvider.tsx:11](https://github.com/TuwaIO/satellite-connect/blob/483d6c1ff113060fcb8ca14f8be3ed803d1078e7/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L11)

Props for SatelliteConnectProvider component

## Extends

- `SatelliteConnectStoreInitialParameters`\<[`Connector`](../type-aliases/Connector.md), [`Wallet`](../type-aliases/Wallet.md)\>

## Properties

### adapter

> **adapter**: `SatelliteAdapter`\<`never`, `never`\> \| `SatelliteAdapter`\<`never`, `never`\>[]

Defined in: node\_modules/.pnpm/@tuwaio+orbit-core@0.1.0/node\_modules/@tuwaio/orbit-core/dist/index.d.ts:91

#### Inherited from

`SatelliteConnectStoreInitialParameters.adapter`

***

### autoConnect?

> `optional` **autoConnect**: `boolean`

Defined in: [packages/satellite-react/src/providers/SatelliteConnectProvider.tsx:15](https://github.com/TuwaIO/satellite-connect/blob/483d6c1ff113060fcb8ca14f8be3ed803d1078e7/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L15)

Whether to automatically connect to last used wallet

***

### callbackAfterConnected?

> `optional` **callbackAfterConnected**: `WalletConnectedCallback`\<`never`\>

Defined in: packages/satellite-core/dist/index.d.ts:133

Optional callback executed after successful wallet connection

#### Inherited from

`SatelliteConnectStoreInitialParameters.callbackAfterConnected`

***

### children

> **children**: `ReactNode`

Defined in: [packages/satellite-react/src/providers/SatelliteConnectProvider.tsx:13](https://github.com/TuwaIO/satellite-connect/blob/483d6c1ff113060fcb8ca14f8be3ed803d1078e7/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L13)

React child components
