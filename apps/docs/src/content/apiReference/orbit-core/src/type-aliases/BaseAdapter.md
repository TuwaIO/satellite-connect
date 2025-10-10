[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# BaseAdapter

> **BaseAdapter** = `object`

Defined in: [packages/orbit-core/src/types.ts:100](https://github.com/TuwaIO/satellite-connect/blob/1ece594ed6a6d6b166e813f2c5f0e9e1d331be09/packages/orbit-core/src/types.ts#L100)

## Properties

### getAvatar()?

> `optional` **getAvatar**: (`name`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/orbit-core/src/types.ts:111](https://github.com/TuwaIO/satellite-connect/blob/1ece594ed6a6d6b166e813f2c5f0e9e1d331be09/packages/orbit-core/src/types.ts#L111)

Optional method to get avatar for resolved names

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### getExplorerUrl()

> **getExplorerUrl**: (`url?`, `chainId?`) => `string` \| `undefined`

Defined in: [packages/orbit-core/src/types.ts:105](https://github.com/TuwaIO/satellite-connect/blob/1ece594ed6a6d6b166e813f2c5f0e9e1d331be09/packages/orbit-core/src/types.ts#L105)

Generates blockchain explorer URL

#### Parameters

##### url?

`string`

##### chainId?

`string` | `number`

#### Returns

`string` \| `undefined`

Explorer URL or undefined if not available

***

### getName()?

> `optional` **getName**: (`address`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/orbit-core/src/types.ts:108](https://github.com/TuwaIO/satellite-connect/blob/1ece594ed6a6d6b166e813f2c5f0e9e1d331be09/packages/orbit-core/src/types.ts#L108)

Optional method to resolve ENS-like names

#### Parameters

##### address

`string`

#### Returns

`Promise`\<`string` \| `null`\>
