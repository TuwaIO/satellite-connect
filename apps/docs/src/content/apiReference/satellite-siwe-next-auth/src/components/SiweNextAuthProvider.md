[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# SiweNextAuthProvider()

> **SiweNextAuthProvider**(`props`): `Element`

Defined in: [packages/satellite-siwe-next-auth/src/provider/SiweNextAuthProvider.tsx:15](https://github.com/TuwaIO/satellite-connect/blob/a9c59d21dd2d9973e0bf3f8de40c612adc6daaeb/packages/satellite-siwe-next-auth/src/provider/SiweNextAuthProvider.tsx#L15)

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
