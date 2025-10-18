[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# UseSiweSignatureResult

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:146](https://github.com/TuwaIO/satellite-connect/blob/f997a2c846573a9d4a35f5a194694efae198262d/packages/satellite-siwe-next-auth/src/types.ts#L146)

UseSiweSignatureResult

## Properties

### getSiweSignature()

> **getSiweSignature**: (`customOptions?`) => `Promise`\<\{ `message`: `string`; `signature`: `` `0x${string}` ``; \} \| `undefined`\>

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:149](https://github.com/TuwaIO/satellite-connect/blob/f997a2c846573a9d4a35f5a194694efae198262d/packages/satellite-siwe-next-auth/src/types.ts#L149)

Function to generate message and get signature.

#### Parameters

##### customOptions?

[`GetSiweMessageOptions`](../type-aliases/GetSiweMessageOptions.md)

#### Returns

`Promise`\<\{ `message`: `string`; `signature`: `` `0x${string}` ``; \} \| `undefined`\>

***

### isReadyToSign

> **isReadyToSign**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:147](https://github.com/TuwaIO/satellite-connect/blob/f997a2c846573a9d4a35f5a194694efae198262d/packages/satellite-siwe-next-auth/src/types.ts#L147)

True if an EVM wallet is connected and ready to sign.

***

### isRejected

> **isRejected**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:148](https://github.com/TuwaIO/satellite-connect/blob/f997a2c846573a9d4a35f5a194694efae198262d/packages/satellite-siwe-next-auth/src/types.ts#L148)

True if the last signing attempt was explicitly rejected by the user.
