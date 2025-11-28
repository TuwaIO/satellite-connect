[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SiweAuthContextType

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:129](https://github.com/TuwaIO/satellite-connect/blob/5586aa3a39b71bb0d598cced97f2ca6d1a05cc84/packages/satellite-siwe-next-auth/src/types.ts#L129)

SiweAuthContextType
Interface for the SIWE authentication context state and actions.

## Properties

### data

> **data**: [`SIWESession`](SIWESession.md) \| `undefined`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:130](https://github.com/TuwaIO/satellite-connect/blob/5586aa3a39b71bb0d598cced97f2ca6d1a05cc84/packages/satellite-siwe-next-auth/src/types.ts#L130)

The authenticated SIWE data (address, chainId) if signed in.

***

### enabled

> **enabled**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:135](https://github.com/TuwaIO/satellite-connect/blob/5586aa3a39b71bb0d598cced97f2ca6d1a05cc84/packages/satellite-siwe-next-auth/src/types.ts#L135)

***

### isLoading

> **isLoading**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:133](https://github.com/TuwaIO/satellite-connect/blob/5586aa3a39b71bb0d598cced97f2ca6d1a05cc84/packages/satellite-siwe-next-auth/src/types.ts#L133)

True if the session status is loading.

***

### isReadyToSign

> **isReadyToSign**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:131](https://github.com/TuwaIO/satellite-connect/blob/5586aa3a39b71bb0d598cced97f2ca6d1a05cc84/packages/satellite-siwe-next-auth/src/types.ts#L131)

True if an EVM connector is connected and ready to sign.

***

### isRejected

> **isRejected**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:132](https://github.com/TuwaIO/satellite-connect/blob/5586aa3a39b71bb0d598cced97f2ca6d1a05cc84/packages/satellite-siwe-next-auth/src/types.ts#L132)

True if the last signing attempt was explicitly rejected by the user.

***

### isSignedIn

> **isSignedIn**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:134](https://github.com/TuwaIO/satellite-connect/blob/5586aa3a39b71bb0d598cced97f2ca6d1a05cc84/packages/satellite-siwe-next-auth/src/types.ts#L134)

True if the user has a valid NextAuth session.

***

### signInWithSiwe()

> **signInWithSiwe**: (`onSignIn?`) => `Promise`\<`void`\>

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:136](https://github.com/TuwaIO/satellite-connect/blob/5586aa3a39b71bb0d598cced97f2ca6d1a05cc84/packages/satellite-siwe-next-auth/src/types.ts#L136)

Initiates the SIWE sign-in flow.

#### Parameters

##### onSignIn?

(`session?`) => `void`

#### Returns

`Promise`\<`void`\>

***

### signOutSiwe()

> **signOutSiwe**: (`onSignOut?`) => `Promise`\<`void`\>

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:137](https://github.com/TuwaIO/satellite-connect/blob/5586aa3a39b71bb0d598cced97f2ca6d1a05cc84/packages/satellite-siwe-next-auth/src/types.ts#L137)

Terminates the NextAuth session.

#### Parameters

##### onSignOut?

() => `void`

#### Returns

`Promise`\<`void`\>
