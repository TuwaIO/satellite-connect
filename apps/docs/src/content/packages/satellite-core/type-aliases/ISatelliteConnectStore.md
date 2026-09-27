# ISatelliteConnectStore\<C, W\>

> **ISatelliteConnectStore**\<`C`, `W`\> = `object`

Defined in: [types.ts:179](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L179)

State and actions of the store created by [createSatelliteConnectStore](/packages/satellite-core/functions/createSatelliteConnectStore.md).

`connect`, `disconnect`, `disconnectAll`, `switchConnection` and `switchNetwork` never reject: failures are stored in
`connectionError` or `switchNetworkError`, or logged to the console.

## Type Parameters

### C

`C`

Type of the wallet connectors of the adapters.

### W

`W` *extends* [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md) = [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md)

Chain-specific connection type.

## Properties

### activeConnection?

> `optional` **activeConnection?**: [`Connector`](/packages/satellite-core/type-aliases/Connector.md)\<`W`\>

Defined in: [types.ts:260](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L260)

The active connection, or `undefined` when no wallet is connected.

***

### connect

> **connect**: (`params`) => `Promise`\<`void`\>

Defined in: [types.ts:228](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L228)

Connects a wallet and makes it the active connection. When it is already connected, it only becomes active.

Sets `connecting`, calls the adapter's `connect` and `checkIsContractAddress` (on the chain the wallet is connected
to), awaits `callbackAfterConnected`, then saves the last connection (with that chain) and the recently connected
list to `localStorage`. Errors (including errors thrown
by `callbackAfterConnected`) are stored in `connectionError`. When no adapter of the connector's chain family (the
prefix of `connectorType`) is configured, no adapter is called and the error is
`No adapter found for connector type: <connectorType>`.

#### Parameters

##### params

Connection target.

###### chainId

`number` \| `string`

Chain to connect to.

###### connectorType

`ConnectorType`

Connector to connect, for example `"evm:metamask"`.

#### Returns

`Promise`\<`void`\>

Resolves when done; never rejects.

***

### connecting

> **connecting**: `boolean`

Defined in: [types.ts:248](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L248)

`true` while `connect` is running.

***

### connectionError?

> `optional` **connectionError?**: `TuwaErrorState`

Defined in: [types.ts:252](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L252)

Error of the last failed `connect` or `disconnect`, normalized with `normalizeError` from `@tuwaio/orbit-core`.

***

### connections

> **connections**: `Record`\<`ConnectorType`, [`Connector`](/packages/satellite-core/type-aliases/Connector.md)\<`W`\>\>

Defined in: [types.ts:262](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L262)

All connected wallets by connector type. Several wallets can be connected at once; one of them is active.

***

### disconnect

> **disconnect**: (`connectorType?`) => `Promise`\<`void`\>

Defined in: [types.ts:238](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L238)

Disconnects one wallet, or all wallets when `connectorType` is omitted. When the active wallet is disconnected
and others remain, the first remaining one becomes active. When no connection remains, the last connection and
the impersonated address are removed from `localStorage`; otherwise the active one is saved as the last
connection. Calls made while a disconnect is running are ignored.

#### Parameters

##### connectorType?

`ConnectorType`

Connector to disconnect.

#### Returns

`Promise`\<`void`\>

Resolves when done; never rejects.

***

### disconnectAll

> **disconnectAll**: () => `Promise`\<`void`\>

Defined in: [types.ts:246](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L246)

Asks every adapter to disconnect all its wallets (errors are ignored), clears the connections and errors, and
removes the impersonated address from `localStorage`. The last connection is kept, so `initializeAutoConnect` can
restore it.

#### Returns

`Promise`\<`void`\>

Resolves when done.

***

### disconnecting

> **disconnecting**: `boolean`

Defined in: [types.ts:250](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L250)

`true` while `disconnect` is running.

***

### getAdapter

> **getAdapter**: (`adapterKey`) => [`SatelliteAdapter`](/packages/satellite-core/type-aliases/SatelliteAdapter.md)\<`C`, `W`\> \| `undefined`

Defined in: [types.ts:188](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L188)

Returns the adapter for a chain family. With an array of adapters, the first one is returned (and a warning is
logged) when none has this key; a single adapter is returned for any key. `connect` and `initializeAutoConnect`
do not use this fallback.

#### Parameters

##### adapterKey

`OrbitAdapter`

Chain family.

#### Returns

[`SatelliteAdapter`](/packages/satellite-core/type-aliases/SatelliteAdapter.md)\<`C`, `W`\> \| `undefined`

The adapter, or `undefined` when the adapter array is empty.

***

### getConnectors

