# SatelliteConnectProviderProps

Defined in: [satellite-react/src/providers/SatelliteConnectProvider.tsx:13](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L13)

Props of [SatelliteConnectProvider](/packages/satellite-react/react/functions/SatelliteConnectProvider.md): the store parameters (`adapter`, one adapter or an array, and the optional
`callbackAfterConnected`, see `SatelliteConnectStoreInitialParameters` from `@tuwaio/satellite-core`) plus the
fields below.

## Extends

- [`SatelliteConnectStoreInitialParameters`](/packages/satellite-core/type-aliases/SatelliteConnectStoreInitialParameters.md)\<[`Connector`](/packages/satellite-react/react/type-aliases/Connector.md), [`Connection`](/packages/satellite-react/react/type-aliases/Connection.md)\>

## Properties

### autoConnect?

> `optional` **autoConnect?**: `boolean`

Defined in: [satellite-react/src/providers/SatelliteConnectProvider.tsx:20](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L20)

Whether to reconnect the last connected wallet after a page load (read on the first render only). Defaults to
`false`. See `initializeAutoConnect` of the store.

***

### callbackAfterConnected?

> `optional` **callbackAfterConnected?**: [`ConnectedCallback`](/packages/satellite-core/type-aliases/ConnectedCallback.md)\<[`Connection`](/packages/satellite-react/react/type-aliases/Connection.md)\>

Defined in: [satellite-core/src/types.ts:338](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L338)

Runs after a new wallet is connected. See [ConnectedCallback](/packages/satellite-core/type-aliases/ConnectedCallback.md).

#### Inherited from

`SatelliteConnectStoreInitialParameters.callbackAfterConnected`

***

### children

> **children**: `ReactNode`

Defined in: [satellite-react/src/providers/SatelliteConnectProvider.tsx:15](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L15)

Components that can read the store.
