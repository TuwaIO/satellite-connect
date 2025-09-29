[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# ISatelliteConnectStore

> **ISatelliteConnectStore** = `object`

Defined in: [packages/satellite-core/src/types.ts:119](https://github.com/TuwaIO/satellite-connect/blob/0c017613a868c1866e36bb768bd1f3e8fc16b3ba/packages/satellite-core/src/types.ts#L119)

Store interface for managing wallet connections

## Properties

### activeWallet?

> `optional` **activeWallet**: [`Wallet`](Wallet.md)

Defined in: [packages/satellite-core/src/types.ts:145](https://github.com/TuwaIO/satellite-connect/blob/0c017613a868c1866e36bb768bd1f3e8fc16b3ba/packages/satellite-core/src/types.ts#L145)

Currently connected wallet

***

### availableConnectors

> **availableConnectors**: `Partial`\<`Record`\<`OrbitAdapter`, [`Connector`](Connector.md)[]\>\>

Defined in: [packages/satellite-core/src/types.ts:127](https://github.com/TuwaIO/satellite-connect/blob/0c017613a868c1866e36bb768bd1f3e8fc16b3ba/packages/satellite-core/src/types.ts#L127)

Available connectors mapped by adapter type

***

### connect()

> **connect**: (`{ walletType, chainId }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:133](https://github.com/TuwaIO/satellite-connect/blob/0c017613a868c1866e36bb768bd1f3e8fc16b3ba/packages/satellite-core/src/types.ts#L133)

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

Defined in: [packages/satellite-core/src/types.ts:136](https://github.com/TuwaIO/satellite-connect/blob/0c017613a868c1866e36bb768bd1f3e8fc16b3ba/packages/satellite-core/src/types.ts#L136)

Disconnects active wallet

#### Returns

`Promise`\<`void`\>

***

### getAdapter()

> **getAdapter**: () => [`SatelliteAdapter`](SatelliteAdapter.md) \| [`SatelliteAdapter`](SatelliteAdapter.md)[]

Defined in: [packages/satellite-core/src/types.ts:121](https://github.com/TuwaIO/satellite-connect/blob/0c017613a868c1866e36bb768bd1f3e8fc16b3ba/packages/satellite-core/src/types.ts#L121)

Returns configured adapter(s)

#### Returns

[`SatelliteAdapter`](SatelliteAdapter.md) \| [`SatelliteAdapter`](SatelliteAdapter.md)[]

***

### initializeAppConnectors()

> **initializeAppConnectors**: (`{ autoConnect }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:130](https://github.com/TuwaIO/satellite-connect/blob/0c017613a868c1866e36bb768bd1f3e8fc16b3ba/packages/satellite-core/src/types.ts#L130)

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

Defined in: [packages/satellite-core/src/types.ts:124](https://github.com/TuwaIO/satellite-connect/blob/0c017613a868c1866e36bb768bd1f3e8fc16b3ba/packages/satellite-core/src/types.ts#L124)

Information about last connected wallet

#### chainId

> **chainId**: `number` \| `string`

#### walletType

> **walletType**: [`WalletType`](WalletType.md)

***

### resetSwitchNetworkError()

> **resetSwitchNetworkError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:160](https://github.com/TuwaIO/satellite-connect/blob/0c017613a868c1866e36bb768bd1f3e8fc16b3ba/packages/satellite-core/src/types.ts#L160)

Clears network switch error state

#### Returns

`void`

***

### resetWalletConnectionError()

> **resetWalletConnectionError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:148](https://github.com/TuwaIO/satellite-connect/blob/0c017613a868c1866e36bb768bd1f3e8fc16b3ba/packages/satellite-core/src/types.ts#L148)

Clears connection error state

#### Returns

`void`

***

### switchNetwork()

> **switchNetwork**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:154](https://github.com/TuwaIO/satellite-connect/blob/0c017613a868c1866e36bb768bd1f3e8fc16b3ba/packages/satellite-core/src/types.ts#L154)

Switches network for connected wallet

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### switchNetworkError?

> `optional` **switchNetworkError**: `string`

Defined in: [packages/satellite-core/src/types.ts:157](https://github.com/TuwaIO/satellite-connect/blob/0c017613a868c1866e36bb768bd1f3e8fc16b3ba/packages/satellite-core/src/types.ts#L157)

Contains error message if network switch failed

***

### updateActiveWallet()

> **updateActiveWallet**: (`wallet`) => `void`

Defined in: [packages/satellite-core/src/types.ts:151](https://github.com/TuwaIO/satellite-connect/blob/0c017613a868c1866e36bb768bd1f3e8fc16b3ba/packages/satellite-core/src/types.ts#L151)

Updates active wallet properties

#### Parameters

##### wallet

`Partial`\<[`Wallet`](Wallet.md)\>

#### Returns

`void`

***

### walletConnecting

> **walletConnecting**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:139](https://github.com/TuwaIO/satellite-connect/blob/0c017613a868c1866e36bb768bd1f3e8fc16b3ba/packages/satellite-core/src/types.ts#L139)

Indicates ongoing connection attempt

***

### walletConnectionError?

> `optional` **walletConnectionError**: `string`

Defined in: [packages/satellite-core/src/types.ts:142](https://github.com/TuwaIO/satellite-connect/blob/0c017613a868c1866e36bb768bd1f3e8fc16b3ba/packages/satellite-core/src/types.ts#L142)

Contains error message if connection failed
