[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# useSiweSignature()

> **useSiweSignature**(): [`UseSiweSignatureResult`](../interfaces/UseSiweSignatureResult.md)

Defined in: [packages/satellite-siwe-next-auth/src/hooks/useSiweSignature.tsx:31](https://github.com/TuwaIO/satellite-connect/blob/702ae35d90aec8f4e5597194e84b948dfe79f526/packages/satellite-siwe-next-auth/src/hooks/useSiweSignature.tsx#L31)

**`Function`**

useSiweSignature

## Returns

[`UseSiweSignatureResult`](../interfaces/UseSiweSignatureResult.md)

*

## Description

A low-level hook that handles the core SIWE cryptographic flow:
getting the nonce, creating the message, and getting the signature using Wagmi/Viem.
This is the building block for custom backend authentication.

## Example

```ts
// const { getSiweSignature, isReadyToSign, isRejected } = useSiweSignature();
```
