[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SiweSessionSettings

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:32](https://github.com/TuwaIO/satellite-connect/blob/a99f753ce416fc417c8c9c10b9cda1c22dde84be/packages/satellite-siwe-next-auth/src/types.ts#L32)

Interface for the session settings block provided by the user.

## Properties

### cookieName?

> `optional` **cookieName**: `string`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:34](https://github.com/TuwaIO/satellite-connect/blob/a99f753ce416fc417c8c9c10b9cda1c22dde84be/packages/satellite-siwe-next-auth/src/types.ts#L34)

The name of the cookie to store the session data. Defaults to "satellite-siwe".

***

### cookieOptions?

> `optional` **cookieOptions**: [`SiweCookieOptions`](SiweCookieOptions.md)

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:40](https://github.com/TuwaIO/satellite-connect/blob/a99f753ce416fc417c8c9c10b9cda1c22dde84be/packages/satellite-siwe-next-auth/src/types.ts#L40)

Optional options for cookie serialization.

***

### password?

> `optional` **password**: `string`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:38](https://github.com/TuwaIO/satellite-connect/blob/a99f753ce416fc417c8c9c10b9cda1c22dde84be/packages/satellite-siwe-next-auth/src/types.ts#L38)

The password/secret used to encrypt the session data.
Defaults to `process.env.SESSION_SECRET`.
