[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# ISatelliteConnectStore

> **ISatelliteConnectStore** = `object`

Defined in: [packages/satellite-core/src/types.ts:60](https://github.com/TuwaIO/satellite-connect/blob/bbc901b8bff3563e4096dc064e78e33cabbe6cb0/packages/satellite-core/src/types.ts#L60)

## Properties

### activeWallet?

> `optional` **activeWallet**: [`Wallet`](Wallet.md)

Defined in: [packages/satellite-core/src/types.ts:72](https://github.com/TuwaIO/satellite-connect/blob/bbc901b8bff3563e4096dc064e78e33cabbe6cb0/packages/satellite-core/src/types.ts#L72)

***

### availableConnectors

> **availableConnectors**: `Partial`\<`Record`\<`OrbitAdapter`, [`Connector`](Connector.md)[]\>\>

Defined in: [packages/satellite-core/src/types.ts:64](https://github.com/TuwaIO/satellite-connect/blob/bbc901b8bff3563e4096dc064e78e33cabbe6cb0/packages/satellite-core/src/types.ts#L64)

***

### connect()

> **connect**: (`{ walletType, chainId }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:67](https://github.com/TuwaIO/satellite-connect/blob/bbc901b8bff3563e4096dc064e78e33cabbe6cb0/packages/satellite-core/src/types.ts#L67)

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

Defined in: [packages/satellite-core/src/types.ts:68](https://github.com/TuwaIO/satellite-connect/blob/bbc901b8bff3563e4096dc064e78e33cabbe6cb0/packages/satellite-core/src/types.ts#L68)

#### Returns

`Promise`\<`void`\>

***

### getAdapter()

> **getAdapter**: () => [`SatelliteAdapter`](SatelliteAdapter.md) \| [`SatelliteAdapter`](SatelliteAdapter.md)[]

Defined in: [packages/satellite-core/src/types.ts:61](https://github.com/TuwaIO/satellite-connect/blob/bbc901b8bff3563e4096dc064e78e33cabbe6cb0/packages/satellite-core/src/types.ts#L61)

#### Returns

[`SatelliteAdapter`](SatelliteAdapter.md) \| [`SatelliteAdapter`](SatelliteAdapter.md)[]

***

### initializeAppConnectors()

> **initializeAppConnectors**: (`{ autoConnect }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:65](https://github.com/TuwaIO/satellite-connect/blob/bbc901b8bff3563e4096dc064e78e33cabbe6cb0/packages/satellite-core/src/types.ts#L65)

#### Parameters

##### \{ autoConnect \}

###### autoConnect?

`boolean`

#### Returns

`Promise`\<`void`\>

***

### lastConnectedWallet?

> `optional` **lastConnectedWallet**: `object`

Defined in: [packages/satellite-core/src/types.ts:63](https://github.com/TuwaIO/satellite-connect/blob/bbc901b8bff3563e4096dc064e78e33cabbe6cb0/packages/satellite-core/src/types.ts#L63)

#### chainId

> **chainId**: `number` \| `string`

#### walletType

> **walletType**: [`WalletType`](WalletType.md)

***

### resetSwitchNetworkError()

> **resetSwitchNetworkError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:79](https://github.com/TuwaIO/satellite-connect/blob/bbc901b8bff3563e4096dc064e78e33cabbe6cb0/packages/satellite-core/src/types.ts#L79)

#### Returns

`void`

***

### resetWalletConnectionError()

> **resetWalletConnectionError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:73](https://github.com/TuwaIO/satellite-connect/blob/bbc901b8bff3563e4096dc064e78e33cabbe6cb0/packages/satellite-core/src/types.ts#L73)

#### Returns

`void`

***

### switchNetwork()

> **switchNetwork**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:77](https://github.com/TuwaIO/satellite-connect/blob/bbc901b8bff3563e4096dc064e78e33cabbe6cb0/packages/satellite-core/src/types.ts#L77)

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### switchNetworkError?

> `optional` **switchNetworkError**: `string`

Defined in: [packages/satellite-core/src/types.ts:78](https://github.com/TuwaIO/satellite-connect/blob/bbc901b8bff3563e4096dc064e78e33cabbe6cb0/packages/satellite-core/src/types.ts#L78)

***

### updateActiveWallet()

> **updateActiveWallet**: (`wallet`) => `void`

Defined in: [packages/satellite-core/src/types.ts:75](https://github.com/TuwaIO/satellite-connect/blob/bbc901b8bff3563e4096dc064e78e33cabbe6cb0/packages/satellite-core/src/types.ts#L75)

#### Parameters

##### wallet

`Partial`\<[`Wallet`](Wallet.md)\>

#### Returns

`void`

***

### walletConnecting

> **walletConnecting**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:70](https://github.com/TuwaIO/satellite-connect/blob/bbc901b8bff3563e4096dc064e78e33cabbe6cb0/packages/satellite-core/src/types.ts#L70)

***

### walletConnectionError?

> `optional` **walletConnectionError**: `string`

Defined in: [packages/satellite-core/src/types.ts:71](https://github.com/TuwaIO/satellite-connect/blob/bbc901b8bff3563e4096dc064e78e33cabbe6cb0/packages/satellite-core/src/types.ts#L71)
