[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# useSiweSignature()

> **useSiweSignature**(`__namedParameters`): [`UseSiweSignatureResult`](../interfaces/UseSiweSignatureResult.md)

Defined in: [packages/satellite-siwe-next-auth/src/hooks/useSiweSignature.tsx:31](https://github.com/TuwaIO/satellite-connect/blob/eb3499f087e5b743f9f250b007921db519336c7a/packages/satellite-siwe-next-auth/src/hooks/useSiweSignature.tsx#L31)

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
