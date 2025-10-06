[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SiweCookieOptions

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:11](https://github.com/TuwaIO/satellite-connect/blob/19c1978f86b646632c45c0cd954d6819ec442178/packages/satellite-siwe-next-auth/src/types.ts#L11)

Interface for the optional cookie serialization options.
Matches common fields of `CookieSerializeOptions` from the 'cookie' package.

## Properties

### domain?

> `optional` **domain**: `string`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:15](https://github.com/TuwaIO/satellite-connect/blob/19c1978f86b646632c45c0cd954d6819ec442178/packages/satellite-siwe-next-auth/src/types.ts#L15)

The "Domain" Set-Cookie attribute.

***

### expires?

> `optional` **expires**: `Date`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:19](https://github.com/TuwaIO/satellite-connect/blob/19c1978f86b646632c45c0cd954d6819ec442178/packages/satellite-siwe-next-auth/src/types.ts#L19)

The "Expires" Set-Cookie attribute.

***

### httpOnly?

> `optional` **httpOnly**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:21](https://github.com/TuwaIO/satellite-connect/blob/19c1978f86b646632c45c0cd954d6819ec442178/packages/satellite-siwe-next-auth/src/types.ts#L21)

The "HttpOnly" Set-Cookie attribute.

***

### maxAge?

> `optional` **maxAge**: `number`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:13](https://github.com/TuwaIO/satellite-connect/blob/19c1978f86b646632c45c0cd954d6819ec442178/packages/satellite-siwe-next-auth/src/types.ts#L13)

The value of the Max-Age Set-Cookie attribute in seconds.

***

### path?

> `optional` **path**: `string`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:17](https://github.com/TuwaIO/satellite-connect/blob/19c1978f86b646632c45c0cd954d6819ec442178/packages/satellite-siwe-next-auth/src/types.ts#L17)

The "Path" Set-Cookie attribute.

***

### sameSite?

> `optional` **sameSite**: `boolean` \| `"strict"` \| `"lax"` \| `"none"`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:25](https://github.com/TuwaIO/satellite-connect/blob/19c1978f86b646632c45c0cd954d6819ec442178/packages/satellite-siwe-next-auth/src/types.ts#L25)

The "SameSite" Set-Cookie attribute.

***

### secure?

> `optional` **secure**: `boolean`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:23](https://github.com/TuwaIO/satellite-connect/blob/19c1978f86b646632c45c0cd954d6819ec442178/packages/satellite-siwe-next-auth/src/types.ts#L23)

The "Secure" Set-Cookie attribute.
