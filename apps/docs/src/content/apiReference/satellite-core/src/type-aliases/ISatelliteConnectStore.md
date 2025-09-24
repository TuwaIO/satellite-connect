[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# ISatelliteConnectStore

> **ISatelliteConnectStore** = `object`

Defined in: [packages/satellite-core/src/types.ts:67](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L67)

## Properties

### activeWallet?

> `optional` **activeWallet**: [`Wallet`](Wallet.md)

Defined in: [packages/satellite-core/src/types.ts:79](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L79)

***

### availableConnectors

> **availableConnectors**: `Partial`\<`Record`\<`OrbitAdapter`, [`WalletForConnector`](WalletForConnector.md)[]\>\>

Defined in: [packages/satellite-core/src/types.ts:71](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L71)

***

### connect()

> **connect**: (`{ walletType, chainId }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:74](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L74)

#### Parameters

##### \{ walletType, chainId \}

###### chainId

`number` \| `string`

###### walletType

[`WalletType`](../enumerations/WalletType.md)

#### Returns

`Promise`\<`void`\>

***

### disconnect()

> **disconnect**: () => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:75](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L75)

#### Returns

`Promise`\<`void`\>

***

### getAdapter()

> **getAdapter**: () => [`SatelliteAdapter`](SatelliteAdapter.md) \| [`SatelliteAdapter`](SatelliteAdapter.md)[]

Defined in: [packages/satellite-core/src/types.ts:68](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L68)

#### Returns

[`SatelliteAdapter`](SatelliteAdapter.md) \| [`SatelliteAdapter`](SatelliteAdapter.md)[]

***

### initializeAppConnectors()

> **initializeAppConnectors**: (`{ autoConnect }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:72](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L72)

#### Parameters

##### \{ autoConnect \}

###### autoConnect?

`boolean`

#### Returns

`Promise`\<`void`\>

***

### lastConnectedWallet?

> `optional` **lastConnectedWallet**: `object`

Defined in: [packages/satellite-core/src/types.ts:70](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L70)

#### chainId

> **chainId**: `number` \| `string`

#### walletType

> **walletType**: [`WalletType`](../enumerations/WalletType.md)

***

### resetSwitchNetworkError()

> **resetSwitchNetworkError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:86](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L86)

#### Returns

`void`

***

### resetWalletConnectionError()

> **resetWalletConnectionError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:80](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L80)

#### Returns

`void`

***

### switchNetwork()

> **switchNetwork**: (`chainId`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:84](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L84)

#### Parameters

##### chainId

`string` | `number`

#### Returns

`Promise`\<`void`\>

***

### switchNetworkError?

> `optional` **switchNetworkError**: `string`

Defined in: [packages/satellite-core/src/types.ts:85](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L85)

***

### updateActiveWallet()

> **updateActiveWallet**: (`wallet`) => `void`

Defined in: [packages/satellite-core/src/types.ts:82](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L82)

#### Parameters

##### wallet

`Partial`\<[`Wallet`](Wallet.md)\>

#### Returns

`void`

***

### walletConnecting

> **walletConnecting**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:77](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L77)

***

### walletConnectionError?

> `optional` **walletConnectionError**: `string`

Defined in: [packages/satellite-core/src/types.ts:78](https://github.com/TuwaIO/satellite-connect/blob/9d1ad32f8af8fc6063a3d0617e2ab1bd902762ad/packages/satellite-core/src/types.ts#L78)
