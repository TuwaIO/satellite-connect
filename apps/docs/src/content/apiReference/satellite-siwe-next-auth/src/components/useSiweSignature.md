[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# useSiweSignature()

> **useSiweSignature**(): [`UseSiweSignatureResult`](../interfaces/UseSiweSignatureResult.md)

Defined in: [packages/satellite-siwe-next-auth/src/hooks/useSiweSignature.tsx:31](https://github.com/TuwaIO/satellite-connect/blob/c337f9a8a23e924ee23b20305a08360b40fce7b0/packages/satellite-siwe-next-auth/src/hooks/useSiweSignature.tsx#L31)

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
