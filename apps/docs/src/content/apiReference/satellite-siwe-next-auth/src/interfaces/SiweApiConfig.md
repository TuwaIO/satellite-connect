[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SiweApiConfig

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:60](https://github.com/TuwaIO/satellite-connect/blob/37ca8c9fa43367e76aa81ee7273e85b2c7c71109/packages/satellite-siwe-next-auth/src/types.ts#L60)

The complete configuration object for the SIWE API handler factory.

## Properties

### options?

> `optional` **options?**: [`SiweApiHooks`](SiweApiHooks.md)

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:64](https://github.com/TuwaIO/satellite-connect/blob/37ca8c9fa43367e76aa81ee7273e85b2c7c71109/packages/satellite-siwe-next-auth/src/types.ts#L64)

Custom callback hooks for various steps of the SIWE process.

***

### session?

> `optional` **session?**: [`SiweSessionSettings`](SiweSessionSettings.md)

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:62](https://github.com/TuwaIO/satellite-connect/blob/37ca8c9fa43367e76aa81ee7273e85b2c7c71109/packages/satellite-siwe-next-auth/src/types.ts#L62)

Session configuration settings for Iron Session.
