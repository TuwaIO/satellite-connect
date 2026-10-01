import type { SatelliteSiwxState } from '@tuwaio/satellite-core';
import type { createEVMConnectionsWatcher } from '@tuwaio/satellite-evm';
import { type Config, hydrate } from '@wagmi/core';
import { useContext, useEffect, useMemo, useState } from 'react';

import { SatelliteStoreContext, useSatelliteConnectStore } from '../hooks/satelliteHook';
import { useStableSiwxState } from '../hooks/useStableSiwxState';

/**
 * Props for the {@link EVMConnectorsWatcher} component.
 */
export interface EVMConnectorsWatcherProps {
  /**
   * The wagmi `Config` from `@wagmi/core` that the EVM adapter uses. Its connections are watched with
   * `watchConnections`. A config created with `ssr: true` is hydrated by the watcher (see {@link EVMConnectorsWatcher}).
   */
  wagmiConfig: Config;

  /**
   * Optional Sign-In With X (SIWX) session state, for example the result of `useSiwxSession()` from
   * `@tuwaio/siwx-react`. The watcher is restarted when one of its fields changes.
   */
  siwx?: SatelliteSiwxState;

  /**
   * Legacy SIWE state, used only when `siwx` is not passed.
   *
   * @deprecated Pass `siwx` instead.
   */
  siwe?: {
    /** Whether the user rejected the sign-in or it failed. */
    isRejected?: boolean;
    /** Whether the user is signed in. */
    isSignedIn?: boolean;
    /** Whether sign-in is enabled. `false` turns off the disconnect on rejection. */
    enabled?: boolean;
  };
}

type CreateEVMConnectionsWatcher = typeof createEVMConnectionsWatcher;

// The wagmi configs hydrated by a watcher. Hydrating a config again would replace its live connections with the
// saved ones, so each config is hydrated once, even when the watcher mounts again.
const hydratedConfigs = new WeakSet<Config>();

// The part of the zustand `persist` API of the wagmi store that the watcher uses. wagmi types the store with the
// `zustand/persist` mutator, which resolves to `never` unless the `zustand/middleware` types of wagmi are loaded.
type WagmiStorePersist = {
  hasHydrated: () => boolean;
  onHydrate: (listener: () => void) => () => void;
};

/**
 * Hydrates a wagmi config created with `ssr: true` after mount, as `WagmiProvider` from `wagmi` does, unless something
 * else hydrates it. Until a config with `ssr: true` is hydrated, wagmi neither restores its saved state nor adds the
 * installed wallets found through EIP-6963 to its connectors.
 *
 * The hydration waits one task: `WagmiProvider` is a parent of the watcher, so its effect runs after this one. If the
 * config starts hydrating in the meantime (for example in `WagmiProvider`), or is already hydrated, nothing is done.
 * Otherwise `hydrate(wagmiConfig, { reconnectOnMount: false }).onMount()` from `@wagmi/core` reads the saved wagmi
 * state from the `storage` of the config, adds the EIP-6963 connectors and clears the saved connections: wagmi does
 * not reconnect, because `SatelliteConnectProvider` restores the last connection. Configs without `ssr: true` are
 * hydrated by wagmi when they are created and are left as they are.
 *
 * @param wagmiConfig - The wagmi config of the watcher.
 */
function useHydrateWagmiConfig(wagmiConfig: Config) {
  useEffect(() => {
    const { ssr, store } = wagmiConfig._internal;
    // A config without `storage` has no persist API
    const { persist } = store as { persist?: WagmiStorePersist };
    if (!ssr || !persist || persist.hasHydrated() || hydratedConfigs.has(wagmiConfig)) return;

    let hydratingElsewhere = false;
    const unsubscribe = persist.onHydrate(() => {
      hydratingElsewhere = true;
    });
    const timeout = setTimeout(() => {
      unsubscribe();
      if (hydratingElsewhere || persist.hasHydrated() || hydratedConfigs.has(wagmiConfig)) return;
      hydratedConfigs.add(wagmiConfig);
      hydrate(wagmiConfig, { reconnectOnMount: false })
        .onMount()
        .catch((error: unknown) => console.warn('Failed to hydrate the wagmi config:', error));
    }, 0);

    return () => {
      clearTimeout(timeout);
      unsubscribe();
    };
  }, [wagmiConfig]);
}

/**
 * Runs `createEVMConnectionsWatcher` with the current store state and props, and restarts it when they change.
 *
 * @param props - Watcher props plus the loaded `createEVMConnectionsWatcher`.
 * @param props.createWatcher - `createEVMConnectionsWatcher` from `@tuwaio/satellite-evm`.
 * @param props.wagmiConfig - The wagmi config to watch.
 * @param props.siwx - Optional SIWX session state.
 * @param props.siwe - Deprecated SIWE state.
 * @returns `null`.
 */
