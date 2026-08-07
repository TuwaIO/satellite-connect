[**API Reference for TUWA Satellite headless wallet connectivity and session state management.**](../../../README.md)

***

# useSatelliteSiwx()

> **useSatelliteSiwx**(): `UseSiwxReturn` & `object`

Defined in: [packages/satellite-react/src/hooks/useSatelliteSiwx.ts:30](https://github.com/TuwaIO/satellite-connect/blob/ffb5e95869d930e01fb6ba1d2dc56e6beeaadf7f/packages/satellite-react/src/hooks/useSatelliteSiwx.ts#L30)

A wrapper around `@tuwaio/siwx-react` `useSiwx` hook that automatically
injects the appropriate chain signer (EVM or Solana) from the active
Satellite connection.

## Returns

`UseSiwxReturn` & `object`

## Example

```tsx
const { signIn, session, status } = useSatelliteSiwx();

await signIn({
  verifier: async (payload) => {
    const res = await fetch('/api/siwx/verify', { method: 'POST', body: JSON.stringify(payload) });
    return res.ok ? res.json() : null;
  }
});
```
