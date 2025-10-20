[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# SiweNextAuthProvider()

> **SiweNextAuthProvider**(`props`): `Element`

Defined in: [packages/satellite-siwe-next-auth/src/provider/SiweNextAuthProvider.tsx:15](https://github.com/TuwaIO/satellite-connect/blob/80c744e48bd0282af533cb9ca520149d8c1f125d/packages/satellite-siwe-next-auth/src/provider/SiweNextAuthProvider.tsx#L15)

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
