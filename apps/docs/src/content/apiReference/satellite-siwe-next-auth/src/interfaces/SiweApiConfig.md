[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# SiweApiConfig

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:60](https://github.com/TuwaIO/satellite-connect/blob/63d6f1ed4a16ccfb8a31b7db3cc0e888eaa5274e/packages/satellite-siwe-next-auth/src/types.ts#L60)

The complete configuration object for the SIWE API handler factory.

## Properties

### options?

> `optional` **options?**: [`SiweApiHooks`](SiweApiHooks.md)

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:64](https://github.com/TuwaIO/satellite-connect/blob/63d6f1ed4a16ccfb8a31b7db3cc0e888eaa5274e/packages/satellite-siwe-next-auth/src/types.ts#L64)

Custom callback hooks for various steps of the SIWE process.

***

### session?

> `optional` **session?**: [`SiweSessionSettings`](SiweSessionSettings.md)

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:62](https://github.com/TuwaIO/satellite-connect/blob/63d6f1ed4a16ccfb8a31b7db3cc0e888eaa5274e/packages/satellite-siwe-next-auth/src/types.ts#L62)

Session configuration settings for Iron Session.