> **getConnectors**: () => `Partial`\<`Record`\<`OrbitAdapter`, `C`[]\>\>

Defined in: [types.ts:194](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L194)

Lists the wallets every adapter can connect to right now.

#### Returns

`Partial`\<`Record`\<`OrbitAdapter`, `C`[]\>\>

Connectors by adapter key.

***

### initializeAutoConnect

> **initializeAutoConnect**: (`autoConnect`) => `Promise`\<`void`\>

Defined in: [types.ts:212](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L212)

Restores the connection after a page load. Call it once, on the client (`SatelliteConnectProvider` does).

Waits 300 ms, calls `disconnectAll`, and removes entries older than 7 days from the recently connected list in
`localStorage`. Then:
- Inside Safe{Wallet}, with or without `autoConnect`, it connects the Safe connector (`"evm:safe"`) after 100 ms
  and stops. The app counts as running inside Safe{Wallet} when it is in an HTTPS iframe and the EVM adapter's
  `getSafeConnectorChainId` returns a chain ID (the Safe connector of wagmi gets it from the Safe{Wallet} parent
  window, whose origin must be allowed by its options, see `safeSdkOptions` from `@tuwaio/satellite-evm`).
- Otherwise, with `autoConnect`, it reads the last connection from `localStorage` and connects it again after
  100 ms, unless its wallet needs a user action to connect (impersonated, WalletConnect, Coinbase/Base Account,
  Bitget) or no adapter of its chain family is configured (another app on the same origin may have saved it).

#### Parameters

##### autoConnect

`boolean`

Whether to reconnect the last connected wallet.

#### Returns

`Promise`\<`void`\>

Resolves when done.

#### Throws

Rejects only when `localStorage` cannot be accessed.

***

### resetConnectionError

> **resetConnectionError**: () => `void`

Defined in: [types.ts:264](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L264)

Clears `connectionError`.

#### Returns

`void`

***

### resetSwitchNetworkError

> **resetSwitchNetworkError**: () => `void`

Defined in: [types.ts:294](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L294)

Clears `switchNetworkError`.

#### Returns

`void`

***

### setConnectionError

> **setConnectionError**: (`error`) => `void`

Defined in: [types.ts:258](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L258)

Sets `connectionError`, for example after a failed validation in your UI.

#### Parameters

##### error

`TuwaErrorState`

The error to show.

#### Returns

`void`

***

### switchConnection

> **switchConnection**: (`connectorType`) => `Promise`\<`void`\>

Defined in: [types.ts:281](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L281)

Makes a connected wallet the active connection (through the adapter's `switchConnection`) and saves it as the
last connection in `localStorage`. Does nothing, with a warning, when the connector is not connected; errors are
logged.

#### Parameters

##### connectorType

`ConnectorType`

Connector to activate.

#### Returns

`Promise`\<`void`\>

Resolves when done; never rejects.

***

### switchNetwork

> **switchNetwork**: (`chainId`, `connectorType?`) => `Promise`\<`void`\>

Defined in: [types.ts:290](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L290)

Moves a connection to another chain with the adapter's `checkAndSwitchNetwork`. Errors are stored in
`switchNetworkError`. Does nothing when there is no such connection.

#### Parameters

##### chainId

`string` \| `number`

Target chain.

##### connectorType?

`ConnectorType`

Connection to switch; the active connection when omitted.

#### Returns

`Promise`\<`void`\>

Resolves when done; never rejects.

***

### switchNetworkError?

> `optional` **switchNetworkError?**: `TuwaErrorState`

Defined in: [types.ts:292](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L292)

Error of the last failed `switchNetwork`, normalized with `normalizeError` from `@tuwaio/orbit-core`.

***

### updateActiveConnection

> **updateActiveConnection**: (`connector`) => `void`

Defined in: [types.ts:272](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L272)

Merges fields into the connection of `connector.connectorType`, or into the active connection when it is omitted.
Does nothing when that connector is not connected. When the active connection gets a new `chainId`, the last
connection in `localStorage` is updated. The connection watchers call it on wallet events.

#### Parameters

##### connector

`Partial`\<[`Connector`](/packages/satellite-core/type-aliases/Connector.md)\<`W`\>\>

Fields to merge.

#### Returns

`void`

***

### updateParameters

> **updateParameters**: (`parameters`) => `void`

Defined in: [types.ts:300](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L300)

Replaces the adapters and `callbackAfterConnected` used by later actions. The state is not reset.

#### Parameters

##### parameters

[`SatelliteConnectStoreInitialParameters`](/packages/satellite-core/type-aliases/SatelliteConnectStoreInitialParameters.md)\<`C`, `W`\>

New store parameters.

#### Returns

`void`
