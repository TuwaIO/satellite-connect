[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# UseSiweSignatureResult

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:145](https://github.com/TuwaIO/satellite-connect/blob/fe44df5fcdc64f793ead6ffd2cd5581b87d2802e/packages/satellite-siwe-next-auth/src/types.ts#L145)

UseSiweSignatureResult

## Properties

### getSiweSignature()

> **getSiweSignature**: (`customOptions?`) => `Promise`\<`undefined` \| \{ `message`: `string`; `signature`: `` `0x${string}` ``; \}\>

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:148](https://github.com/TuwaIO/satellite-connect/blob/fe44df5fcdc64f793ead6ffd2cd5581b87d2802e/packages/satellite-siwe-next-auth/src/types.ts#L148)

Function to generate message and get signature.

#### Parameters

##### customOptions?

[`GetSiweMessageOptions`](../type-aliases/GetSiweMessageOptions.md)

#### Returns

`Promise`\<`undefined` \| \{ `message`: `string`; `signature`: `` `0x${string}` ``; \}\>

***

### isReadyToSign

> **isReadyToSign**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:146](https://github.com/TuwaIO/satellite-connect/blob/fe44df5fcdc64f793ead6ffd2cd5581b87d2802e/packages/satellite-siwe-next-auth/src/types.ts#L146)

True if an EVM wallet is connected and ready to sign.

***

### isRejected

> **isRejected**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:147](https://github.com/TuwaIO/satellite-connect/blob/fe44df5fcdc64f793ead6ffd2cd5581b87d2802e/packages/satellite-siwe-next-auth/src/types.ts#L147)

True if the last signing attempt was explicitly rejected by the user.
