[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# UnconfigurableMessageOptions

> **UnconfigurableMessageOptions** = `object`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:88](https://github.com/TuwaIO/satellite-connect/blob/cb9969d5f64e545e14b781ca259dce2fdbab5eeb/packages/satellite-siwe-next-auth/src/types.ts#L88)

## Properties

### address

> **address**: `Address`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:89](https://github.com/TuwaIO/satellite-connect/blob/cb9969d5f64e545e14b781ca259dce2fdbab5eeb/packages/satellite-siwe-next-auth/src/types.ts#L89)

The Ethereum address signing the message (Viem type).

***

### chainId

> **chainId**: `number`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:90](https://github.com/TuwaIO/satellite-connect/blob/cb9969d5f64e545e14b781ca259dce2fdbab5eeb/packages/satellite-siwe-next-auth/src/types.ts#L90)

The chain ID of the network.

***

### nonce

> **nonce**: `string`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:91](https://github.com/TuwaIO/satellite-connect/blob/cb9969d5f64e545e14b781ca259dce2fdbab5eeb/packages/satellite-siwe-next-auth/src/types.ts#L91)

A unique, session-bound nonce from NextAuth CSRF token.
