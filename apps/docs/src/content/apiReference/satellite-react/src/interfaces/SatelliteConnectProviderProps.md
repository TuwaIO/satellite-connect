[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# SatelliteConnectProviderProps

Defined in: [packages/satellite-react/src/providers/SatelliteConnectProvider.tsx:11](https://github.com/TuwaIO/satellite-connect/blob/22adf069ed75795efa77b02fc7c5f28791f37973/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L11)

Props for SatelliteConnectProvider component

## Extends

- `SatelliteConnectStoreInitialParameters`\<[`Connector`](../type-aliases/Connector.md), [`Connection`](../type-aliases/Connection.md)\>

## Properties

### adapter

> **adapter**: `SatelliteAdapter`\<`any`, `BaseConnector`\> \| `SatelliteAdapter`\<`any`, `BaseConnector`\>[]

Defined in: node\_modules/.pnpm/@tuwaio+orbit-core@0.2.15/node\_modules/@tuwaio/orbit-core/dist/index.d.ts:91

#### Inherited from

`SatelliteConnectStoreInitialParameters.adapter`

***

### autoConnect?

> `optional` **autoConnect?**: `boolean`

Defined in: [packages/satellite-react/src/providers/SatelliteConnectProvider.tsx:15](https://github.com/TuwaIO/satellite-connect/blob/22adf069ed75795efa77b02fc7c5f28791f37973/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L15)

Whether to automatically connect to last used connector

***

### callbackAfterConnected?

> `optional` **callbackAfterConnected?**: `ConnectedCallback`\<`BaseConnector`\>

Defined in: packages/satellite-core/dist/index.d.ts:145

Optional callback executed after successful connection

#### Inherited from

`SatelliteConnectStoreInitialParameters.callbackAfterConnected`

***

### children

> **children**: `ReactNode`

Defined in: [packages/satellite-react/src/providers/SatelliteConnectProvider.tsx:13](https://github.com/TuwaIO/satellite-connect/blob/22adf069ed75795efa77b02fc7c5f28791f37973/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L13)

React child components
