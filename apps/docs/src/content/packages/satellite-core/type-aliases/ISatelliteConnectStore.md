# ISatelliteConnectStore\<C, W\>

> **ISatelliteConnectStore**\<`C`, `W`\> = `object`

Defined in: [types.ts:216](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L216)

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

Defined in: [types.ts:346](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L346)

The active connection, or `undefined` when no wallet is connected.

***

### connect

> **connect**: (`params`) => `Promise`\<`void`\>

Defined in: [types.ts:290](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L290)

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

Defined in: [types.ts:327](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L327)

`true` while `connect` is running.

***

### connectionError?

> `optional` **connectionError?**: `TuwaErrorState`

Defined in: [types.ts:338](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L338)

Error of the last failed `connect` or `disconnect`, normalized with `normalizeError` from `@tuwaio/orbit-core`.

***

### connections

> **connections**: `Record`\<`ConnectorType`, [`Connector`](/packages/satellite-core/type-aliases/Connector.md)\<`W`\>\>

Defined in: [types.ts:348](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L348)

All connected wallets by connector type. Several wallets can be connected at once; one of them is active.

***

### disconnect

> **disconnect**: (`connectorType?`) => `Promise`\<`void`\>

Defined in: [types.ts:300](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L300)

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

Defined in: [types.ts:310](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L310)

Disconnects every connection of the store through its adapter, then calls every adapter's `disconnect` without a
connection, so it also closes the other connections the adapters opened in this page (errors are ignored). Clears
the connections and errors and removes the impersonated address from `localStorage`. The last connection is kept,
so `initializeAutoConnect` can restore it. Use it for an explicit "disconnect all", such as a logout:
`initializeAutoConnect` does not call it.

#### Returns

`Promise`\<`void`\>

Resolves when done.

***

### disconnecting

> **disconnecting**: `boolean`

Defined in: [types.ts:329](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L329)

`true` while `disconnect` is running.

***

### getAdapter

> **getAdapter**: (`adapterKey`) => [`SatelliteAdapter`](/packages/satellite-core/type-aliases/SatelliteAdapter.md)\<`C`, `W`\> \| `undefined`

Defined in: [types.ts:225](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L225)

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

Defined in: [types.ts:231](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L231)

Lists the wallets every adapter can connect to right now.

#### Returns

`Partial`\<`Record`\<`OrbitAdapter`, `C`[]\>\>

Connectors by adapter key.

***

### initializeAutoConnect

> **initializeAutoConnect**: (`autoConnect`) => `Promise`\<`void`\>

Defined in: [types.ts:274](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L274)

Restores the connection after a page load. Call it once, on the client (`SatelliteConnectProvider` does).

Waits 300 ms, clears `connectionError` and `switchNetworkError`, removes the impersonated address from
`localStorage` and the entries older than 7 days from the recently connected list. It never asks a wallet that this
page does not hold to disconnect: wallets such as MetaMask revoke the site's permission for every tab of the origin,
which would drop the wallet in the other tabs and make the next restore prompt. Then:
- Inside Safe{Wallet}, with or without `autoConnect`, it disconnects the other connections this page holds (see
  below) and restores the Safe connector (`"evm:safe"`) after 100 ms: with the adapter's `reconnect`, or with
  `connect` when the adapter has no `reconnect` or it resolves to `undefined`. The app counts as running inside
  Safe{Wallet} when it is in an HTTPS iframe and the EVM adapter's `getSafeConnectorChainId` returns a chain ID
  (the Safe connector of wagmi gets it from the Safe{Wallet} parent window, whose origin must be allowed by its
  options, see `safeSdkOptions` from `@tuwaio/satellite-evm`).
