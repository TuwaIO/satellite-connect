[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SiweApiConfig

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:59](https://github.com/TuwaIO/satellite-connect/blob/76f200ba88ce70bc6938df1b9fbbdccaaa8c027a/packages/satellite-siwe-next-auth/src/types.ts#L59)

The complete configuration object for the SIWE API handler factory.

## Properties

### options?

> `optional` **options**: [`SiweApiHooks`](SiweApiHooks.md)

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:63](https://github.com/TuwaIO/satellite-connect/blob/76f200ba88ce70bc6938df1b9fbbdccaaa8c027a/packages/satellite-siwe-next-auth/src/types.ts#L63)

Custom callback hooks for various steps of the SIWE process.

***

### session?

> `optional` **session**: [`SiweSessionSettings`](SiweSessionSettings.md)

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:61](https://github.com/TuwaIO/satellite-connect/blob/76f200ba88ce70bc6938df1b9fbbdccaaa8c027a/packages/satellite-siwe-next-auth/src/types.ts#L61)

Session configuration settings for Iron Session.
