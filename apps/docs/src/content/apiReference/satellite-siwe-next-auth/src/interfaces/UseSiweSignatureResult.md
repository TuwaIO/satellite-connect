[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# UseSiweSignatureResult

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:146](https://github.com/TuwaIO/satellite-connect/blob/37ca8c9fa43367e76aa81ee7273e85b2c7c71109/packages/satellite-siwe-next-auth/src/types.ts#L146)

UseSiweSignatureResult

## Properties

### getSiweSignature

> **getSiweSignature**: (`customOptions?`) => `Promise`\<\{ `message`: `string`; `signature`: `` `0x${string}` ``; \} \| `undefined`\>

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:149](https://github.com/TuwaIO/satellite-connect/blob/37ca8c9fa43367e76aa81ee7273e85b2c7c71109/packages/satellite-siwe-next-auth/src/types.ts#L149)

Function to generate message and get signature.

#### Parameters

##### customOptions?

[`GetSiweMessageOptions`](../type-aliases/GetSiweMessageOptions.md)

#### Returns

`Promise`\<\{ `message`: `string`; `signature`: `` `0x${string}` ``; \} \| `undefined`\>

***

### isReadyToSign

> **isReadyToSign**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:147](https://github.com/TuwaIO/satellite-connect/blob/37ca8c9fa43367e76aa81ee7273e85b2c7c71109/packages/satellite-siwe-next-auth/src/types.ts#L147)

True if an EVM connector is connected and ready to sign.

***

### isRejected

> **isRejected**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:148](https://github.com/TuwaIO/satellite-connect/blob/37ca8c9fa43367e76aa81ee7273e85b2c7c71109/packages/satellite-siwe-next-auth/src/types.ts#L148)

True if the last signing attempt was explicitly rejected by the user.
