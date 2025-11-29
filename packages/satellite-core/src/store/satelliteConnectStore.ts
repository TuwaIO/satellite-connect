import {
  ConnectorType,
  delay,
  getAdapterFromConnectorType,
  impersonatedHelpers,
  isSafeApp,
  lastConnectedConnectorHelpers,
  OrbitAdapter,
  recentlyConnectedConnectorsListHelpers,
  selectAdapterByKey,
} from '@tuwaio/orbit-core';
import { produce, setAutoFreeze } from 'immer';
import { createStore } from 'zustand/vanilla';

import { BaseConnector, Connector, ISatelliteConnectStore, SatelliteConnectStoreInitialParameters } from '../types';

/**
 * Creates a Satellite Connect store instance for managing connector connections and state
 *
 * @param params - Initial parameters for the store
 * @param params.adapter - Blockchain adapter(s) to use
 * @param params.callbackAfterConnected - Optional callback function called after successful connection
 *
 * @returns A Zustand store instance with connection state and methods
 */
export function createSatelliteConnectStore<C, W extends BaseConnector = BaseConnector>({
  adapter,
  callbackAfterConnected,
}: SatelliteConnectStoreInitialParameters<C, W>) {
  // Disable autoFreeze for immers in this store, since connectors contain EventEmitter objects that must remain mutable to function correctly
  setAutoFreeze(false);

  return createStore<ISatelliteConnectStore<C, W>>()((set, get) => ({
    /**
     * Returns active adapter
     */
    getAdapter: (adapterKey) => selectAdapterByKey({ adapter, adapterKey }),

    /**
     * Get connectors for all configured adapters
     */
    getConnectors: () => {
      let results: { adapter: OrbitAdapter; connectors: C[] }[];

      if (Array.isArray(adapter)) {
        results = adapter.map((a) => a.getConnectors());
      } else {
        // Ensure the single adapter result is wrapped in an array for consistent processing
        results = [adapter.getConnectors()];
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
      await get().disconnectAll();

      // Cleanup old recently connected connectors (older than 7 days)
      const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
      recentlyConnectedConnectorsListHelpers.removeConnectorsOlderThan(sevenDaysAgo);

      if (autoConnect) {
        const lastConnectedConnector = lastConnectedConnectorHelpers.getLastConnectedConnector();
        if (
          lastConnectedConnector &&
          !['impersonatedwallet', 'walletconnect', 'coinbasewallet', 'bitgetwallet'].includes(
            lastConnectedConnector.connectorType.split(':')[1],
          )
        ) {
          await delay(null, 100);
          await get().connect({
            connectorType: lastConnectedConnector.connectorType,
            chainId: lastConnectedConnector.chainId,
          });
        }
      } else if (isSafeApp) {
        await delay(null, 100);
        const foundAdapter = get().getAdapter(OrbitAdapter.EVM);
        if (foundAdapter && foundAdapter.getSafeConnectorChainId) {
          const safeConnectorChainId = await foundAdapter.getSafeConnectorChainId();
          if (safeConnectorChainId) {
            await get().connect({ connectorType: `${OrbitAdapter.EVM}:safewallet`, chainId: safeConnectorChainId });
          }
        }
      }
    },

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
      const foundAdapter = get().getAdapter(getAdapterFromConnectorType(connectorType));

      if (!foundAdapter) {
        set({
          connecting: false,
          connectionError: `No adapter found for connector type: ${connectorType}`,
        });
        return;
      }

      try {
        // 1. Check if connector is already connected
        const existingConnector = get().connections[connectorType as ConnectorType];
        if (existingConnector) {
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

        // 3. Check for contract address if the adapter supports it
        if (foundAdapter.checkIsContractAddress) {
          const isContractAddress = await foundAdapter.checkIsContractAddress({
            address: connector.address,
            chainId,
          });

          // Update only the isContractAddress property
          get().updateActiveConnection({ ...connector, isContractAddress });
        }

        // 4. Run callback if provided
        if (callbackAfterConnected) {
          // Use the latest connector state after potential updates (like isContractAddress)
          const updatedConnector = get().activeConnection;
          if (updatedConnector && updatedConnector.connectorType === connectorType) {
            await callbackAfterConnected(updatedConnector);
          }
        }

        // 5. Final state updates
        set({ connecting: false });
        lastConnectedConnectorHelpers.setLastConnectedConnector({
          connectorType,
          chainId,
          address: get().activeConnection?.address,
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
          connectionError: 'Connector connection failed: ' + (e instanceof Error ? e.message : String(e)),
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
            produce(state, (draft) => {
              // Remove the disconnected connector
              delete draft.connections[connectorType as ConnectorType];

              // Set the new active connection (could be undefined, another connector, or unchanged)
              draft.activeConnection = newActiveConnection;

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
          produce(state, (draft) => {
            draft.connectionError = `Disconnect failed: ${e instanceof Error ? e.message : String(e)}`;
          }),
        );
      } finally {
        set({ disconnecting: false });
      }
    },

    disconnectAll: async () => {
      await delay(null, 500);

      if (Array.isArray(adapter)) {
        await Promise.allSettled(
          adapter.map(async (a) => {
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
          await adapter.disconnect();
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
          produce(state, (draft) => {
            if (draft.connections[targetConnectorType as ConnectorType]) {
              draft.connections[targetConnectorType as ConnectorType] = {
                ...draft.connections[targetConnectorType as ConnectorType],
                ...connector,
              } as Connector<W>;

              // Also update activeConnection if it matches
              if (draft.activeConnection?.connectorType === targetConnectorType) {
                draft.activeConnection = draft.connections[targetConnectorType as ConnectorType];
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
          console.warn('Attempted to set activeConnection with incomplete data while activeConnection was undefined.');
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
          produce(state, (draft) => {
            draft.activeConnection = targetConnector;
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
          set({ switchNetworkError: `No adapter found for active connector type: ${targetConnector.connectorType}` });
          return;
        }

        try {
          // Pass the local updateActiveConnection method from 'get()' to the adapter
          await foundAdapter.checkAndSwitchNetwork(chainId, targetConnector.chainId, get().updateActiveConnection);
        } catch (e) {
          set({ switchNetworkError: 'Switch network failed: ' + (e instanceof Error ? e.message : String(e)) });
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
  }));
}
