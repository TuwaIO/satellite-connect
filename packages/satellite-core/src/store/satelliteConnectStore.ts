import {
  ConnectorType,
  delay,
  getAdapterFromConnectorType,
  getConnectorTypeFromName,
  getWalletFromConnectorType,
  IMPERSONATED_CONNECTOR_ID,
  impersonatedHelpers,
  isInSecureIframe,
  lastConnectedConnectorHelpers,
  normalizeError,
  OrbitAdapter,
  recentlyConnectedConnectorsListHelpers,
  SAFE_CONNECTOR_ID,
  selectAdapterByKey,
} from '@tuwaio/orbit-core';
import { Immer } from 'immer';
import { createStore } from 'zustand/vanilla';

import {
  BaseConnector,
  Connector,
  ISatelliteConnectStore,
  SatelliteAdapter,
  SatelliteConnectionGate,
  SatelliteConnectStoreInitialParameters,
} from '../types';

// Connectors contain EventEmitter objects that must remain mutable, so this store never freezes its state. A local
// Immer instance keeps that setting out of the global `produce` used by the rest of the app.
const immer = new Immer({ autoFreeze: false });

// How long auto-connect waits for the last wallet to register (Wallet Standard and EIP-6963 wallets register after the
// page loads), and how often it looks
const WALLET_WAIT_MS = 1500;
const WALLET_POLL_MS = 100;

/**
 * Creates the Satellite Connect store: a vanilla Zustand store (`zustand/vanilla`) that holds the wallet connections
 * and the actions described in {@link ISatelliteConnectStore}. It has no UI and no framework dependency;
 * `SatelliteConnectProvider` from `@tuwaio/satellite-react` creates one for React apps.
 *
 * Pass one adapter or an array of adapters (one per chain family) as `adapter`, and optionally a
 * `callbackAfterConnected`. Every call creates an independent store.
 *
 * The state lives in memory. The actions read and write these keys through the helpers of `@tuwaio/orbit-core`
 * (nothing is read or written on the server). The first two are in `localStorage` while `rememberWallet` is `true`
 * (the default) and in `sessionStorage`, until the tab closes, while it is `false`:
 * - `orbit-core:lastConnectedConnector`: `{ connectorType, chainId, address }` of the active connection, where
 *   `chainId` is the chain the wallet is connected to, as normalized by the adapter. Written by `connect`,
 *   `switchConnection`, `disconnect` while other connections remain, and `updateActiveConnection` when the active
 *   connection changes chain; removed when the last connection is disconnected. `initializeAutoConnect` reads it, and
 *   so does `@tuwaio/pulsar-solana`.
 * - `orbit-core:recentlyConnectedConnectorsListHelpers`: `{ [connectorType]: { address, disconnectedTimestamp, icon } }`,
 *   updated with the current time on every `connect`. `initializeAutoConnect` removes entries older than 7 days.
 * - `satellite-connect:impersonatedAddress`: removed by `initializeAutoConnect`, by `disconnectAll` and when the last
 *   connection is disconnected.
 *
 * `watchConnectors` subscribes to the adapters' `watchConnectors` only while it has subscribers, and only in the
 * browser: an in-memory subscription that nothing stores. The store never subscribes by itself.
 *
 * The store's Immer instance does not freeze state, because connections hold wallet objects that must stay mutable.
 * It does not change the global Immer settings of the app.
 *
 * @typeParam C - Type of the wallet connectors of the adapters.
 * @typeParam W - Chain-specific connection type.
 * @param params - Store parameters: `adapter` and the optional `callbackAfterConnected` and `rememberWallet`.
 * @returns The store (`StoreApi` from `zustand/vanilla`).
 *
 * @example
 * ```ts
 * import { createSatelliteConnectStore } from '@tuwaio/satellite-core';
 * import { type ConnectorEVM, type EVMConnection, satelliteEVMAdapter } from '@tuwaio/satellite-evm';
 * import { type Config } from '@wagmi/core';
 * import { mainnet } from 'viem/chains';
 *
 * declare const wagmiConfig: Config;
 *
 * const store = createSatelliteConnectStore<ConnectorEVM, EVMConnection>({
 *   adapter: satelliteEVMAdapter(wagmiConfig, [mainnet]),
 * });
 *
 * await store.getState().connect({ connectorType: 'evm:metamask', chainId: mainnet.id });
 * console.log(store.getState().activeConnection?.address, store.getState().connectionError?.message);
 * ```
 */
