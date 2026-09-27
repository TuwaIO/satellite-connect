# SatelliteConnectProvider()

> **SatelliteConnectProvider**(`props`): `Element`

Defined in: [satellite-react/src/providers/SatelliteConnectProvider.tsx:63](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/providers/SatelliteConnectProvider.tsx#L63)

Creates the Satellite Connect store (`createSatelliteConnectStore` from `@tuwaio/satellite-core`) and provides it to
its children through [SatelliteStoreContext](/packages/satellite-react/react/variables/SatelliteStoreContext.md). Read it with [useSatelliteConnectStore](/packages/satellite-react/react/functions/useSatelliteConnectStore.md).

The store is created once, on the first render. When `adapter` or `callbackAfterConnected` changes, the new value
is passed to the store's `updateParameters`; the state is kept. Define adapters outside the component (or memoize
them), so a render does not create new adapter objects. After mount the provider
calls the store's `initializeAutoConnect(autoConnect ?? false)` once, which disconnects the wallets of every adapter,
cleans the recently connected list in `localStorage` and, with `autoConnect`, reconnects the last connected wallet.
Inside Safe{Wallet} it connects the Safe connector instead, with or without `autoConnect`. The store's
`isAutoConnectFinished` turns `true` when this is done.
Render the chain watchers (`EVMConnectorsWatcher` from `@tuwaio/satellite-react/evm`, `SolanaConnectorsWatcher`
from `@tuwaio/satellite-react/solana`) inside it to follow wallet changes.

## Parameters

### props

[`SatelliteConnectProviderProps`](/packages/satellite-react/react/interfaces/SatelliteConnectProviderProps.md)

The store parameters, `autoConnect` and `children`. See [SatelliteConnectProviderProps](/packages/satellite-react/react/interfaces/SatelliteConnectProviderProps.md).

## Returns

`Element`

The context provider.

## Example

```tsx
'use client';

import { SatelliteConnectProvider } from '@tuwaio/satellite-react';
import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';
import type { ReactNode } from 'react';

const solanaAdapter = satelliteSolanaAdapter({ rpcUrls: { devnet: 'https://api.devnet.solana.com' } });

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SatelliteConnectProvider
      adapter={solanaAdapter}
      autoConnect
      callbackAfterConnected={(connection) => console.log('Connected:', connection.address)}
    >
      {children}
    </SatelliteConnectProvider>
  );
}
```
