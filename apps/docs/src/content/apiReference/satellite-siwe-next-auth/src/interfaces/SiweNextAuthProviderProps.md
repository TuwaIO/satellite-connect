[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SiweNextAuthProviderProps

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:162](https://github.com/TuwaIO/satellite-connect/blob/ab7853a2b67d56c430b290eecda2a29d74515c99/packages/satellite-siwe-next-auth/src/types.ts#L162)

SiweNextAuthProviderProps

## Properties

### children

> **children**: `ReactNode`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:168](https://github.com/TuwaIO/satellite-connect/blob/ab7853a2b67d56c430b290eecda2a29d74515c99/packages/satellite-siwe-next-auth/src/types.ts#L168)

Child components.

***

### enabled?

> `optional` **enabled**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:163](https://github.com/TuwaIO/satellite-connect/blob/ab7853a2b67d56c430b290eecda2a29d74515c99/packages/satellite-siwe-next-auth/src/types.ts#L163)

Enables or disables SIWE authentication globally.

***

### getSiweMessageOptions?

> `optional` **getSiweMessageOptions**: [`GetSiweMessageOptions`](../type-aliases/GetSiweMessageOptions.md)

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:167](https://github.com/TuwaIO/satellite-connect/blob/ab7853a2b67d56c430b290eecda2a29d74515c99/packages/satellite-siwe-next-auth/src/types.ts#L167)

Optional function to customize the SIWE message fields.

***

### nonceRefetchInterval?

> `optional` **nonceRefetchInterval**: `number`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:164](https://github.com/TuwaIO/satellite-connect/blob/ab7853a2b67d56c430b290eecda2a29d74515c99/packages/satellite-siwe-next-auth/src/types.ts#L164)

Interval (ms) for refetching session/nonce token (defaults to 5 mins).

***

### onSignIn()?

> `optional` **onSignIn**: (`session?`) => `void`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:165](https://github.com/TuwaIO/satellite-connect/blob/ab7853a2b67d56c430b290eecda2a29d74515c99/packages/satellite-siwe-next-auth/src/types.ts#L165)

Callback executed after a successful SIWE sign-in.

#### Parameters

##### session?

[`SIWESession`](SIWESession.md)

#### Returns

`void`

***

### onSignOut()?

> `optional` **onSignOut**: () => `void`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:166](https://github.com/TuwaIO/satellite-connect/blob/ab7853a2b67d56c430b290eecda2a29d74515c99/packages/satellite-siwe-next-auth/src/types.ts#L166)

Callback executed after a successful sign-out or wallet disconnect.

#### Returns

`void`
