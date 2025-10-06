[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# BaseAdapter

> **BaseAdapter** = `object`

Defined in: [packages/orbit-core/src/types.ts:112](https://github.com/TuwaIO/satellite-connect/blob/4db4fd2faf1732916ae8fd5a07ca3381fe492a8f/packages/orbit-core/src/types.ts#L112)

## Properties

### getAvatar()?

> `optional` **getAvatar**: (`name`) => `Promise`\<`string` \| `null`\>

Defined in: [packages/orbit-core/src/types.ts:123](https://github.com/TuwaIO/satellite-connect/blob/4db4fd2faf1732916ae8fd5a07ca3381fe492a8f/packages/orbit-core/src/types.ts#L123)

Optional method to get avatar for resolved names

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### getExplorerUrl()

> **getExplorerUrl**: (`url?`, `chainId?`) => `string` \| `undefined`

Defined in: [packages/orbit-core/src/types.ts:117](https://github.com/TuwaIO/satellite-connect/blob/4db4fd2faf1732916ae8fd5a07ca3381fe492a8f/packages/orbit-core/src/types.ts#L117)

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

Defined in: [packages/orbit-core/src/types.ts:120](https://github.com/TuwaIO/satellite-connect/blob/4db4fd2faf1732916ae8fd5a07ca3381fe492a8f/packages/orbit-core/src/types.ts#L120)

Optional method to resolve ENS-like names

#### Parameters

##### address

`string`

#### Returns

`Promise`\<`string` \| `null`\>
