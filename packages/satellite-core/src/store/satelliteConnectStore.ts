import {
  ConnectorType,
  delay,
  getAdapterFromConnectorType,
  impersonatedHelpers,
  isInSecureIframe,
  lastConnectedConnectorHelpers,
  normalizeError,
  OrbitAdapter,
  recentlyConnectedConnectorsListHelpers,
  selectAdapterByKey,
} from '@tuwaio/orbit-core';
import { Immer } from 'immer';
import { createStore } from 'zustand/vanilla';

import { BaseConnector, Connector, ISatelliteConnectStore, SatelliteConnectStoreInitialParameters } from '../types';

// Connectors contain EventEmitter objects that must remain mutable, so this store never freezes its state. A local
// Immer instance keeps that setting out of the global `produce` used by the rest of the app.
const immer = new Immer({ autoFreeze: false });

/**
 * Creates the Satellite Connect store: a vanilla Zustand store (`zustand/vanilla`) that holds the wallet connections
 * and the actions described in {@link ISatelliteConnectStore}. It has no UI and no framework dependency;
 * `SatelliteConnectProvider` from `@tuwaio/satellite-react` creates one for React apps.
 *
 * Pass one adapter or an array of adapters (one per chain family) as `adapter`, and optionally a
 * `callbackAfterConnected`. Every call creates an independent store.
 *
 * The state lives in memory. The actions read and write these `localStorage` keys through the helpers of
 * `@tuwaio/orbit-core` (nothing is read or written on the server):
 * - `orbit-core:lastConnectedConnector`: `{ connectorType, chainId, address }` of the active connection, where
 *   `chainId` is the chain the wallet is connected to, as normalized by the adapter. Written by `connect`,
 *   `switchConnection`, `disconnect` while other connections remain, and `updateActiveConnection` when the active
 *   connection changes chain; removed when the last connection is disconnected. `initializeAutoConnect` reads it, and
 *   so does `@tuwaio/pulsar-solana`.
 * - `orbit-core:recentlyConnectedConnectorsListHelpers`: `{ [connectorType]: { address, disconnectedTimestamp, icon } }`,
 *   updated with the current time on every `connect`. `initializeAutoConnect` removes entries older than 7 days.
 * - `satellite-connect:impersonatedAddress`: removed by `disconnectAll` and when the last connection is disconnected.
 *
 * The store's Immer instance does not freeze state, because connections hold wallet objects that must stay mutable.
 * It does not change the global Immer settings of the app.
 *
 * @typeParam C - Type of the wallet connectors of the adapters.
 * @typeParam W - Chain-specific connection type.
 * @param params - Store parameters: `adapter` and the optional `callbackAfterConnected`.
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

    // Unlike `getAdapter`, never falls back to the adapter of another chain family
    const findAdapter = (adapterKey: OrbitAdapter) =>
      (Array.isArray(internalParams.adapter) ? internalParams.adapter : [internalParams.adapter]).find(
        (adapter) => adapter.key === adapterKey,
      );

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

    // Reconnects the wallet after a page load (see `initializeAutoConnect` in `ISatelliteConnectStore`)
    const restoreConnection = async (autoConnect: boolean) => {
      await delay(null, 300);
      await get().disconnectAll();

      // Cleanup old recently connected connectors (older than 7 days)
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      recentlyConnectedConnectorsListHelpers.removeConnectorsOlderThan(sevenDaysAgo);

      // Inside Safe{Wallet} the Safe account is the wallet, with or without autoConnect
      const safeAppChainId = await getSafeAppChainId();
      if (safeAppChainId) {
        await delay(null, 100);
        await get().connect({ connectorType: `${OrbitAdapter.EVM}:safe`, chainId: safeAppChainId });
        return;
      }

      if (autoConnect) {
        const lastConnectedConnector = lastConnectedConnectorHelpers.getLastConnectedConnector();
        if (
          lastConnectedConnector &&
          !['impersonatedwallet', 'walletconnect', 'coinbase', 'coinbasewallet', 'bitgetwallet'].includes(
            lastConnectedConnector.connectorType.split(':')[1],
          ) &&
          // The same origin can hold a wallet of a chain family this app does not use (saved by another app)
          findAdapter(getAdapterFromConnectorType(lastConnectedConnector.connectorType))
        ) {
          await delay(null, 100);
          await get().connect({
            connectorType: lastConnectedConnector.connectorType,
            chainId: lastConnectedConnector.chainId,
          });
        }
      }
    };

    // Counts `initializeAutoConnect` calls: only the last one started sets `isAutoConnectFinished`
    let autoConnectRun = 0;

    return {
      /**
       * Updates store initialization parameters dynamically
       */
      updateParameters: (newParams: SatelliteConnectStoreInitialParameters<C, W>) => {
        internalParams = newParams;
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
        set({ isAutoConnectFinished: false });
        try {
          await restoreConnection(autoConnect);
        } finally {
          // Overlapping calls (React Strict Mode runs effects twice in development) finish in any order
          if (run === autoConnectRun) set({ isAutoConnectFinished: true });
        }
      },

      isAutoConnectFinished: false,
      connecting: false,
      disconnecting: false,
      connectionError: undefined,
      switchNetworkError: undefined,
      activeConnection: undefined,
      connections: {},

      setConnectionError: (error) => set({ connectionError: error }),

      /**
       * Connects to a connector
       * @param connectorType - Type of connector to connect to
       * @param chainId - Chain ID to connect on
       */
      connect: async ({ connectorType, chainId }) => {
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
          const existingConnector = get().connections[connectorType as ConnectorType];
          if (existingConnector) {
            if (existingConnector.address) {
              recentlyConnectedConnectorsListHelpers.addConnector(existingConnector.connectorType, {
                address: existingConnector.address,
                disconnectedTimestamp: Date.now(),
                icon: existingConnector.icon,
              });
            }

            if (get().activeConnection?.connectorType !== connectorType) {
              await get().switchConnection(connectorType);
            }

            set({ connecting: false });
            return;
          }

          const connector = await foundAdapter.connect({
            connectorType,
            chainId,
          });

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
          if (foundAdapter.checkIsContractAddress) {
            const isContractAddress = await foundAdapter.checkIsContractAddress({
              address: connector.address,
              chainId: connector.chainId,
            });

            // Update only the isContractAddress property
            get().updateActiveConnection({ ...connector, isContractAddress });
          }

          // 4. Run callback if provided
          if (internalParams.callbackAfterConnected) {
            // Use the latest connector state after potential updates (like isContractAddress)
            const updatedConnector = get().activeConnection;
            if (updatedConnector && updatedConnector.connectorType === connectorType) {
              await internalParams.callbackAfterConnected(updatedConnector);
            }
          }

          // 5. Final state updates
          set({ connecting: false });
          const connectedConnection = get().activeConnection;
          lastConnectedConnectorHelpers.setLastConnectedConnector({
            connectorType,
            // The chain the wallet is connected to, as normalized by the adapter (not the requested one)
            chainId: connectedConnection?.chainId ?? chainId,
            address: connectedConnection?.address,
          });

          // Add to recently connected list
          const activeConnection = get().activeConnection;
          if (activeConnection && activeConnection.address) {
            recentlyConnectedConnectorsListHelpers.addConnector(activeConnection.connectorType, {
              address: activeConnection.address,
              disconnectedTimestamp: Date.now(),
              icon: activeConnection.icon,
            });
          }
        } catch (e) {
          set({
            connecting: false,
            connectionError: normalizeError(e),
          });
        }
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
            lastConnectedConnectorHelpers.setLastConnectedConnector({
              connectorType: finalState.activeConnection.connectorType,
              chainId: finalState.activeConnection.chainId,
              address: finalState.activeConnection.address,
            });
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
        if (Array.isArray(internalParams.adapter)) {
          await Promise.allSettled(
            internalParams.adapter.map(async (a) => {
              try {
                await a.disconnect();
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
              } catch (e) {
                /* empty */
              }
            }),
          );
        } else {
          try {
            await internalParams.adapter.disconnect();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (e) {
            /* empty */
          }
        }

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
            lastConnectedConnectorHelpers.setLastConnectedConnector({
              connectorType: targetConnectorType,
              chainId: connector.chainId,
              address: connector.address ?? activeConnection?.address,
            });
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
            lastConnectedConnectorHelpers.setLastConnectedConnector({
              connectorType: connector.connectorType!,
              chainId: connector.chainId!,
              address: connector.address!,
            });
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

          set((state) =>
            immer.produce(state, (draft) => {
              draft.activeConnection = targetConnector as typeof draft.activeConnection;
            }),
          );

          lastConnectedConnectorHelpers.setLastConnectedConnector({
            connectorType: targetConnector.connectorType,
            chainId: targetConnector.chainId,
            address: targetConnector.address,
          });
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
