# SolanaConnectorsWatcher()

> **SolanaConnectorsWatcher**(`props?`): `Element` \| `null`

Defined in: [satellite-react/src/solana/SolanaConnectorsWatcher.tsx:99](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/solana/SolanaConnectorsWatcher.tsx#L99)

Headless component that keeps the Satellite Connect store in sync with the Solana wallets of the Wallet Standard.
Render it once inside `SatelliteConnectProvider`, next to a Solana adapter.

After mount it loads `@tuwaio/satellite-solana` and `@wallet-standard/react` with dynamic imports. Whenever the list
of registered wallets (from `useWallets`) changes, it runs `createSolanaConnectionsWatcher`: an account change in
the connected wallet updates the active connection and a wallet without accounts is disconnected. With `siwx`, the
connection is disconnected when the SIWX sign-in is rejected or fails, or when the account no longer matches the
signed-in session. It also runs when a field of `siwx`, the active connector or the connection error changes. If an
import fails, a warning is logged and nothing is watched.

## Parameters

### props?

[`SolanaConnectorsWatcherProps`](/packages/satellite-react/solana/interfaces/SolanaConnectorsWatcherProps.md) = `{}`

The component props. See [SolanaConnectorsWatcherProps](/packages/satellite-react/solana/interfaces/SolanaConnectorsWatcherProps.md).

## Returns

`Element` \| `null`

`null`; the component renders nothing.

## Example

```tsx
import { SolanaConnectorsWatcher } from '@tuwaio/satellite-react/solana';
import { useSiwxSession } from '@tuwaio/siwx-react';

export function WatcherContainer() {
  const siwxSession = useSiwxSession();
  return <SolanaConnectorsWatcher siwx={siwxSession} />;
}
```
