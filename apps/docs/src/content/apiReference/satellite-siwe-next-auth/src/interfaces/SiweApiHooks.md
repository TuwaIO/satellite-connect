[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SiweApiHooks

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:46](https://github.com/TuwaIO/satellite-connect/blob/ae86f727a8cbca1131b9911d33463beed0f0ecc7/packages/satellite-siwe-next-auth/src/types.ts#L46)

Interface for the custom SIWE API hooks block provided by the user.

## Properties

### afterLogout()?

> `optional` **afterLogout**: () => `void` \| `Promise`\<`void`\>

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:48](https://github.com/TuwaIO/satellite-connect/blob/ae86f727a8cbca1131b9911d33463beed0f0ecc7/packages/satellite-siwe-next-auth/src/types.ts#L48)

Hook executed after the user is successfully logged out.

#### Returns

`void` \| `Promise`\<`void`\>

***

### afterNonce()?

> `optional` **afterNonce**: () => `void` \| `Promise`\<`void`\>

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:50](https://github.com/TuwaIO/satellite-connect/blob/ae86f727a8cbca1131b9911d33463beed0f0ecc7/packages/satellite-siwe-next-auth/src/types.ts#L50)

Hook executed before SIWE message verification (e.g., when the message is available).

#### Returns

`void` \| `Promise`\<`void`\>

***

### afterSession()?

> `optional` **afterSession**: () => `void` \| `Promise`\<`void`\>

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:52](https://github.com/TuwaIO/satellite-connect/blob/ae86f727a8cbca1131b9911d33463beed0f0ecc7/packages/satellite-siwe-next-auth/src/types.ts#L52)

Hook executed after the session is successfully created/saved.

#### Returns

`void` \| `Promise`\<`void`\>

***

### afterVerify()?

> `optional` **afterVerify**: () => `void` \| `Promise`\<`void`\>

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:54](https://github.com/TuwaIO/satellite-connect/blob/ae86f727a8cbca1131b9911d33463beed0f0ecc7/packages/satellite-siwe-next-auth/src/types.ts#L54)

Hook executed after the SIWE signature is successfully verified.

#### Returns

`void` \| `Promise`\<`void`\>
