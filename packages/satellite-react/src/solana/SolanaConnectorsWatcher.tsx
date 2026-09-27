import type { SatelliteSiwxState } from '@tuwaio/satellite-core';
import type { createSolanaConnectionsWatcher } from '@tuwaio/satellite-solana';
import type { useWallets } from '@wallet-standard/react';
import { useContext, useEffect, useState } from 'react';

import { SatelliteStoreContext, useSatelliteConnectStore } from '../hooks/satelliteHook';
import { useStableSiwxState } from '../hooks/useStableSiwxState';

/**
 * Props for the {@link SolanaConnectorsWatcher} component.
 */
export interface SolanaConnectorsWatcherProps {
  /**
   * Optional Sign-In With X (SIWX) session state, for example the result of `useSiwxSession()` from
   * `@tuwaio/siwx-react`. The watcher runs again when one of its fields changes.
   */
  siwx?: SatelliteSiwxState;
}

/** The modules loaded by {@link SolanaConnectorsWatcher}. */
type SolanaWatcherModules = {
  createWatcher: typeof createSolanaConnectionsWatcher;
  useWallets: typeof useWallets;
};

/**
 * Runs `createSolanaConnectionsWatcher` with the registered Wallet Standard wallets, the current store state and
 * props, and runs it again when they change.
 *
 * @param props - Watcher props plus the loaded modules.
 * @param props.modules - `createSolanaConnectionsWatcher` from `@tuwaio/satellite-solana` and `useWallets` from
 * `@wallet-standard/react`.
 * @param props.siwx - Optional SIWX session state.
 * @returns `null`.
 */
function SolanaConnectionsSync({ modules, siwx }: SolanaConnectorsWatcherProps & { modules: SolanaWatcherModules }) {
  const wallets = modules.useWallets();
  const activeConnection = useSatelliteConnectStore((store) => store.activeConnection);
  const updateActiveConnection = useSatelliteConnectStore((store) => store.updateActiveConnection);
  const connectionError = useSatelliteConnectStore((store) => store.connectionError);
  const disconnect = useSatelliteConnectStore((store) => store.disconnect);
  const store = useContext(SatelliteStoreContext);
  const stableSiwx = useStableSiwxState(siwx);
  const { createWatcher } = modules;

  useEffect(
    () =>
      createWatcher(
        { wallets, siwx: stableSiwx },
        {
          disconnect,
          updateActiveConnection,
          getState: () => store?.getState() ?? { activeConnection, connectionError },
        },
      ),
    // The watcher reads the active connection when it runs. It runs again when the wallets or the connector change,
    // not on every update of the connection (the watcher itself updates it).
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      createWatcher,
      store,
      wallets,
      stableSiwx,
      activeConnection?.connectorType,
      connectionError,
      updateActiveConnection,
      disconnect,
    ],
  );

  return null;
}

/**
 * Headless component that keeps the Satellite Connect store in sync with the Solana wallets of the Wallet Standard.
 * Render it once inside `SatelliteConnectProvider`, next to a Solana adapter.
 *
 * After mount it loads `@tuwaio/satellite-solana` and `@wallet-standard/react` with dynamic imports. Whenever the list
 * of registered wallets (from `useWallets`) changes, it runs `createSolanaConnectionsWatcher`: an account change in
 * the connected wallet updates the active connection and a wallet without accounts is disconnected. With `siwx`, the
 * connection is disconnected when the SIWX sign-in is rejected or fails, or when the account no longer matches the
 * signed-in session. It also runs when a field of `siwx`, the active connector or the connection error changes. If an
 * import fails, a warning is logged and nothing is watched.
 *
 * @param props - The component props. See {@link SolanaConnectorsWatcherProps}.
 * @returns `null`; the component renders nothing.
 *
 * @example
 * ```tsx
 * import { SolanaConnectorsWatcher } from '@tuwaio/satellite-react/solana';
 * import { useSiwxSession } from '@tuwaio/siwx-react';
 *
 * export function WatcherContainer() {
 *   const siwxSession = useSiwxSession();
 *   return <SolanaConnectorsWatcher siwx={siwxSession} />;
 * }
 * ```
 */
export function SolanaConnectorsWatcher(props: SolanaConnectorsWatcherProps = {}) {
  const [modules, setModules] = useState<SolanaWatcherModules | null>(null);

  // Load the watcher and the Wallet Standard hook dynamically
  useEffect(() => {
    let active = true;
    Promise.all([import('@tuwaio/satellite-solana'), import('@wallet-standard/react')])
      .then(([satelliteSolana, walletStandardReact]) => {
        if (active) {
          setModules({
            createWatcher: satelliteSolana.createSolanaConnectionsWatcher,
            useWallets: walletStandardReact.useWallets,
          });
        }
      })
      .catch((error: unknown) => console.warn('Failed to load Solana watcher:', error));
    return () => {
      active = false;
    };
  }, []);

  // This is a headless component, so it renders nothing itself
  return modules ? <SolanaConnectionsSync modules={modules} {...props} /> : null;
}
