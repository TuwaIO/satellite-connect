[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# ISatelliteConnectStore

> **ISatelliteConnectStore** = `object`

Defined in: [packages/satellite-core/src/types.ts:111](https://github.com/TuwaIO/satellite-connect/blob/39bb937469f0f9987a0ad868bf75ba6e1477143c/packages/satellite-core/src/types.ts#L111)

Store interface for managing wallet connections

## Properties

### activeWallet?

> `optional` **activeWallet**: [`Wallet`](Wallet.md)

Defined in: [packages/satellite-core/src/types.ts:133](https://github.com/TuwaIO/satellite-connect/blob/39bb937469f0f9987a0ad868bf75ba6e1477143c/packages/satellite-core/src/types.ts#L133)

Currently connected wallet

***

### connect()

> **connect**: (`{ walletType, chainId }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:121](https://github.com/TuwaIO/satellite-connect/blob/39bb937469f0f9987a0ad868bf75ba6e1477143c/packages/satellite-core/src/types.ts#L121)

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

Defined in: [packages/satellite-core/src/types.ts:124](https://github.com/TuwaIO/satellite-connect/blob/39bb937469f0f9987a0ad868bf75ba6e1477143c/packages/satellite-core/src/types.ts#L124)

Disconnects active wallet

#### Returns

`Promise`\<`void`\>

***

### getAdapter()

> **getAdapter**: () => [`SatelliteAdapter`](SatelliteAdapter.md) \| [`SatelliteAdapter`](SatelliteAdapter.md)[]

Defined in: [packages/satellite-core/src/types.ts:113](https://github.com/TuwaIO/satellite-connect/blob/39bb937469f0f9987a0ad868bf75ba6e1477143c/packages/satellite-core/src/types.ts#L113)

Returns configured adapter(s)

#### Returns

[`SatelliteAdapter`](SatelliteAdapter.md) \| [`SatelliteAdapter`](SatelliteAdapter.md)[]

***

### getConnectors()

> **getConnectors**: () => `Partial`\<`Record`\<`OrbitAdapter`, [`Connector`](Connector.md)[]\>\>

Defined in: [packages/satellite-core/src/types.ts:116](https://github.com/TuwaIO/satellite-connect/blob/39bb937469f0f9987a0ad868bf75ba6e1477143c/packages/satellite-core/src/types.ts#L116)

Get wallet connectors

#### Returns

`Partial`\<`Record`\<`OrbitAdapter`, [`Connector`](Connector.md)[]\>\>

***

### initializeAutoConnect()

> **initializeAutoConnect**: (`autoConnect`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:118](https://github.com/TuwaIO/satellite-connect/blob/39bb937469f0f9987a0ad868bf75ba6e1477143c/packages/satellite-core/src/types.ts#L118)

#### Parameters

##### autoConnect

`boolean`

#### Returns

`Promise`\<`void`\>

***

### resetSwitchNetworkError()

> **resetSwitchNetworkError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:148](https://github.com/TuwaIO/satellite-connect/blob/39bb937469f0f9987a0ad868bf75ba6e1477143c/packages/satellite-core/src/types.ts#L148)

Clears network switch error state

#### Returns

`void`

***

### resetWalletConnectionError()

> **resetWalletConnectionError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:136](https://github.com/TuwaIO/satellite-connect/blob/39bb937469f0f9987a0ad868bf75ba6e1477143c/packages/satellite-core/src/types.ts#L136)

Clears connection error state

#### Returns

`void`

***

### switchNetwork()

> **switchNetwork**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:142](https://github.com/TuwaIO/satellite-connect/blob/39bb937469f0f9987a0ad868bf75ba6e1477143c/packages/satellite-core/src/types.ts#L142)

Switches network for connected wallet

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### switchNetworkError?

> `optional` **switchNetworkError**: `string`

Defined in: [packages/satellite-core/src/types.ts:145](https://github.com/TuwaIO/satellite-connect/blob/39bb937469f0f9987a0ad868bf75ba6e1477143c/packages/satellite-core/src/types.ts#L145)

Contains error message if network switch failed

***

### updateActiveWallet()

> **updateActiveWallet**: (`wallet`) => `void`

Defined in: [packages/satellite-core/src/types.ts:139](https://github.com/TuwaIO/satellite-connect/blob/39bb937469f0f9987a0ad868bf75ba6e1477143c/packages/satellite-core/src/types.ts#L139)

Updates active wallet properties

#### Parameters

##### wallet

`Partial`\<[`Wallet`](Wallet.md)\>

#### Returns

`void`

***

### walletConnecting

> **walletConnecting**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:127](https://github.com/TuwaIO/satellite-connect/blob/39bb937469f0f9987a0ad868bf75ba6e1477143c/packages/satellite-core/src/types.ts#L127)

Indicates ongoing connection attempt

***

### walletConnectionError?

> `optional` **walletConnectionError**: `string`

Defined in: [packages/satellite-core/src/types.ts:130](https://github.com/TuwaIO/satellite-connect/blob/39bb937469f0f9987a0ad868bf75ba6e1477143c/packages/satellite-core/src/types.ts#L130)

Contains error message if connection failed
