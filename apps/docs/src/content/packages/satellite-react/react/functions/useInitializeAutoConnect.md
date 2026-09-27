# useInitializeAutoConnect()

> **useInitializeAutoConnect**(`props`): `void`

Defined in: [satellite-react/src/hooks/useInitializeAutoConnect.tsx:52](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/hooks/useInitializeAutoConnect.tsx#L52)

Calls `initializeAutoConnect` once, in an effect after the component mounts (so only in the browser).
[SatelliteConnectProvider](/packages/satellite-react/react/functions/SatelliteConnectProvider.md) already uses it; call it yourself only with a store you create with
`createSatelliteConnectStore` from `@tuwaio/satellite-core`.

It runs once: later renders do not call `initializeAutoConnect` again. If it rejects, the error goes to the `onError`
of the latest render, so an inline `onError` needs no memoization. In development, React Strict Mode runs the
effect twice.

## Parameters

### props

[`InitializeAutoConnectProps`](/packages/satellite-react/react/interfaces/InitializeAutoConnectProps.md)

The initializer and the optional error handler. See [InitializeAutoConnectProps](/packages/satellite-react/react/interfaces/InitializeAutoConnectProps.md).

## Returns

`void`

## Example

```tsx
import { createSatelliteConnectStore } from '@tuwaio/satellite-core';
import { useInitializeAutoConnect } from '@tuwaio/satellite-react';
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';

const store = createSatelliteConnectStore({
  adapter: satelliteSolanaAdapter({ rpcUrls: { devnet: 'https://api.devnet.solana.com' } }),
});

export function AutoConnect() {
  useInitializeAutoConnect({
    initializeAutoConnect: () => store.getState().initializeAutoConnect(true),
    onError: (error) => console.warn('Auto-connect failed:', error.message),
  });
  return null;
}
```
