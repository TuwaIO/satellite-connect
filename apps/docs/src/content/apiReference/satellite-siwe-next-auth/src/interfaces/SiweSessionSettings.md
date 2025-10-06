[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SiweSessionSettings

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:31](https://github.com/TuwaIO/satellite-connect/blob/19c1978f86b646632c45c0cd954d6819ec442178/packages/satellite-siwe-next-auth/src/types.ts#L31)

Interface for the session settings block provided by the user.

## Properties

### cookieName?

> `optional` **cookieName**: `string`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:33](https://github.com/TuwaIO/satellite-connect/blob/19c1978f86b646632c45c0cd954d6819ec442178/packages/satellite-siwe-next-auth/src/types.ts#L33)

The name of the cookie to store the session data. Defaults to "satellite-siwe".

***

### cookieOptions?

> `optional` **cookieOptions**: [`SiweCookieOptions`](SiweCookieOptions.md)

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:39](https://github.com/TuwaIO/satellite-connect/blob/19c1978f86b646632c45c0cd954d6819ec442178/packages/satellite-siwe-next-auth/src/types.ts#L39)

Optional options for cookie serialization.

***

### password?

> `optional` **password**: `string`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:37](https://github.com/TuwaIO/satellite-connect/blob/19c1978f86b646632c45c0cd954d6819ec442178/packages/satellite-siwe-next-auth/src/types.ts#L37)

The password/secret used to encrypt the session data.
Defaults to `process.env.SESSION_SECRET`.
