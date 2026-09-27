import {
  ConnectorType,
  formatConnectorName,
  getAdapterFromConnectorType,
  getConnectorTypeFromName,
  OrbitAdapter,
  TuwaErrorState,
} from '@tuwaio/orbit-core';
import type { SatelliteSiwxState } from '@tuwaio/satellite-core';
import type { UiWallet } from '@wallet-standard/ui';

import { SolanaConnection } from '../types';
import { unwrapUiWalletHandles } from './connectionUtils';
import { createSolanaMessageSigner, SolanaSignerTarget } from './signerUtils';

/**
 * Store state and actions used by {@link createSolanaConnectionsWatcher}. Pass the store's `disconnect` and
 * `updateActiveConnection` and its `getState`. Instead of `getState` you can pass the current `activeConnection` and
 * `connectionError`.
 */
export interface SolanaWatcherCallbacks {
  /** The active connection. Ignored when `getState` is passed. */
  activeConnection?: SolanaConnection;
  /**
   * Disconnects a connection; the store's `disconnect`.
   *
   * @param connectorType - The connector to disconnect.
   */
  disconnect: (connectorType: ConnectorType) => void;
  /**
   * The store's `connectionError`. While it is set, wallet changes are not copied to the store. Ignored when
   * `getState` is passed.
   */
  connectionError?: TuwaErrorState | string;
  /**
   * Merges fields into the active connection; the store's `updateActiveConnection`.
   *
   * @param connection - Fields to merge.
   */
  updateActiveConnection: (connection: Partial<SolanaConnection>) => void;
  /**
   * Returns the current store state, for example the store's `getState`. It is called once per run.
   *
   * @returns The current `activeConnection` and `connectionError`.
   */
  getState?: () => {
    /** The active connection. */
    activeConnection?: SolanaConnection;
    /** The connection error. */
    connectionError?: TuwaErrorState | string;
  };
}

/**
 * Configuration of {@link createSolanaConnectionsWatcher}.
 */
export interface SolanaWatcherConfig {
  /** The registered Wallet Standard wallets, for example from `useWallets()` of `@wallet-standard/react`. */
  wallets: readonly UiWallet[];
  /** Optional SIWX session state. See `SatelliteSiwxState` from `@tuwaio/satellite-core`. */
  siwx?: SatelliteSiwxState;
}

/**
 * Copies the state of the connected Solana wallet into the Satellite Connect store, without a UI framework.
 * `SolanaConnectorsWatcher` from `@tuwaio/satellite-react/solana` runs it in React apps.
 *
 * The Wallet Standard has no connection events, so the function does not subscribe to anything: it checks the given
 * `wallets` once. Call it again whenever the wallets change (the React component calls it on every change of
 * `useWallets()`). Each call:
 * - disconnects the active connection when the SIWX sign-in was rejected or failed (see `SatelliteSiwxState` from
 *   `@tuwaio/satellite-core`);
 * - when the active connection is a Solana connection, finds its wallet in `wallets` by name and, while the user is
 *   signed in with SIWX, disconnects when the wallet's first account is not the session account;
 * - otherwise, unless `connectionError` is set or the sign-in was rejected, merges the wallet's first account, its
 *   handles and a new `signMessage` into the store when the address or connection state changed or `signMessage` is
 *   missing;
 * - disconnects the active connection when its wallet has no accounts left.
 *
 * @param config - The wallets and the optional SIWX state.
 * @param callbacks - Store state and actions.
 * @returns A cleanup function that does nothing, kept for symmetry with `createEVMConnectionsWatcher` from
 * `@tuwaio/satellite-evm`.
 *
 * @example
 * ```ts
 * import { getAvailableSolanaConnectors } from '@tuwaio/orbit-solana';
 * import { createSatelliteConnectStore } from '@tuwaio/satellite-core';
 * import {
 *   type ConnectorSolana,
 *   createSolanaConnectionsWatcher,
 *   satelliteSolanaAdapter,
 *   type SolanaConnection,
 * } from '@tuwaio/satellite-solana';
 *
 * const store = createSatelliteConnectStore<ConnectorSolana, SolanaConnection>({
 *   adapter: satelliteSolanaAdapter({ rpcUrls: { devnet: 'https://api.devnet.solana.com' } }),
 * });
 *
 * // Run after the user switches accounts in the wallet, for example on the wallet's `standard:events` change event.
 * export function syncSolanaWallets() {
 *   const { disconnect, updateActiveConnection } = store.getState();
 *   createSolanaConnectionsWatcher(
 *     { wallets: getAvailableSolanaConnectors() },
 *     { disconnect, updateActiveConnection, getState: store.getState },
 *   );
 * }
 * ```
 */
