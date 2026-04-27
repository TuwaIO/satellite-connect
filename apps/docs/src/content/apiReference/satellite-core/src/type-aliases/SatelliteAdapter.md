[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SatelliteAdapter\<C, W\>

> **SatelliteAdapter**\<`C`, `W`\> = `BaseAdapter` & `object`

Defined in: [packages/satellite-core/src/types.ts:51](https://github.com/TuwaIO/satellite-connect/blob/d480c5b4861b5c9b06e6c35c5fdcfbeffb6d875a/packages/satellite-core/src/types.ts#L51)

Interface for blockchain network adapters

## Type Declaration

### checkAndSwitchNetwork

> **checkAndSwitchNetwork**: (`chainId`, `currentChainId?`, `updateActiveConnector?`) => `Promise`\<`void`\>

Handles network switching for connected connector

#### Parameters

##### chainId

`string` \| `number`

Target chain ID

##### currentChainId?

`string` \| `number`

Current chain ID

##### updateActiveConnector?

(`connector`) => `void`

Callback to update connector state

#### Returns

`Promise`\<`void`\>

### checkIsContractAddress?

> `optional` **checkIsContractAddress?**: (`{ address, chainId }`) => `Promise`\<`boolean`\>

Optional method to check if address is a smart contract

#### Parameters

##### \{ address, chainId \}

###### address

`string`

###### chainId

`string` \| `number`

#### Returns

`Promise`\<`boolean`\>

### connect

> **connect**: (`{
    connectorType,
    chainId,
  }`) => `Promise`\<[`Connector`](Connector.md)\<`W`\>\>

Initiates connection

#### Parameters

##### \{
    connectorType,
    chainId,
  \}

###### chainId

`number` \| `string`

###### connectorType

`ConnectorType`

#### Returns

`Promise`\<[`Connector`](Connector.md)\<`W`\>\>

Promise resolving to connected connector instance

### disconnect

> **disconnect**: (`activeConnector?`) => `Promise`\<`void`\>

Disconnects current connector session

#### Parameters

##### activeConnector?

[`Connector`](Connector.md)\<`W`\>

#### Returns

`Promise`\<`void`\>

### getBalance

> **getBalance**: (`address`, `chainId`) => `Promise`\<\{ `symbol`: `string`; `value`: `string`; \}\>

#### Parameters

##### address

`string`

##### chainId

`number` \| `string`

#### Returns

`Promise`\<\{ `symbol`: `string`; `value`: `string`; \}\>

### getConnectors

> **getConnectors**: () => `object`

Retrieves available connectors for this adapter

#### Returns

`object`

##### adapter

> **adapter**: `OrbitAdapter`

##### connectors

> **connectors**: `C`[]

### getSafeConnectorChainId?

> `optional` **getSafeConnectorChainId?**: () => `Promise`\<`number` \| `undefined`\>

Optional method to get a safe connector chainId for auto connect

#### Returns

`Promise`\<`number` \| `undefined`\>

### key

> **key**: `OrbitAdapter`

Unique identifier for the adapter

### switchConnection?

> `optional` **switchConnection?**: (`connectorType`) => `Promise`\<`void`\>

Optional method to switch active connector

#### Parameters

##### connectorType

`ConnectorType`

#### Returns

`Promise`\<`void`\>

## Type Parameters

### C

`C`

### W

`W` *extends* [`BaseConnector`](../interfaces/BaseConnector.md) = [`BaseConnector`](../interfaces/BaseConnector.md)

## Remarks

Adapters provide chain-specific implementation for connector interactions
