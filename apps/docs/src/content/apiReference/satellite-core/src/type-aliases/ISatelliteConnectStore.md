[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# ISatelliteConnectStore\<C, W\>

> **ISatelliteConnectStore**\<`C`, `W`\> = `object`

Defined in: [packages/satellite-core/src/types.ts:99](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L99)

Store interface for managing connector connections

## Type Parameters

### C

`C`

### W

`W` *extends* [`BaseConnector`](../interfaces/BaseConnector.md) = [`BaseConnector`](../interfaces/BaseConnector.md)

## Properties

### activeConnection?

> `optional` **activeConnection**: [`Connector`](Connector.md)\<`W`\>

Defined in: [packages/satellite-core/src/types.ts:121](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L121)

Currently connected connector

***

### connect()

> **connect**: (`{ connectorType, chainId }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:107](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L107)

Connects to specified connector

#### Parameters

##### \{ connectorType, chainId \}

###### chainId

`number` \| `string`

###### connectorType

`ConnectorType`

#### Returns

`Promise`\<`void`\>

***

### connecting

> **connecting**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:113](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L113)

Indicates ongoing connection attempt

***

### connectionError?

> `optional` **connectionError**: `TuwaErrorState`

Defined in: [packages/satellite-core/src/types.ts:117](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L117)

Contains error message if connection failed

***

### connections

> **connections**: `Record`\<`ConnectorType`, [`Connector`](Connector.md)\<`W`\>\>

Defined in: [packages/satellite-core/src/types.ts:123](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L123)

List of all connected connectors

***

### disconnect()

> **disconnect**: (`connectorType?`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:109](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L109)

Disconnects active connector

#### Parameters

##### connectorType?

`ConnectorType`

#### Returns

`Promise`\<`void`\>

***

### disconnectAll()

> **disconnectAll**: () => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:111](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L111)

Disconnects all connectors, used for initialize application

#### Returns

`Promise`\<`void`\>

***

### disconnecting

> **disconnecting**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:115](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L115)

Indicates ongoing disconnection attempt

***

### getAdapter()

> **getAdapter**: (`adapterKey`) => [`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\> \| `undefined`

Defined in: [packages/satellite-core/src/types.ts:101](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L101)

Returns configured adapter(s)

#### Parameters

##### adapterKey

`OrbitAdapter`

#### Returns

[`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\> \| `undefined`

***

### getConnectors()

> **getConnectors**: () => `Partial`\<`Record`\<`OrbitAdapter`, `C`[]\>\>

Defined in: [packages/satellite-core/src/types.ts:103](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L103)

Get connectors

#### Returns

`Partial`\<`Record`\<`OrbitAdapter`, `C`[]\>\>

***

### initializeAutoConnect()

> **initializeAutoConnect**: (`autoConnect`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:105](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L105)

Initialize auto connect logic

#### Parameters

##### autoConnect

`boolean`

#### Returns

`Promise`\<`void`\>

***

### resetConnectionError()

> **resetConnectionError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:125](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L125)

Clears connection error state

#### Returns

`void`

***

### resetSwitchNetworkError()

> **resetSwitchNetworkError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:135](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L135)

Clears network switch error state

#### Returns

`void`

***

### setConnectionError()

> **setConnectionError**: (`error`) => `void`

Defined in: [packages/satellite-core/src/types.ts:119](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L119)

Sets error message if connection failed or form validation failed

#### Parameters

##### error

`TuwaErrorState`

#### Returns

`void`

***

### switchConnection()

> **switchConnection**: (`connectorType`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:129](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L129)

Switches active connector from the list of connections

#### Parameters

##### connectorType

`ConnectorType`

#### Returns

`Promise`\<`void`\>

***

### switchNetwork()

> **switchNetwork**: (`chainId`, `connectorType?`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:131](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L131)

Switches network for connected connector

#### Parameters

##### chainId

`string` | `number`

##### connectorType?

`ConnectorType`

#### Returns

`Promise`\<`void`\>

***

### switchNetworkError?

> `optional` **switchNetworkError**: `TuwaErrorState`

Defined in: [packages/satellite-core/src/types.ts:133](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L133)

Contains error message if network switch failed

***

### updateActiveConnection()

> **updateActiveConnection**: (`connector`) => `void`

Defined in: [packages/satellite-core/src/types.ts:127](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-core/src/types.ts#L127)

Updates active connector properties

#### Parameters

##### connector

`Partial`\<[`Connector`](Connector.md)\<`W`\>\>

#### Returns

`void`
