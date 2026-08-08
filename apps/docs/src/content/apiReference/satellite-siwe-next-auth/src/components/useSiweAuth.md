[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# useSiweAuth()

> **useSiweAuth**(`options?`): [`SiweAuthContextType`](../interfaces/SiweAuthContextType.md)

Defined in: [packages/satellite-siwe-next-auth/src/hooks/useSiweAuth.tsx:18](https://github.com/TuwaIO/satellite-connect/blob/471b799ec718c8b01877f1f886081d2f499b024b/packages/satellite-siwe-next-auth/src/hooks/useSiweAuth.tsx#L18)

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
