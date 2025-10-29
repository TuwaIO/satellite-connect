[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# useSiweSignature()

> **useSiweSignature**(`__namedParameters`): [`UseSiweSignatureResult`](../interfaces/UseSiweSignatureResult.md)

Defined in: [packages/satellite-siwe-next-auth/src/hooks/useSiweSignature.tsx:31](https://github.com/TuwaIO/satellite-connect/blob/862e1f7f7a0d3bec8f4708754109774c705e3721/packages/satellite-siwe-next-auth/src/hooks/useSiweSignature.tsx#L31)

**`Function`**

useSiweSignature

## Parameters

### \_\_namedParameters

#### wagmiConfig

`Config`

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
