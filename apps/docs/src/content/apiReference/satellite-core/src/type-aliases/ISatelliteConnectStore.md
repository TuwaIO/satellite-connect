[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# ISatelliteConnectStore

> **ISatelliteConnectStore** = `object`

Defined in: [packages/satellite-core/src/types.ts:131](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-core/src/types.ts#L131)

Store interface for managing wallet connections

## Properties

### activeWallet?

> `optional` **activeWallet**: [`Wallet`](Wallet.md)

Defined in: [packages/satellite-core/src/types.ts:157](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-core/src/types.ts#L157)

Currently connected wallet

***

### availableConnectors

> **availableConnectors**: `Partial`\<`Record`\<`OrbitAdapter`, [`Connector`](Connector.md)[]\>\>

Defined in: [packages/satellite-core/src/types.ts:139](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-core/src/types.ts#L139)

Available connectors mapped by adapter type

***

### connect()

> **connect**: (`{ walletType, chainId }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:145](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-core/src/types.ts#L145)

Connects to specified wallet

#### Parameters

##### \{ walletType, chainId \}

###### chainId

`number` \| `string`

###### walletType

[`WalletType`](WalletType.md)

#### Returns

`Promise`\<`void`\>

***

### disconnect()

> **disconnect**: () => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:148](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-core/src/types.ts#L148)

Disconnects active wallet

#### Returns

`Promise`\<`void`\>

***

### getAdapter()

> **getAdapter**: () => [`SatelliteAdapter`](SatelliteAdapter.md) \| [`SatelliteAdapter`](SatelliteAdapter.md)[]

Defined in: [packages/satellite-core/src/types.ts:133](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-core/src/types.ts#L133)

Returns configured adapter(s)

#### Returns

[`SatelliteAdapter`](SatelliteAdapter.md) \| [`SatelliteAdapter`](SatelliteAdapter.md)[]

***

### initializeAppConnectors()

> **initializeAppConnectors**: (`{ autoConnect }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:142](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-core/src/types.ts#L142)

Initializes wallet connectors

#### Parameters

##### \{ autoConnect \}

###### autoConnect?

`boolean`

#### Returns

`Promise`\<`void`\>

***

### lastConnectedWallet?

> `optional` **lastConnectedWallet**: `object`

Defined in: [packages/satellite-core/src/types.ts:136](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-core/src/types.ts#L136)

Information about last connected wallet

#### chainId

> **chainId**: `number` \| `string`

#### walletType

> **walletType**: [`WalletType`](WalletType.md)

***

### resetSwitchNetworkError()

> **resetSwitchNetworkError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:172](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-core/src/types.ts#L172)

Clears network switch error state

#### Returns

`void`

***

### resetWalletConnectionError()

> **resetWalletConnectionError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:160](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-core/src/types.ts#L160)

Clears connection error state

#### Returns

`void`

***

### switchNetwork()

> **switchNetwork**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:166](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-core/src/types.ts#L166)

Switches network for connected wallet

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### switchNetworkError?

> `optional` **switchNetworkError**: `string`

Defined in: [packages/satellite-core/src/types.ts:169](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-core/src/types.ts#L169)

Contains error message if network switch failed

***

### updateActiveWallet()

> **updateActiveWallet**: (`wallet`) => `void`

Defined in: [packages/satellite-core/src/types.ts:163](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-core/src/types.ts#L163)

Updates active wallet properties

#### Parameters

##### wallet

`Partial`\<[`Wallet`](Wallet.md)\>

#### Returns

`void`

***

### walletConnecting

> **walletConnecting**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:151](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-core/src/types.ts#L151)

Indicates ongoing connection attempt

***

### walletConnectionError?

> `optional` **walletConnectionError**: `string`

Defined in: [packages/satellite-core/src/types.ts:154](https://github.com/TuwaIO/satellite-connect/blob/8360ff0360276ab1441103db09b4fae110570e1d/packages/satellite-core/src/types.ts#L154)

Contains error message if connection failed