export function createSatelliteConnectStore<C, W extends BaseConnector = BaseConnector>(
  params: SatelliteConnectStoreInitialParameters<C, W>,
) {
  return createStore<ISatelliteConnectStore<C, W>>()((set, get) => {
    let internalParams = params;

    const adapterList = () =>
      Array.isArray(internalParams.adapter) ? internalParams.adapter : [internalParams.adapter];

    // Unlike `getAdapter`, never falls back to the adapter of another chain family
    const findAdapter = (adapterKey: OrbitAdapter) => adapterList().find((adapter) => adapter.key === adapterKey);

    // The chain of the Safe connector, or `undefined` outside Safe{Wallet}: the Safe Apps SDK of the connector answers
    // only inside a parent window with an allowed origin (and rejects elsewhere)
    const getSafeAppChainId = async () => {
      const evmAdapter = findAdapter(OrbitAdapter.EVM);
      if (!isInSecureIframe || !evmAdapter?.getSafeConnectorChainId) return undefined;
      try {
        return await evmAdapter.getSafeConnectorChainId();
      } catch {
        return undefined;
      }
    };

    // Where the connection is saved: localStorage for a remembered wallet, sessionStorage otherwise
    const memory = () => ({ remember: get().rememberWallet });

    // Whether the adapter lists the wallet among its connectors, by the connector type the adapters derive from the
    // connector name; `undefined` when a connector has no name to tell (an adapter of the app's own)
    const listsConnector = (adapterKey: OrbitAdapter, connectorType: string): boolean | undefined => {
      const adapter = findAdapter(adapterKey);
      if (!adapter) return false;
      const connectors = adapter.getConnectors().connectors as unknown[];
      const names = connectors.map((connector) => (connector as { name?: unknown } | null)?.name);
      if (names.some((name) => typeof name !== 'string')) return undefined;
      return names.some((name) => getConnectorTypeFromName(adapterKey, name as string) === connectorType);
    };

    // Waits up to WALLET_WAIT_MS for the wallet to register; `false` when it does not
    const waitForConnector = async (adapterKey: OrbitAdapter, connectorType: string): Promise<boolean> => {
      for (let waited = 0; ; waited += WALLET_POLL_MS) {
        if (listsConnector(adapterKey, connectorType) !== false) return true;
        if (waited >= WALLET_WAIT_MS) return false;
        await delay(null, WALLET_POLL_MS);
      }
    };

    // Counts `connect` calls, with the wallet of the last one. An attempt for another wallet is left behind by it: the user
    // moved on, so a window showed success under one wallet while another took the active place, and the error of a prompt
    // nobody was looking at showed under the wallet being connected
    let connectRun = 0;
    let lastConnectConnectorType: ConnectorType | undefined;

    // What a wallet must pass to count as connected. Apart from `internalParams`: a provider replaces those on
    // `updateParameters`, and this is set by another layer, such as Nova Connect
    let connectionGate: SatelliteConnectionGate<W> | undefined;

    // Whether the address has contract code. A node that does not answer says nothing of the wallet: with a public RPC down,
    // every first connection after a page load ended in an error screen, with the wallet connected behind it. The answer is
    // cached per page, and Try again found the wallet connected, so it looked as if only the first attempt failed
    const readContractAddress = async (adapter: SatelliteAdapter<C, W>, connector: Connector<W>) => {
      if (!adapter.checkIsContractAddress) return;
      try {
        const isContractAddress = await adapter.checkIsContractAddress({
          address: connector.address,
          chainId: connector.chainId,
        });
        // Update only the isContractAddress property
        get().updateActiveConnection({ ...connector, isContractAddress });
      } catch (e) {
        console.warn(`[Satellite] Could not check whether ${connector.address} is a contract:`, e);
      }
    };

    // The adapter makes every wallet that connects its current connection (wagmi keeps one), and the one that signs must stay
    // the active wallet
    const switchAdapterBackToActive = async (adapter: SatelliteAdapter<C, W>) => {
      const { activeConnection } = get();
      if (activeConnection && getAdapterFromConnectorType(activeConnection.connectorType) === adapter.key) {
        await adapter.switchConnection?.(activeConnection.connectorType);
      }
    };

    // A wallet left behind that answered after all. It joins the connections as a second wallet does, and nothing else of
    // `connect` runs for it. No disconnect: wagmi's injected connector would revoke what the user has just approved
    const addLeftBehindConnection = async (adapter: SatelliteAdapter<C, W>, connector: Connector<W>) => {
      set((state) => ({ connections: { ...state.connections, [connector.connectorType]: connector } }));

      await switchAdapterBackToActive(adapter);

      await readContractAddress(adapter, connector);
    };

    // Opens a connection with `open` (the adapter's `connect`, or a restore) and adds it to the store: the steps of
    // `connect`. When `open` resolves to `undefined` (a wallet that cannot be restored without a prompt), nothing changes
    const addConnection = async (
      connectorType: ConnectorType,
      chainId: number | string,
      open: (adapter: SatelliteAdapter<C, W>) => Promise<Connector<W> | undefined>,
      isRestore = false,
    ) => {
      const run = connectRun;
      const isLeftBehind = () => run !== connectRun && lastConnectConnectorType !== connectorType;

      set({ connecting: true, connectionError: undefined });
      const foundAdapter = findAdapter(getAdapterFromConnectorType(connectorType));

      if (!foundAdapter) {
        set({
          connecting: false,
          connectionError: normalizeError(new Error(`No adapter found for connector type: ${connectorType}`)),
        });
        return;
      }

      try {
        // 1. Check if connector is already connected
        const existingConnector = get().connections[connectorType];
        if (existingConnector) {
          if (existingConnector.address) {
            recentlyConnectedConnectorsListHelpers.addConnector(
              existingConnector.connectorType,
              {
                address: existingConnector.address,
                disconnectedTimestamp: Date.now(),
                icon: existingConnector.icon,
              },
              memory(),
            );
          }

          if (get().activeConnection?.connectorType !== connectorType) {
            await get().switchConnection(connectorType);
          }

          set({ connecting: false });
          return;
        }

        const connector = await open(foundAdapter);
        const gate = connectionGate;
        if (isLeftBehind() && !gate) {
          if (connector) await addLeftBehindConnection(foundAdapter, connector);
          return;
        }
        if (!connector) {
          if (!isLeftBehind()) set({ connecting: false });
          return;
        }

        // Before anything sees the wallet: a sign-in that came after the connection showed it connected, and a refusal took it
        // back. Nobody is asked for a wallet the user has moved on from
        if (gate) {
          let refusal: unknown;
          let isRefused = isLeftBehind();
          if (!isRefused) {
            try {
              await gate(connector, { isRestore });
            } catch (e) {
              isRefused = true;
              refusal = e;
            }
          }
          if (isRefused || isLeftBehind()) {
            // A restore stays open in the adapter: wagmi's injected connector would revoke the permission of the site, which a
            // click on the wallet then takes over with no second prompt
            if (!isRestore) await foundAdapter.disconnect(connector).catch(() => undefined);
            await switchAdapterBackToActive(foundAdapter).catch(() => undefined);
            if (isLeftBehind()) return;
            set(isRestore ? { connecting: false } : { connecting: false, connectionError: normalizeError(refusal) });
            return;
          }
        }

        // 2. Set initial connector state
        set((state) => {
          return {
            activeConnection: connector,
            connections: {
              ...state.connections,
              [connector.connectorType]: connector,
            },
          };
        });

        // 3. Check for contract address if the adapter supports it, on the chain the wallet is connected to
        await readContractAddress(foundAdapter, connector);

        // 4. Run callback if provided
        if (internalParams.callbackAfterConnected) {
          // Use the latest connector state after potential updates (like isContractAddress)
          const updatedConnector = get().activeConnection;
          if (updatedConnector && updatedConnector.connectorType === connectorType) {
            await internalParams.callbackAfterConnected(updatedConnector);
          }
        }

        // Another wallet was chosen meanwhile, such as during a sign-in of the callback: `connecting` and the last
        // connection are its own now
        if (isLeftBehind()) return;

        // 5. Final state updates
        set({ connecting: false });
        const connectedConnection = get().activeConnection;
        lastConnectedConnectorHelpers.setLastConnectedConnector(
          {
            connectorType,
            // The chain the wallet is connected to, as normalized by the adapter (not the requested one)
            chainId: connectedConnection?.chainId ?? chainId,
            address: connectedConnection?.address,
          },
          memory(),
        );

        // Add to recently connected list
        const activeConnection = get().activeConnection;
        if (activeConnection && activeConnection.address) {
          recentlyConnectedConnectorsListHelpers.addConnector(
            activeConnection.connectorType,
            {
              address: activeConnection.address,
              disconnectedTimestamp: Date.now(),
              icon: activeConnection.icon,
            },
            memory(),
          );
        }
      } catch (e) {
        if (isLeftBehind()) {
          console.warn(`[Satellite] ${connectorType}, left behind by a later connect, failed:`, e);
          return;
        }
        set({
          connecting: false,
          connectionError: normalizeError(e),
        });
      }
    };

    // The connections this page holds: those the adapters opened and still list as live (for example through an
    // earlier store on the same adapters) and those of the store, whose objects carry the wallet handles the adapters
    // need
    const getHeldConnections = async () => {
      const held = new Map<ConnectorType, Connector<W>>();
      for (const adapter of adapterList()) {
        try {
          for (const connection of (await adapter.getLiveConnections?.()) ?? []) {
            held.set(connection.connectorType, connection);
          }
        } catch {
          // An adapter that cannot list its connections has none to close here
        }
      }
      for (const connection of Object.values(get().connections) as Connector<W>[]) {
        held.set(connection.connectorType, connection);
      }
      return held;
    };

    // Disconnects the connections this page holds except the one of `keep`. Wallets this page does not hold are never
    // asked to disconnect: a wallet such as MetaMask revokes the site's permission for every tab of the origin
    const disconnectHeldConnections = async (keep?: ConnectorType) => {
      const closed: ConnectorType[] = [];
      for (const connection of (await getHeldConnections()).values()) {
        if (connection.connectorType === keep) continue;
        closed.push(connection.connectorType);
        try {
          await findAdapter(getAdapterFromConnectorType(connection.connectorType))?.disconnect(connection);
        } catch {
          // The connection is dropped from the store anyway
        }
      }
      if (closed.length === 0) return;
      set((state) =>
        immer.produce(state, (draft) => {
          for (const connectorType of closed) delete draft.connections[connectorType];
          if (draft.activeConnection && closed.includes(draft.activeConnection.connectorType)) {
            draft.activeConnection = keep ? draft.connections[keep] : undefined;
          }
        }),
      );
    };

    // Restores a wallet with the adapter's `reconnect` (no prompt) and adds it to the store as `connect` does. Without
    // `reconnect`, and with `connectWhenNotAuthorized` when `reconnect` resolves to `undefined`, it calls `connect`
    const restoreWallet = (connectorType: ConnectorType, chainId: number | string, connectWhenNotAuthorized: boolean) =>
      addConnection(
        connectorType,
        chainId,
        async (adapter) => {
          if (!adapter.reconnect) return adapter.connect({ connectorType, chainId });
          const connection = await adapter.reconnect({ connectorType, chainId });
          return connection ?? (connectWhenNotAuthorized ? adapter.connect({ connectorType, chainId }) : undefined);
        },
        true,
      );

    // Reconnects the wallet after a page load (see `initializeAutoConnect` in `ISatelliteConnectStore`). When a later
    // call has started (React Strict Mode runs effects twice in development), this one stops and leaves the work to it
    const restoreConnection = async (autoConnect: boolean, isSuperseded: () => boolean) => {
      await delay(null, 300);
      if (isSuperseded()) return;
      set({ connectionError: undefined, switchNetworkError: undefined });
      // An impersonated session does not survive a reload
      impersonatedHelpers.removeImpersonated();

      // Cleanup old recently connected connectors (older than 7 days)
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      recentlyConnectedConnectorsListHelpers.removeConnectorsOlderThan(sevenDaysAgo);

      // Inside Safe{Wallet} the Safe account is the wallet, with or without autoConnect
      const safeAppChainId = await getSafeAppChainId();
      if (safeAppChainId) {
        const safeConnectorType = getConnectorTypeFromName(OrbitAdapter.EVM, SAFE_CONNECTOR_ID);
        await disconnectHeldConnections(safeConnectorType);
        await delay(null, 100);
        if (isSuperseded()) return;
        await restoreWallet(safeConnectorType, safeAppChainId, true);
        return;
      }

      // A store that does not restore a wallet leaves every wallet as it is
      if (!autoConnect) return;

      const lastConnectedConnector = lastConnectedConnectorHelpers.getLastConnectedConnector();
      const isRestorable =
        !!lastConnectedConnector &&
        ![IMPERSONATED_CONNECTOR_ID, 'walletconnect', 'coinbase', 'coinbasewallet', 'bitgetwallet'].includes(
          getWalletFromConnectorType(lastConnectedConnector.connectorType) ?? '',
        ) &&
        // The same origin can hold a wallet of a chain family this app does not use (saved by another app)
        !!findAdapter(getAdapterFromConnectorType(lastConnectedConnector.connectorType));

      // Only the last active wallet comes back: close what else this page holds, and keep that wallet if it is held,
      // also one that is never restored automatically (a disconnect would end a WalletConnect session, for example)
      await disconnectHeldConnections(lastConnectedConnector?.connectorType);
      if (!isRestorable) return;

      // Keep saving it where it was saved: the user's choice of remembering the wallet holds after a reload
      const remembered = lastConnectedConnectorHelpers.isLastConnectedConnectorRemembered();
      if (remembered !== undefined) set({ rememberWallet: remembered });
      await delay(null, 100);
      // A wallet that is gone (the extension was removed) is forgotten without an error, so later loads do not
      // wait for it; it stays among the recent wallets
      const adapterKey = getAdapterFromConnectorType(lastConnectedConnector.connectorType);
      if (!(await waitForConnector(adapterKey, lastConnectedConnector.connectorType))) {
        lastConnectedConnectorHelpers.removeLastConnectedConnector();
        return;
      }
      if (isSuperseded()) return;
      // A wallet that no longer authorizes the app is skipped without a prompt; its last connection is kept
      await restoreWallet(lastConnectedConnector.connectorType, lastConnectedConnector.chainId, false);
    };

    // Counts `initializeAutoConnect` calls: only the last one started sets `isAutoConnectFinished`
    let autoConnectRun = 0;

    // Subscriptions of `watchConnectors`. One object per call, so the same function subscribed twice stops separately
    const connectorSubscribers = new Set<{ onChange: () => void }>();
    // Stops the adapter subscriptions; set while at least one subscriber exists
    let stopWatchingAdapters: (() => void) | undefined;

    // Runs every subscriber. A failing subscriber must not break the others, nor the update of the wallet library that
    // reported the change (wagmi calls this inside the `setState` of its connectors store)
    const notifyConnectorSubscribers = () => {
      for (const subscriber of [...connectorSubscribers]) {
        // A subscriber stopped by an earlier one during this event is not called
        if (!connectorSubscribers.has(subscriber)) continue;
        try {
          subscriber.onChange();
        } catch (error) {
          console.error('Satellite Connect: a watchConnectors subscriber failed:', error);
        }
      }
    };

    // Subscribes to every adapter that can tell when its wallets change. An adapter that fails to subscribe or to stop
    // is logged and skipped, so the others are still followed and stopped
    const watchAdapters = () => {
      const stops: (() => void)[] = [];
      for (const adapter of adapterList()) {
        if (!adapter.watchConnectors) continue;
        try {
          const stop = adapter.watchConnectors(notifyConnectorSubscribers);
          if (typeof stop === 'function') stops.push(stop);
        } catch (error) {
          console.error(`Satellite Connect: the ${adapter.key} adapter cannot watch its wallets:`, error);
        }
      }
      return () => {
        for (const stop of stops) {
          try {
            stop();
          } catch (error) {
            console.error('Satellite Connect: an adapter failed to stop watching its wallets:', error);
          }
        }
      };
    };

    return {
      /**
       * Updates store initialization parameters dynamically. Subscriptions of `watchConnectors` move to new adapters
       */
      updateParameters: (newParams: SatelliteConnectStoreInitialParameters<C, W>) => {
        const before = adapterList();
        internalParams = newParams;
        const after = adapterList();
        // A provider may pass a new array of the same adapter objects: nothing to move then
        const sameAdapters = before.length === after.length && before.every((adapter, i) => adapter === after[i]);
        if (sameAdapters || !stopWatchingAdapters) return;
        stopWatchingAdapters();
        stopWatchingAdapters = watchAdapters();
        notifyConnectorSubscribers();
      },

      watchConnectors: (onChange) => {
        // No wallet is added on the server, and a subscription there would outlive the request
        if (typeof window === 'undefined') return () => undefined;
        stopWatchingAdapters ??= watchAdapters();
        const subscriber = { onChange };
        connectorSubscribers.add(subscriber);
        return () => {
          if (!connectorSubscribers.delete(subscriber) || connectorSubscribers.size > 0) return;
          stopWatchingAdapters?.();
          stopWatchingAdapters = undefined;
        };
      },

      /**
       * Returns active adapter
       */
      getAdapter: (adapterKey) => selectAdapterByKey({ adapter: internalParams.adapter, adapterKey }),

      /**
       * Get connectors for all configured adapters
       */
      getConnectors: () => {
        let results: { adapter: OrbitAdapter; connectors: C[] }[];

        if (Array.isArray(internalParams.adapter)) {
          results = internalParams.adapter.map((a) => a.getConnectors());
        } else {
          // Ensure the single adapter result is wrapped in an array for consistent processing
          results = [internalParams.adapter.getConnectors()];
        }

        return results.reduce(
          (accumulator, currentResult) => {
            const key = currentResult.adapter;
            const value = currentResult.connectors;
            return {
              ...accumulator,
              [key]: value,
            };
          },
          {} as Partial<Record<OrbitAdapter, C[]>>,
        );
      },

      initializeAutoConnect: async (autoConnect) => {
        const run = ++autoConnectRun;
        const connectRunAtStart = connectRun;
        set({ isAutoConnectFinished: false });
        try {
          // A wallet the user chooses meanwhile comes before the one of the last visit
          await restoreConnection(autoConnect, () => run !== autoConnectRun || connectRun !== connectRunAtStart);
        } finally {
          // Overlapping calls (React Strict Mode runs effects twice in development) finish in any order
          if (run === autoConnectRun) set({ isAutoConnectFinished: true });
        }
      },

      isAutoConnectFinished: false,
      rememberWallet: params.rememberWallet ?? true,
      setRememberWallet: (remember) => {
        set({ rememberWallet: remember });
        const { activeConnection, connections } = get();
        if (activeConnection) {
          lastConnectedConnectorHelpers.setLastConnectedConnector(
            {
              connectorType: activeConnection.connectorType,
              chainId: activeConnection.chainId,
              address: activeConnection.address,
            },
            { remember },
          );
        }
        // The recent entries of the connected wallets follow the choice; other recent wallets keep theirs
        for (const connectorType of Object.keys(connections) as ConnectorType[]) {
          const recent = recentlyConnectedConnectorsListHelpers.getConnector(connectorType);
          if (recent) recentlyConnectedConnectorsListHelpers.addConnector(connectorType, recent, { remember });
        }
      },
      connecting: false,
      disconnecting: false,
      connectionError: undefined,
      switchNetworkError: undefined,
      activeConnection: undefined,
      connections: {},

      setConnectionError: (error) => set({ connectionError: error }),

      setConnectionGate: (gate) => {
        connectionGate = gate;
      },

      /**
       * Connects to a connector
       * @param connectorType - Type of connector to connect to
       * @param chainId - Chain ID to connect on
       */
      connect: ({ connectorType, chainId }) => {
        connectRun += 1;
        lastConnectConnectorType = connectorType;
        return addConnection(connectorType, chainId, (adapter) => adapter.connect({ connectorType, chainId }));
      },

      /**
       * Disconnects the currently active wallet or a specific wallet
       */
      disconnect: async (connectorType?: string) => {
        // Guard against re-entry
        if (get().disconnecting) return;
        set({ disconnecting: true });

        try {
          if (connectorType) {
            // Disconnect specific connector
            const currentState = get();
            const connectorToDisconnect = currentState.connections[connectorType as ConnectorType];

            if (!connectorToDisconnect) {
              console.warn(`No connection found for connector type: ${connectorType}`);
              return;
            }

            // 1. Disconnect at adapter level
            const foundAdapter = get().getAdapter(getAdapterFromConnectorType(connectorToDisconnect.connectorType));
            if (foundAdapter) {
              try {
                await foundAdapter.disconnect(connectorToDisconnect);
              } catch (e) {
                console.error(`Failed to disconnect connector ${connectorType}:`, e);
                // Continue with state cleanup even if adapter disconnect fails
              }
            }

            // 2. Determine if we need to switch to another connector
            const wasActiveConnection = currentState.activeConnection?.connectorType === connectorType;
            const remainingConnectors = Object.values(currentState.connections).filter(
              (conn) => conn.connectorType !== connectorType,
            );

            let newActiveConnection: typeof currentState.activeConnection = undefined;

            // 3. If the disconnected connector was active and there are remaining ones, switch first
            if (wasActiveConnection && remainingConnectors.length > 0) {
              const candidateConnection = remainingConnectors[0];

              try {
                const newAdapter = get().getAdapter(getAdapterFromConnectorType(candidateConnection.connectorType));
                if (newAdapter?.switchConnection) {
                  await newAdapter.switchConnection(candidateConnection.connectorType);
                }
                // The active wallet is one that has passed: this one may not have, for the session of now
                await connectionGate?.(candidateConnection as Connector<W>, { isRestore: false });
                // Only set as active if switchConnection succeeded
                newActiveConnection = candidateConnection;
              } catch (e) {
                console.error('Failed to switch to remaining connector:', e);
                // If switching fails, we'll leave activeConnection as undefined
                newActiveConnection = undefined;
              }
            } else if (!wasActiveConnection) {
              // If the disconnected connector wasn't active, keep the current active connection
              newActiveConnection = currentState.activeConnection;
            }

            // 4. Update state atomically using produce
            set((state) =>
              immer.produce(state, (draft) => {
                // Remove the disconnected connector
                delete draft.connections[connectorType as ConnectorType];

                // Set the new active connection (could be undefined, another connector, or unchanged)
                draft.activeConnection = newActiveConnection as typeof draft.activeConnection;

                // Clear errors
                draft.connectionError = undefined;
                draft.switchNetworkError = undefined;
              }),
            );
          } else {
            // Disconnect ALL connectors
            await get().disconnectAll();
          }

          // 5. Handle storage updates
          const finalState = get();
          if (Object.keys(finalState.connections).length === 0) {
            lastConnectedConnectorHelpers.removeLastConnectedConnector();
            impersonatedHelpers.removeImpersonated();
          } else if (finalState.activeConnection) {
            // Update last connected to the current active one
            lastConnectedConnectorHelpers.setLastConnectedConnector(
              {
                connectorType: finalState.activeConnection.connectorType,
                chainId: finalState.activeConnection.chainId,
                address: finalState.activeConnection.address,
              },
              memory(),
            );
          }
        } catch (e) {
          console.error('Disconnect operation failed:', e);
          // Set error state if needed
          set((state) =>
            immer.produce(state, (draft) => {
              draft.connectionError = normalizeError(e);
            }),
          );
        } finally {
          set({ disconnecting: false });
        }
      },

      disconnectAll: async () => {
        // Every connection of the store through its own adapter (the connection carries the wallet handles), then
        // whatever each adapter still holds in this page
        for (const connection of Object.values(get().connections) as Connector<W>[]) {
          try {
            await findAdapter(getAdapterFromConnectorType(connection.connectorType))?.disconnect(connection);
          } catch {
            // Errors are ignored
          }
        }
        await Promise.allSettled(adapterList().map(async (adapter) => adapter.disconnect()));

        set({
          activeConnection: undefined,
          connections: {},
          connectionError: undefined,
          switchNetworkError: undefined,
        });
        impersonatedHelpers.removeImpersonated();
      },

      /**
       * Contains error message if connection failed
       */
      // connectionError is declared above with an initial value

      /**
       * Resets any connection errors
       */
      resetConnectionError: () => {
        set({ connectionError: undefined });
      },

      /**
       * Updates the active connection's properties
       * @param connector - Partial connector object with properties to update
       */
      updateActiveConnection: (connector: Partial<Connector<W>>) => {
        const activeConnection = get().activeConnection;
        // Determine which connector to update. If connectorType is provided, use it. Otherwise use activeConnection.
        const targetConnectorType = connector.connectorType ?? activeConnection?.connectorType;

        if (targetConnectorType) {
          // If chainId is updated, update storage
          if (connector.chainId && targetConnectorType === activeConnection?.connectorType) {
            // Update lastConnectedConnector storage if chainId changes and it's the active connector
            lastConnectedConnectorHelpers.setLastConnectedConnector(
              {
                connectorType: targetConnectorType,
                chainId: connector.chainId,
                address: connector.address ?? activeConnection?.address,
              },
              memory(),
            );
          }

          // Use produce for immutable state update
          set((state) =>
            immer.produce(state, (draft) => {
              const existingConnection = draft.connections[targetConnectorType as ConnectorType];
              if (existingConnection) {
                // Extract data from Draft by casting to original type
                const currentData = existingConnection as Connector<W>;

                // Merge outside of draft context
                const updatedConnection: Connector<W> = {
                  ...currentData,
                  ...connector,
                } as Connector<W>;

                draft.connections[targetConnectorType as ConnectorType] =
                  updatedConnection as (typeof draft.connections)[ConnectorType];

                // Also update activeConnection if it matches
                const activeConnection = draft.activeConnection as Connector<W> | undefined;
                if (activeConnection?.connectorType === targetConnectorType) {
                  draft.activeConnection = updatedConnection as typeof draft.activeConnection;
                }
              }
            }),
          );
        } else {
          const isConnectorCanChange =
            connector.connectorType !== undefined && connector.chainId !== undefined && connector.address !== undefined;

          if (isConnectorCanChange) {
            lastConnectedConnectorHelpers.setLastConnectedConnector(
              {
                connectorType: connector.connectorType!,
                chainId: connector.chainId!,
                address: connector.address!,
              },
              memory(),
            );
            // It's a new connector or full replacement
            set((state) => {
              const newConnector = connector as Connector<W>;
              return {
                activeConnection: newConnector,
                connections: {
                  ...state.connections,
                  [newConnector.connectorType]: newConnector,
                },
              };
            });
          } else {
            console.warn(
              'Attempted to set activeConnection with incomplete data while activeConnection was undefined.',
            );
          }
        }
      },

      /**
       * Switches active connection from the list of connections
       */
      switchConnection: async (connectorType) => {
        const targetConnector = get().connections[connectorType as ConnectorType];
        if (!targetConnector) {
          console.warn(`No connection found for connector type: ${connectorType}`);
          return;
        }

        if (get().activeConnection?.connectorType === connectorType) {
          return;
        }

        try {
          const foundAdapter = get().getAdapter(getAdapterFromConnectorType(connectorType));
          if (foundAdapter?.switchConnection) {
            await foundAdapter.switchConnection(connectorType);
          }

          // After the switch of the adapter, as the wallet that signs is its current one
          if (connectionGate) {
            try {
              await connectionGate(targetConnector as Connector<W>, { isRestore: false });
            } catch (e) {
              if (foundAdapter) await switchAdapterBackToActive(foundAdapter).catch(() => undefined);
              set({ connectionError: normalizeError(e) });
              return;
            }
          }

          set((state) =>
            immer.produce(state, (draft) => {
              draft.activeConnection = targetConnector as typeof draft.activeConnection;
            }),
          );

          lastConnectedConnectorHelpers.setLastConnectedConnector(
            {
              connectorType: targetConnector.connectorType,
              chainId: targetConnector.chainId,
              address: targetConnector.address,
            },
            memory(),
          );
        } catch (e) {
          console.error('Failed to switch connection:', e);
        }
      },

      /**
       * Switches the connected connector to a different network
       * @param chainId - Target chain ID to switch to
       * @param connectorType - Optional connector type to switch to. If not provided, will switch to the active connection.
       */
      switchNetwork: async (chainId: string | number, connectorType?: string) => {
        set({ switchNetworkError: undefined });
        const targetConnector = connectorType
          ? get().connections[connectorType as ConnectorType]
          : get().activeConnection;

        if (targetConnector) {
          const foundAdapter = get().getAdapter(getAdapterFromConnectorType(targetConnector.connectorType));

          if (!foundAdapter) {
            set({
              switchNetworkError: normalizeError(
                new Error(`No adapter found for active connector type: ${targetConnector.connectorType}`),
              ),
            });
            return;
          }

          try {
            // Pass the local updateActiveConnection method from 'get()' to the adapter
            await foundAdapter.checkAndSwitchNetwork(chainId, targetConnector.chainId, get().updateActiveConnection);
          } catch (e) {
            set({ switchNetworkError: normalizeError(e) });
          }
        }
      },

      /**
       * Contains error message if network switch failed
       */
      // switchNetworkError is declared above with an initial value

      /**
       * Resets any network switching errors
       */
      resetSwitchNetworkError: () => set({ switchNetworkError: undefined }),
    };
  });
}
