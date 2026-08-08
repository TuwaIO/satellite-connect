[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# UnconfigurableMessageOptions

> **UnconfigurableMessageOptions** = `object`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:88](https://github.com/TuwaIO/satellite-connect/blob/14fc0ca0123c800fae79d624a6790de1a4d58720/packages/satellite-siwe-next-auth/src/types.ts#L88)

## Properties

### address

> **address**: `Address`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:89](https://github.com/TuwaIO/satellite-connect/blob/14fc0ca0123c800fae79d624a6790de1a4d58720/packages/satellite-siwe-next-auth/src/types.ts#L89)

The Ethereum address signing the message (Viem type).

***

### chainId

> **chainId**: `number`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:90](https://github.com/TuwaIO/satellite-connect/blob/14fc0ca0123c800fae79d624a6790de1a4d58720/packages/satellite-siwe-next-auth/src/types.ts#L90)

The chain ID of the network.

***

### nonce

> **nonce**: `string`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:91](https://github.com/TuwaIO/satellite-connect/blob/14fc0ca0123c800fae79d624a6790de1a4d58720/packages/satellite-siwe-next-auth/src/types.ts#L91)

A unique, session-bound nonce from NextAuth CSRF token.
