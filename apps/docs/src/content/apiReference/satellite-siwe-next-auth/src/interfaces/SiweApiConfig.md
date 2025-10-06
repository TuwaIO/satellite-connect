[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SiweApiConfig

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:59](https://github.com/TuwaIO/satellite-connect/blob/9f8bdfdc0fd5ac99db1856a9609370f06e17bdd9/packages/satellite-siwe-next-auth/src/types.ts#L59)

The complete configuration object for the SIWE API handler factory.

## Properties

### options?

> `optional` **options**: [`SiweApiHooks`](SiweApiHooks.md)

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:63](https://github.com/TuwaIO/satellite-connect/blob/9f8bdfdc0fd5ac99db1856a9609370f06e17bdd9/packages/satellite-siwe-next-auth/src/types.ts#L63)

Custom callback hooks for various steps of the SIWE process.

***

### session?

> `optional` **session**: [`SiweSessionSettings`](SiweSessionSettings.md)

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:61](https://github.com/TuwaIO/satellite-connect/blob/9f8bdfdc0fd5ac99db1856a9609370f06e17bdd9/packages/satellite-siwe-next-auth/src/types.ts#L61)

Session configuration settings for Iron Session.
