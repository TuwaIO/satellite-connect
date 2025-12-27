[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# ISatelliteConnectStore\<C, W\>

> **ISatelliteConnectStore**\<`C`, `W`\> = `object`

Defined in: [packages/satellite-core/src/types.ts:98](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L98)

Store interface for managing connector connections

## Type Parameters

### C

`C`

### W

`W` *extends* [`BaseConnector`](../interfaces/BaseConnector.md) = [`BaseConnector`](../interfaces/BaseConnector.md)

## Properties

### activeConnection?

> `optional` **activeConnection**: [`Connector`](Connector.md)\<`W`\>

Defined in: [packages/satellite-core/src/types.ts:120](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L120)

Currently connected connector

***

### connect()

> **connect**: (`{ connectorType, chainId }`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:106](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L106)

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

Defined in: [packages/satellite-core/src/types.ts:112](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L112)

Indicates ongoing connection attempt

***

### connectionError?

> `optional` **connectionError**: `string`

Defined in: [packages/satellite-core/src/types.ts:116](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L116)

Contains error message if connection failed

***

### connections

> **connections**: `Record`\<`ConnectorType`, [`Connector`](Connector.md)\<`W`\>\>

Defined in: [packages/satellite-core/src/types.ts:122](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L122)

List of all connected connectors

***

### disconnect()

> **disconnect**: (`connectorType?`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:108](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L108)

Disconnects active connector

#### Parameters

##### connectorType?

`ConnectorType`

#### Returns

`Promise`\<`void`\>

***

### disconnectAll()

> **disconnectAll**: () => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:110](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L110)

Disconnects all connectors, used for initialize application

#### Returns

`Promise`\<`void`\>

***

### disconnecting

> **disconnecting**: `boolean`

Defined in: [packages/satellite-core/src/types.ts:114](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L114)

Indicates ongoing disconnection attempt

***

### getAdapter()

> **getAdapter**: (`adapterKey`) => [`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\> \| `undefined`

Defined in: [packages/satellite-core/src/types.ts:100](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L100)

Returns configured adapter(s)

#### Parameters

##### adapterKey

`OrbitAdapter`

#### Returns

[`SatelliteAdapter`](SatelliteAdapter.md)\<`C`, `W`\> \| `undefined`

***

### getConnectors()

> **getConnectors**: () => `Partial`\<`Record`\<`OrbitAdapter`, `C`[]\>\>

Defined in: [packages/satellite-core/src/types.ts:102](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L102)

Get connectors

#### Returns

`Partial`\<`Record`\<`OrbitAdapter`, `C`[]\>\>

***

### initializeAutoConnect()

> **initializeAutoConnect**: (`autoConnect`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:104](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L104)

Initialize auto connect logic

#### Parameters

##### autoConnect

`boolean`

#### Returns

`Promise`\<`void`\>

***

### resetConnectionError()

> **resetConnectionError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:124](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L124)

Clears connection error state

#### Returns

`void`

***

### resetSwitchNetworkError()

> **resetSwitchNetworkError**: () => `void`

Defined in: [packages/satellite-core/src/types.ts:134](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L134)

Clears network switch error state

#### Returns

`void`

***

### setConnectionError()

> **setConnectionError**: (`error`) => `void`

Defined in: [packages/satellite-core/src/types.ts:118](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L118)

Sets error message if connection failed or form validation failed

#### Parameters

##### error

`string`

#### Returns

`void`

***

### switchConnection()

> **switchConnection**: (`connectorType`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:128](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L128)

Switches active connector from the list of connections

#### Parameters

##### connectorType

`ConnectorType`

#### Returns

`Promise`\<`void`\>

***

### switchNetwork()

> **switchNetwork**: (`chainId`, `connectorType?`) => `Promise`\<`void`\>

Defined in: [packages/satellite-core/src/types.ts:130](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L130)

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

> `optional` **switchNetworkError**: `string`

Defined in: [packages/satellite-core/src/types.ts:132](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L132)

Contains error message if network switch failed

***

### updateActiveConnection()

> **updateActiveConnection**: (`connector`) => `void`

Defined in: [packages/satellite-core/src/types.ts:126](https://github.com/TuwaIO/satellite-connect/blob/a935903ee93c01504144d3fc08294a658c549650/packages/satellite-core/src/types.ts#L126)

Updates active connector properties

#### Parameters

##### connector

`Partial`\<[`Connector`](Connector.md)\<`W`\>\>

#### Returns

`void`
