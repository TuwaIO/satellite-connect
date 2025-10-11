[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# UseSiweSignatureResult

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:145](https://github.com/TuwaIO/satellite-connect/blob/87c81470ceb7f6f992c85ed7a52cf4e0ae67dd62/packages/satellite-siwe-next-auth/src/types.ts#L145)

UseSiweSignatureResult

## Properties

### getSiweSignature()

> **getSiweSignature**: (`customOptions?`) => `Promise`\<\{ `message`: `string`; `signature`: `` `0x${string}` ``; \} \| `undefined`\>

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:148](https://github.com/TuwaIO/satellite-connect/blob/87c81470ceb7f6f992c85ed7a52cf4e0ae67dd62/packages/satellite-siwe-next-auth/src/types.ts#L148)

Function to generate message and get signature.

#### Parameters

##### customOptions?

[`GetSiweMessageOptions`](../type-aliases/GetSiweMessageOptions.md)

#### Returns

`Promise`\<\{ `message`: `string`; `signature`: `` `0x${string}` ``; \} \| `undefined`\>

***

### isReadyToSign

> **isReadyToSign**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:146](https://github.com/TuwaIO/satellite-connect/blob/87c81470ceb7f6f992c85ed7a52cf4e0ae67dd62/packages/satellite-siwe-next-auth/src/types.ts#L146)

True if an EVM wallet is connected and ready to sign.

***

### isRejected

> **isRejected**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:147](https://github.com/TuwaIO/satellite-connect/blob/87c81470ceb7f6f992c85ed7a52cf4e0ae67dd62/packages/satellite-siwe-next-auth/src/types.ts#L147)

True if the last signing attempt was explicitly rejected by the user.
