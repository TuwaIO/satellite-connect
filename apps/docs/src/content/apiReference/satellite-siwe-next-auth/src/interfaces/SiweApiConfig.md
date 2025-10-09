[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SiweApiConfig

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:59](https://github.com/TuwaIO/satellite-connect/blob/930fdeaad2ebc9b322f050387d7adc84f5a20805/packages/satellite-siwe-next-auth/src/types.ts#L59)

The complete configuration object for the SIWE API handler factory.

## Properties

### options?

> `optional` **options**: [`SiweApiHooks`](SiweApiHooks.md)

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:63](https://github.com/TuwaIO/satellite-connect/blob/930fdeaad2ebc9b322f050387d7adc84f5a20805/packages/satellite-siwe-next-auth/src/types.ts#L63)

Custom callback hooks for various steps of the SIWE process.

***

### session?

> `optional` **session**: [`SiweSessionSettings`](SiweSessionSettings.md)

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:61](https://github.com/TuwaIO/satellite-connect/blob/930fdeaad2ebc9b322f050387d7adc84f5a20805/packages/satellite-siwe-next-auth/src/types.ts#L61)

Session configuration settings for Iron Session.
