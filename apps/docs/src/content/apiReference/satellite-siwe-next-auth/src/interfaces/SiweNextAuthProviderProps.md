[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SiweNextAuthProviderProps

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:163](https://github.com/TuwaIO/satellite-connect/blob/00f5d3d544f90750cd279965f165e44ef8601c37/packages/satellite-siwe-next-auth/src/types.ts#L163)

SiweNextAuthProviderProps

## Properties

### children

> **children**: `ReactNode`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:170](https://github.com/TuwaIO/satellite-connect/blob/00f5d3d544f90750cd279965f165e44ef8601c37/packages/satellite-siwe-next-auth/src/types.ts#L170)

Child components.

***

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:165](https://github.com/TuwaIO/satellite-connect/blob/00f5d3d544f90750cd279965f165e44ef8601c37/packages/satellite-siwe-next-auth/src/types.ts#L165)

Enables or disables SIWE authentication globally.

***

### getSiweMessageOptions?

> `optional` **getSiweMessageOptions**: [`GetSiweMessageOptions`](../type-aliases/GetSiweMessageOptions.md)

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:169](https://github.com/TuwaIO/satellite-connect/blob/00f5d3d544f90750cd279965f165e44ef8601c37/packages/satellite-siwe-next-auth/src/types.ts#L169)

Optional function to customize the SIWE message fields.

***

### nonceRefetchInterval?

> `optional` **nonceRefetchInterval**: `number`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:166](https://github.com/TuwaIO/satellite-connect/blob/00f5d3d544f90750cd279965f165e44ef8601c37/packages/satellite-siwe-next-auth/src/types.ts#L166)

Interval (ms) for refetching session/nonce token (defaults to 5 mins).

***

### onSignIn()?

> `optional` **onSignIn**: (`session?`) => `void`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:167](https://github.com/TuwaIO/satellite-connect/blob/00f5d3d544f90750cd279965f165e44ef8601c37/packages/satellite-siwe-next-auth/src/types.ts#L167)

Callback executed after a successful SIWE sign-in.

#### Parameters

##### session?

[`SIWESession`](SIWESession.md)

#### Returns

`void`

***

### onSignOut()?

> `optional` **onSignOut**: () => `void`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:168](https://github.com/TuwaIO/satellite-connect/blob/00f5d3d544f90750cd279965f165e44ef8601c37/packages/satellite-siwe-next-auth/src/types.ts#L168)

Callback executed after a successful sign-out or wallet disconnect.

#### Returns

`void`

***

### wagmiConfig

> **wagmiConfig**: `Config`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:164](https://github.com/TuwaIO/satellite-connect/blob/00f5d3d544f90750cd279965f165e44ef8601c37/packages/satellite-siwe-next-auth/src/types.ts#L164)
