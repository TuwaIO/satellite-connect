[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SiweApiHooks

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:45](https://github.com/TuwaIO/satellite-connect/blob/df0c14cbe153e4c2bcccbfeb0d8d8c1d50355898/packages/satellite-siwe-next-auth/src/types.ts#L45)

Interface for the custom SIWE API hooks block provided by the user.

## Properties

### afterLogout()?

> `optional` **afterLogout**: () => `void` \| `Promise`\<`void`\>

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:47](https://github.com/TuwaIO/satellite-connect/blob/df0c14cbe153e4c2bcccbfeb0d8d8c1d50355898/packages/satellite-siwe-next-auth/src/types.ts#L47)

Hook executed after the user is successfully logged out.

#### Returns

`void` \| `Promise`\<`void`\>

***

### afterNonce()?

> `optional` **afterNonce**: () => `void` \| `Promise`\<`void`\>

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:49](https://github.com/TuwaIO/satellite-connect/blob/df0c14cbe153e4c2bcccbfeb0d8d8c1d50355898/packages/satellite-siwe-next-auth/src/types.ts#L49)

Hook executed before SIWE message verification (e.g., when the message is available).

#### Returns

`void` \| `Promise`\<`void`\>

***

### afterSession()?

> `optional` **afterSession**: () => `void` \| `Promise`\<`void`\>

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:51](https://github.com/TuwaIO/satellite-connect/blob/df0c14cbe153e4c2bcccbfeb0d8d8c1d50355898/packages/satellite-siwe-next-auth/src/types.ts#L51)

Hook executed after the session is successfully created/saved.

#### Returns

`void` \| `Promise`\<`void`\>

***

### afterVerify()?

> `optional` **afterVerify**: () => `void` \| `Promise`\<`void`\>

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:53](https://github.com/TuwaIO/satellite-connect/blob/df0c14cbe153e4c2bcccbfeb0d8d8c1d50355898/packages/satellite-siwe-next-auth/src/types.ts#L53)

Hook executed after the SIWE signature is successfully verified.

#### Returns

`void` \| `Promise`\<`void`\>
