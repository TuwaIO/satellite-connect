[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SiweNextAuthProvider()

> **SiweNextAuthProvider**(`props`): `Element`

Defined in: [packages/satellite-siwe-next-auth/src/provider/SiweNextAuthProvider.tsx:15](https://github.com/TuwaIO/satellite-connect/blob/a2023542425f2f8ef12f4e6edc98d8137a07f84e/packages/satellite-siwe-next-auth/src/provider/SiweNextAuthProvider.tsx#L15)

## Parameters

### props

[`SiweNextAuthProviderProps`](../interfaces/SiweNextAuthProviderProps.md)

## Returns

`Element`

## Component

## Name

SiweNextAuthProvider

## Description

Universal Provider for Sign-In with Ethereum (SIWE) using NextAuth.js.
This component handles the SIWE authentication logic.
It must be nested inside NextAuth's `<SessionProvider>` and your Wagmi Provider.
* **Note**: This provider requires the server-side NextAuth configuration to be set up.