- Otherwise, without `autoConnect`, it disconnects nothing and connects nothing.
- With `autoConnect`, it reads the last connection (from `sessionStorage` first, then `localStorage`) and
  disconnects the connections this page holds except the one of the last connected wallet: the connections of the
  store and those the adapters opened and list with `getLiveConnections` (for example the wallets an earlier store
  on the same adapters connected). Connections that the wallet library restored by itself (for example wagmi
  connections restored by `WagmiProvider`) are left as they are. Then it restores the last wallet after 100 ms,
  unless its wallet needs a user action to connect (impersonated, WalletConnect, Coinbase/Base Account, Bitget) or
  no adapter of its chain family is configured (another app on the same origin may have saved it); a live
  connection of such a last wallet is kept, but not added to the store.
  Before restoring, it waits up to 1.5 s for the adapter to list the wallet (Wallet Standard and EIP-6963 wallets
  register after the page loads; the connector type is derived from the connector `name`, as the adapters do, and
  an adapter with connectors without a `name` is not waited for). A wallet that does not appear (the extension was
  removed) is skipped without a `connectionError`: its last connection is removed from `localStorage` and
  `sessionStorage`, so later page loads do not wait for it, and it stays in the recently connected list. The
  wallet is restored with the adapter's `reconnect`, without a prompt, in the chain of the last connection; a
  wallet that no longer authorizes the app (locked, or the site was disconnected in the wallet) is skipped without
  a prompt and without a `connectionError`, and its last connection is kept for the next page load. An adapter
  without `reconnect` connects the wallet with `connect`, which may prompt. A restored wallet goes through the
  same steps as `connect` (contract check, `callbackAfterConnected`, last connection and recently connected list
  saved). Other wallets of the last session are not restored and stay authorized in their extensions; when the
  user picks one, it connects through the adapter's `connect`, which may show the wallet's prompt.

Sets `isAutoConnectFinished` to `false` when it starts and to `true` when it finishes. When calls overlap (React
Strict Mode runs effects twice in development), only the last one started sets it to `true`.

#### Parameters

##### autoConnect

`boolean`

Whether to restore the last connected wallet.

#### Returns

`Promise`\<`void`\>

Resolves when done.

#### Throws

Rejects only when `localStorage` cannot be accessed.

***

### isAutoConnectFinished

> **isAutoConnectFinished**: `boolean`

Defined in: [types.ts:336](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L336)

`false` until the last started `initializeAutoConnect` finishes (with or without a connection, also when it
rejects), then `true`. Until then, a missing `activeConnection` may still be restored: use this flag to tell a
wallet that is reconnecting after a page load from one that is not coming back. It stays `false` when
`initializeAutoConnect` is never called.

***

### rememberWallet

> **rememberWallet**: `boolean`

Defined in: [types.ts:318](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L318)

Whether the saved connection outlives the browser session: `true` keeps the last connection and the recent wallets
in `localStorage`, so `initializeAutoConnect` reconnects the wallet after any page load until it is disconnected;
`false` keeps them in `sessionStorage`, so the wallet is reconnected only until the tab closes. Starts as the
`rememberWallet` parameter (default `true`); `initializeAutoConnect` sets it to the choice the restored connection
was saved with.

***

### resetConnectionError

> **resetConnectionError**: () => `void`

Defined in: [types.ts:350](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L350)

Clears `connectionError`.

#### Returns

`void`

***

### resetSwitchNetworkError

> **resetSwitchNetworkError**: () => `void`

Defined in: [types.ts:380](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L380)

Clears `switchNetworkError`.

#### Returns

`void`

***

### setConnectionError

> **setConnectionError**: (`error`) => `void`

Defined in: [types.ts:344](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L344)

Sets `connectionError`, for example after a failed validation in your UI.

#### Parameters

##### error

`TuwaErrorState`

The error to show.

#### Returns

`void`

***

### setRememberWallet

> **setRememberWallet**: (`remember`) => `void`

Defined in: [types.ts:325](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L325)

Sets `rememberWallet`, for example from a "Remember this wallet" checkbox, and moves the saved active connection
and the recent entries of the connected wallets to the matching storage.

#### Parameters

##### remember

`boolean`

Keep the connection after the tab closes.

#### Returns

`void`

***

### switchConnection

> **switchConnection**: (`connectorType`) => `Promise`\<`void`\>

Defined in: [types.ts:367](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L367)

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

Defined in: [types.ts:376](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L376)

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

Defined in: [types.ts:378](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L378)

Error of the last failed `switchNetwork`, normalized with `normalizeError` from `@tuwaio/orbit-core`.

***

### updateActiveConnection

> **updateActiveConnection**: (`connector`) => `void`

Defined in: [types.ts:358](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L358)

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

Defined in: [types.ts:386](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L386)

Replaces the adapters and `callbackAfterConnected` used by later actions. The state is not reset.

#### Parameters

##### parameters

[`SatelliteConnectStoreInitialParameters`](/packages/satellite-core/type-aliases/SatelliteConnectStoreInitialParameters.md)\<`C`, `W`\>

New store parameters.

#### Returns

`void`
