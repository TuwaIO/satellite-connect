[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# UnconfigurableMessageOptions

> **UnconfigurableMessageOptions** = `object`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:88](https://github.com/TuwaIO/satellite-connect/blob/3f5b07315cb97c4319f66a4a3cf4b3c1646a1d35/packages/satellite-siwe-next-auth/src/types.ts#L88)

## Properties

### address

> **address**: `Address`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:89](https://github.com/TuwaIO/satellite-connect/blob/3f5b07315cb97c4319f66a4a3cf4b3c1646a1d35/packages/satellite-siwe-next-auth/src/types.ts#L89)

The Ethereum address signing the message (Viem type).

***

### chainId

> **chainId**: `number`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:90](https://github.com/TuwaIO/satellite-connect/blob/3f5b07315cb97c4319f66a4a3cf4b3c1646a1d35/packages/satellite-siwe-next-auth/src/types.ts#L90)

The chain ID of the network.

***

### nonce

> **nonce**: `string`

Defined in: [packages/satellite-siwe-next-auth/src/types.ts:91](https://github.com/TuwaIO/satellite-connect/blob/3f5b07315cb97c4319f66a4a3cf4b3c1646a1d35/packages/satellite-siwe-next-auth/src/types.ts#L91)

A unique, session-bound nonce from NextAuth CSRF token.