export function createSolanaConnectionsWatcher(
  config: SolanaWatcherConfig,
  callbacks: SolanaWatcherCallbacks,
): () => void {
  const { wallets, siwx } = config;
  const { disconnect, updateActiveConnection } = callbacks;
  // The current store state when `getState` is passed, otherwise the values passed in `callbacks`
  const { activeConnection, connectionError } = callbacks.getState?.() ?? callbacks;

  /**
   * Handles SIWX rejection scenarios.
   * If SIWX is enabled and the user has rejected signing, this will trigger a disconnect.
   *
   * @internal
   */
  const handleSiwxRejection = (): void => {
    const isRejected = siwx?.isRejected || siwx?.status === 'error';
    const isSignedIn = siwx?.isSignedIn ?? siwx?.isAuthenticated ?? false;
    const isEnabled = siwx?.enabled !== false;

    if (isEnabled && !isSignedIn && isRejected && activeConnection) {
      disconnect(activeConnection.connectorType);
    }
  };

  /**
   * Processes Solana wallet changes and updates the global store accordingly.
   * This function handles the core logic of monitoring Solana wallet state changes.
   *
   * @internal
   */
  const handleSolanaWalletChanges = (): void => {
    // Early return: Only process if we have an active Solana connection
    if (!activeConnection || getAdapterFromConnectorType(activeConnection.connectorType) !== OrbitAdapter.SOLANA) {
      return;
    }

    const matchingWallet = wallets.find(
      (wallet) =>
        getConnectorTypeFromName(OrbitAdapter.SOLANA, formatConnectorName(wallet.name)) ===
        activeConnection.connectorType,
    );

    const activeAddress = matchingWallet?.accounts[0]?.address;
    const sessionAddress = siwx?.address ?? siwx?.session?.address;
    const isSignedIn = siwx?.isSignedIn ?? siwx?.isAuthenticated ?? false;

    // Disconnect if address switched without matching SIWX session
    if (
      isSignedIn &&
      activeAddress &&
      sessionAddress &&
      activeAddress !== sessionAddress &&
      !sessionAddress.endsWith(activeAddress)
    ) {
      disconnect(activeConnection.connectorType);
      return;
    }

    const isRejected = siwx?.isRejected || siwx?.status === 'error';

    // Skip processing if there's a connection error or SIWX is rejected to prevent conflicting updates
    if (!connectionError && !isRejected && matchingWallet) {
      const account = matchingWallet.accounts[0];

      // Extract raw wallet standard objects from UI handles
      const { wallet: rawWallet, account: rawAccount } = unwrapUiWalletHandles(matchingWallet, account);

      const signerTarget: SolanaSignerTarget = {
        account: rawAccount as unknown as Record<string, unknown>,
        wallet: rawWallet as unknown as Record<string, unknown>,
      };
      const newState: Partial<SolanaConnection> = {
        address: matchingWallet.accounts[0]?.address,
        isConnected: matchingWallet.accounts.length > 0,
        connectedAccount: matchingWallet.accounts[0],
        connectedWallet: matchingWallet,
        signMessage: createSolanaMessageSigner(signerTarget),
      };

      const hasChanged =
        newState.address !== activeConnection.address ||
        newState.isConnected !== activeConnection.isConnected ||
        !activeConnection.signMessage;

      if (hasChanged) {
        updateActiveConnection(newState);
      }
    }

    if (matchingWallet?.accounts.length === 0 && activeConnection.connectorType) {
      disconnect(activeConnection.connectorType);
    }
  };

  // Process initial SIWX rejection state
  handleSiwxRejection();

  // Execute initial wallet state processing
  handleSolanaWalletChanges();

  /**
   * Return a cleanup function.
   * Note: Unlike EVM watchers, Solana/Wallet Standard doesn't provide native
   * connection watchers, so we don't have any active subscriptions to clean up.
   * This function is provided for API consistency.
   */
  return (): void => {
    // Currently no cleanup is needed for Solana watchers
    // This is kept for future extensibility and API consistency
  };
}
