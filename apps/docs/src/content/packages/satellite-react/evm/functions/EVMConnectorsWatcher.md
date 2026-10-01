# EVMConnectorsWatcher()

> **EVMConnectorsWatcher**(`props`): `Element` \| `null`

Defined in: [satellite-react/src/evm/EVMConnectorsWatcher.tsx:189](https://github.com/TuwaIO/satellite-connect/blob/main/packages/satellite-react/src/evm/EVMConnectorsWatcher.tsx#L189)

Headless component that keeps the Satellite Connect store in sync with wagmi. Render it once inside
`SatelliteConnectProvider`, next to an EVM adapter created with the same `wagmiConfig`.

After mount it loads `@tuwaio/satellite-evm` with a dynamic import and runs its `createEVMConnectionsWatcher`: account
and network changes made in the wallet update the active connection, a wallet disconnect removes it, and with `siwx`
the connection is disconnected when the SIWX sign-in is rejected or fails, or when the account or chain no longer
matches the signed-in session. The watcher restarts when `wagmiConfig`, a field of `siwx`, the active connector or
the connection error changes, and stops on unmount. If the import fails, a warning is logged and nothing is watched.

A `wagmiConfig` created with `ssr: true` is hydrated by the watcher, so no `WagmiProvider` from `wagmi` is needed:
until such a config is hydrated, wagmi does not add the installed wallets found through EIP-6963 (MetaMask, Rabby…)
to its connectors. One task after mount, unless the config is already hydrating (for example in a `WagmiProvider`
around the app), the watcher calls `hydrate(wagmiConfig, { reconnectOnMount: false }).onMount()` from `@wagmi/core`
once per config. It reads the saved wagmi state from the `storage` of the config (`localStorage` by default), adds
the EIP-6963 wallets and clears the saved wagmi connections; the last wallet is reconnected by
`SatelliteConnectProvider`, not by wagmi. If the hydration fails, a warning is logged.

## Parameters

### props

[`EVMConnectorsWatcherProps`](/packages/satellite-react/evm/interfaces/EVMConnectorsWatcherProps.md)

The component props. See [EVMConnectorsWatcherProps](/packages/satellite-react/evm/interfaces/EVMConnectorsWatcherProps.md).

## Returns

`Element` \| `null`

`null`; the component renders nothing.

## Example

```tsx
import { EVMConnectorsWatcher } from '@tuwaio/satellite-react/evm';
import { useSiwxSession } from '@tuwaio/siwx-react';
import type { Config } from '@wagmi/core';

export function WatcherContainer({ wagmiConfig }: { wagmiConfig: Config }) {
  const siwxSession = useSiwxSession();
  return <EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwx={siwxSession} />;
}
```
