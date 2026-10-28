# SatelliteAdapter\<C, W\>

> **SatelliteAdapter**\<`C`, `W`\> = `BaseAdapter` & `object`

Defined in: [types.ts:81](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-core/src/types.ts#L81)

Contract of a chain adapter used by [createSatelliteConnectStore](/packages/satellite-core/functions/createSatelliteConnectStore.md). `satelliteEVMAdapter` from
`@tuwaio/satellite-evm` and `satelliteSolanaAdapter` from `@tuwaio/satellite-solana` implement it; implement it
yourself to add another chain family.

It extends `BaseAdapter` from `@tuwaio/orbit-core`: `getExplorerUrl(url?, chainId?)` returns an explorer link (or
`undefined`), and the optional `getName`, `getAvatar` and `getAddress` resolve names such as ENS or SNS.

## Type Parameters

### C

`C`

Type of the wallet connectors returned by `getConnectors` (for example a wagmi `Connector`).

### W

`W` *extends* [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md) = [`BaseConnector`](/packages/satellite-core/interfaces/BaseConnector.md)

Chain-specific connection type returned by `connect`.

## Type Declaration

### checkAndSwitchNetwork

> **checkAndSwitchNetwork**: (`chainId`, `currentChainId?`, `updateActiveConnector?`) => `Promise`\<`void`\>

Moves the connection to `chainId` when it is on another chain. EVM: asks the wallet to switch networks. Solana:
there is no wallet request; the connection's `chainId` and `rpcURL` are updated through `updateActiveConnector`.

#### Parameters

##### chainId

`string` \| `number`

Target chain.

##### currentChainId?

`string` \| `number`

Chain the connection is on now.

##### updateActiveConnector?

(`connector`) => `void`

Merges fields into the connection in the store.

#### Returns

`Promise`\<`void`\>

Resolves when the switch is done.

#### Throws

When the wallet rejects or cannot switch.

### checkIsContractAddress?

> `optional` **checkIsContractAddress?**: (`params`) => `Promise`\<`boolean`\>

Checks whether an address is a smart contract. The store calls it after every new connection and saves the
result in `isContractAddress`.

#### Parameters

##### params

Address and chain to check.

###### address

`string`

Account to check.

###### chainId

`string` \| `number`

Chain to check it on.

#### Returns

`Promise`\<`boolean`\>

`true` for a contract account.

### connect

> **connect**: (`params`) => `Promise`\<[`Connector`](/packages/satellite-core/type-aliases/Connector.md)\<`W`\>\>

Asks the wallet of `params.connectorType` to connect and returns the new connection. When the wallet library
already holds a connection of that wallet in this page (for example one an earlier store on the same adapter
opened), the adapter may take it over without a request; the EVM adapter does.

#### Parameters

##### params

Connection target.

###### chainId

`number` \| `string`

Chain to connect to: an EVM chain ID, or a Solana cluster as a moniker (`devnet`), a
Wallet Standard chain (`solana:devnet`) or a CAIP-2 chain ID with the genesis hash.

###### connectorType

`ConnectorType`

Connector to connect, for example `"evm:metamask"`.

#### Returns

`Promise`\<[`Connector`](/packages/satellite-core/type-aliases/Connector.md)\<`W`\>\>

The connection.

#### Throws

When no wallet matches `connectorType` or the wallet rejects the request.

### disconnect

> **disconnect**: (`activeConnector?`) => `Promise`\<`void`\>

Disconnects the wallet of `activeConnector`, or, when it is omitted, every connection this adapter object opened in
this page and has not disconnected (the connections `getLiveConnections` lists). Wallets this adapter did not
connect must not be asked to disconnect: wallets such as MetaMask revoke the site's permission for every tab of the
origin.

#### Parameters

##### activeConnector?

[`Connector`](/packages/satellite-core/type-aliases/Connector.md)\<`W`\>

The connection to disconnect.

#### Returns

`Promise`\<`void`\>

Resolves when the wallet has been asked to disconnect.

### getBalance

> **getBalance**: (`address`, `chainId`) => `Promise`\<\{ `symbol`: `string`; `value`: `string`; \}\>

Reads the native balance of an address over RPC.

#### Parameters

##### address

`string`

Account to read.

##### chainId

`number` \| `string`

Chain to read it on.

#### Returns

`Promise`\<\{ `symbol`: `string`; `value`: `string`; \}\>

The balance as a decimal string in whole units (for example `"1.5"`) and the currency symbol.

#### Throws

When the RPC request fails.

### getConnectors

> **getConnectors**: () => `object`

Lists the wallets this adapter can connect to right now.

#### Returns

The adapter key and its connectors.

##### adapter

> **adapter**: `OrbitAdapter`

The adapter key.

##### connectors

> **connectors**: `C`[]

The wallets available now.

### getLiveConnections?

> `optional` **getLiveConnections?**: () => `Promise`\<[`Connector`](/packages/satellite-core/type-aliases/Connector.md)\<`W`\>[]\>

Lists the connections this adapter object opened in this page (with `connect` or `reconnect`), that are still open
and that it has not disconnected. Stores that share one adapter object share these connections (a provider that
mounts again on the same adapters finds the wallets the earlier store connected). Connections that the wallet
library opened or restored by itself (for example the wagmi connections that `WagmiProvider` restores from the
wagmi storage), and those of other adapter objects or other tabs, are not listed. `initializeAutoConnect`
disconnects the listed connections except the last connected wallet; without this method it disconnects only the
connections of the store.

#### Returns

`Promise`\<[`Connector`](/packages/satellite-core/type-aliases/Connector.md)\<`W`\>[]\>

The connections, possibly empty.

### getSafeConnectorChainId?

> `optional` **getSafeConnectorChainId?**: () => `Promise`\<`number` \| `undefined`\>

Returns the chain of the Safe connector. `initializeAutoConnect` calls it when the app runs in an HTTPS iframe and
treats a chain ID as "inside Safe{Wallet}", so it must resolve to a chain ID only there; a rejection is treated
like `undefined`.

#### Returns

`Promise`\<`number` \| `undefined`\>

The chain ID, or `undefined` when there is no Safe connector.

### key

> **key**: `OrbitAdapter`

Chain family of the adapter. The store picks the adapter by the prefix of a `connectorType`.

### reconnect?

> `optional` **reconnect?**: (`params`) => `Promise`\<[`Connector`](/packages/satellite-core/type-aliases/Connector.md)\<`W`\> \| `undefined`\>

Restores the connection of a wallet that still authorizes the app, without a prompt: `initializeAutoConnect` uses
it for the last connected wallet (and inside Safe{Wallet} for the Safe connector) instead of `connect`. A wallet
that the wallet library already holds in this page is taken as it is. When the connection is on another chain
than `params.chainId`, the adapter may ask the wallet to switch; when it cannot switch, the connection stays on
its chain. Without this method, `initializeAutoConnect` calls `connect`, which may prompt.

#### Parameters

##### params

Connection target.

###### chainId

`number` \| `string`

Chain of the saved connection.

###### connectorType

`ConnectorType`

Connector to restore, for example `"evm:metamask"`.

#### Returns

`Promise`\<[`Connector`](/packages/satellite-core/type-aliases/Connector.md)\<`W`\> \| `undefined`\>

The connection, or `undefined` when the wallet does not authorize the app without a prompt (for example
a locked wallet, or a wallet in which the user disconnected the site).

#### Throws

When no wallet matches `connectorType` or the wallet fails for another reason.

### switchConnection?

> `optional` **switchConnection?**: (`connectorType`) => `Promise`\<`void`\>

Makes an already connected wallet the active one in the wallet library.

#### Parameters

##### connectorType

`ConnectorType`

Connector to activate.

#### Returns

`Promise`\<`void`\>

Resolves when the wallet is active.

#### Throws

When the connector is not found or cannot be activated.
