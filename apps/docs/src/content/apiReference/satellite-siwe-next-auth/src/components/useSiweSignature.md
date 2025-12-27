[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# useSiweSignature()

> **useSiweSignature**(`__namedParameters`): [`UseSiweSignatureResult`](../interfaces/UseSiweSignatureResult.md)

Defined in: [packages/satellite-siwe-next-auth/src/hooks/useSiweSignature.tsx:31](https://github.com/TuwaIO/satellite-connect/blob/82df95a5dc3a3bae59d1d18b3a499206af825e4b/packages/satellite-siwe-next-auth/src/hooks/useSiweSignature.tsx#L31)

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