function EVMConnectionsSync({
  createWatcher,
  wagmiConfig,
  siwx,
  siwe,
}: EVMConnectorsWatcherProps & { createWatcher: CreateEVMConnectionsWatcher }) {
  const activeConnection = useSatelliteConnectStore((store) => store.activeConnection);
  const disconnect = useSatelliteConnectStore((store) => store.disconnect);
  const connectionError = useSatelliteConnectStore((store) => store.connectionError);
  const updateActiveConnection = useSatelliteConnectStore((store) => store.updateActiveConnection);
  const store = useContext(SatelliteStoreContext);

  const stableSiwx = useStableSiwxState(siwx);
  const hasSiwe = siwe !== undefined;
  const siweEnabled = siwe?.enabled;
  const siweIsSignedIn = siwe?.isSignedIn;
  const siweIsRejected = siwe?.isRejected;
  const stableSiwe = useMemo(
    () => (hasSiwe ? { enabled: siweEnabled, isSignedIn: siweIsSignedIn, isRejected: siweIsRejected } : undefined),
    [hasSiwe, siweEnabled, siweIsSignedIn, siweIsRejected],
  );

  useEffect(
    () =>
      createWatcher(
        { wagmiConfig, siwx: stableSiwx, siwe: stableSiwe },
        {
          disconnect,
          updateActiveConnection,
          // The watcher reads the current store state on every wagmi event
          getState: () => store?.getState() ?? { activeConnection, connectionError },
        },
      ),
    // The watcher also checks the SIWX state and the active connection when it starts, so it is restarted when the
    // connector or the error changes, not on every update of the connection (the watcher itself updates it).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      createWatcher,
      store,
      wagmiConfig,
      stableSiwx,
      stableSiwe,
      activeConnection?.connectorType,
      connectionError,
      disconnect,
      updateActiveConnection,
    ],
  );

  return null;
}

/**
 * Headless component that keeps the Satellite Connect store in sync with wagmi. Render it once inside
 * `SatelliteConnectProvider`, next to an EVM adapter created with the same `wagmiConfig`.
 *
 * After mount it loads `@tuwaio/satellite-evm` with a dynamic import and runs its `createEVMConnectionsWatcher`: account
 * and network changes made in the wallet update the active connection, a wallet disconnect removes it, and with `siwx`
 * the connection is disconnected when the SIWX sign-in is rejected or fails, or when the account or chain no longer
 * matches the signed-in session. The watcher restarts when `wagmiConfig`, a field of `siwx`, the active connector or
 * the connection error changes, and stops on unmount. If the import fails, a warning is logged and nothing is watched.
 *
 * A `wagmiConfig` created with `ssr: true` is hydrated by the watcher, so no `WagmiProvider` from `wagmi` is needed:
 * until such a config is hydrated, wagmi does not add the installed wallets found through EIP-6963 (MetaMask, Rabby…)
 * to its connectors. One task after mount, unless the config is already hydrating (for example in a `WagmiProvider`
 * around the app), the watcher calls `hydrate(wagmiConfig, { reconnectOnMount: false }).onMount()` from `@wagmi/core`
 * once per config. It reads the saved wagmi state from the `storage` of the config (`localStorage` by default), adds
 * the EIP-6963 wallets and clears the saved wagmi connections; the last wallet is reconnected by
 * `SatelliteConnectProvider`, not by wagmi. If the hydration fails, a warning is logged.
 *
 * @param props - The component props. See {@link EVMConnectorsWatcherProps}.
 * @returns `null`; the component renders nothing.
 *
 * @example
 * ```tsx
 * import { EVMConnectorsWatcher } from '@tuwaio/satellite-react/evm';
 * import { useSiwxSession } from '@tuwaio/siwx-react';
 * import type { Config } from '@wagmi/core';
 *
 * export function WatcherContainer({ wagmiConfig }: { wagmiConfig: Config }) {
 *   const siwxSession = useSiwxSession();
 *   return <EVMConnectorsWatcher wagmiConfig={wagmiConfig} siwx={siwxSession} />;
 * }
 * ```
 */
export function EVMConnectorsWatcher(props: EVMConnectorsWatcherProps) {
  const [createWatcher, setCreateWatcher] = useState<CreateEVMConnectionsWatcher | null>(null);

  useHydrateWagmiConfig(props.wagmiConfig);

  // Load the watcher dynamically
  useEffect(() => {
    let active = true;
    import('@tuwaio/satellite-evm')
      .then((satelliteEVM) => {
        if (active) setCreateWatcher(() => satelliteEVM.createEVMConnectionsWatcher);
      })
      .catch((error: unknown) => console.warn('Failed to load EVM watcher:', error));
    return () => {
      active = false;
    };
  }, []);

  // This is a headless component, so it renders nothing itself
  return createWatcher ? <EVMConnectionsSync createWatcher={createWatcher} {...props} /> : null;
}
