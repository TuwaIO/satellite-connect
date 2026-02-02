[**@tuwaio/satellite-connect-monorepo**](../../../README.md)

***

# useSiweAuth()

> **useSiweAuth**(`options?`): [`SiweAuthContextType`](../interfaces/SiweAuthContextType.md)

Defined in: [packages/satellite-siwe-next-auth/src/hooks/useSiweAuth.tsx:18](https://github.com/TuwaIO/satellite-connect/blob/af9cadb1101a466ee817da8a66054d39344d0728/packages/satellite-siwe-next-auth/src/hooks/useSiweAuth.tsx#L18)

**`Function`**

useSiweAuth

## Parameters

### options?

Optional callbacks that override provider-level callbacks.

#### onSignIn?

(`session?`) => `void`

Callback executed after a successful sign-in.

#### onSignOut?

() => `void`

Callback executed after a successful sign-out.

## Returns

[`SiweAuthContextType`](../interfaces/SiweAuthContextType.md)

*

## Description

Hook to access the SIWE authentication state and methods.

## Example

```ts
// const { isSignedIn, signInWithSiwe, data, isRejected } = useSiweAuth();
```
