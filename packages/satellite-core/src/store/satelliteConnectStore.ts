import {
  delay,
  getAdapterFromWalletType,
  impersonatedHelpers,
  isSafeApp,
  lastConnectedWalletHelpers,
  OrbitAdapter,
  RecentConnectedWallet,
  recentConnectedWalletHelpers,
  selectAdapterByKey,
  WalletType,
} from '@tuwaio/orbit-core';
import { produce } from 'immer';
import { createStore } from 'zustand/vanilla';

import { BaseWallet, ISatelliteConnectStore, SatelliteConnectStoreInitialParameters, Wallet } from '../types';

/**
 * Creates a Satellite Connect store instance for managing wallet connections and state
 *
 * @param params - Configuration parameters for the store
 * @param params.adapter - Single adapter or array of adapters for different chains
 * @param params.callbackAfterConnected - Optional callback function called after successful wallet connection
 *
 * @returns A Zustand store instance with wallet connection state and methods
 */
export function createSatelliteConnectStore<C, W extends BaseWallet = BaseWallet>({
  adapter,
  callbackAfterConnected,
}: SatelliteConnectStoreInitialParameters<C, W>) {
  return createStore<ISatelliteConnectStore<C, W>>()((set, get) => ({
    /**
     * Returns active adapter
     */
    getAdapter: (adapterKey) => selectAdapterByKey({ adapter, adapterKey }),

    /**
     * Get wallet connectors for all configured adapters
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
      if (autoConnect) {
        const lastConnectedWallet = lastConnectedWalletHelpers.getLastConnectedWallet();
        if (
          lastConnectedWallet &&
          !['impersonatedwallet', 'walletconnect', 'coinbasewallet', 'bitgetwallet'].includes(
            lastConnectedWallet.walletType.split(':')[1],
          )
        ) {
          await delay(null, 200);
          await get().connect({ walletType: lastConnectedWallet.walletType, chainId: lastConnectedWallet.chainId });
        }
      } else if (isSafeApp) {
        await delay(null, 200);
        const foundAdapter = get().getAdapter(OrbitAdapter.EVM);
        if (foundAdapter && foundAdapter.getSafeConnectorChainId) {
          const safeConnectorChainId = await foundAdapter.getSafeConnectorChainId();
          if (safeConnectorChainId) {
            await get().connect({ walletType: `${OrbitAdapter.EVM}:safewallet`, chainId: safeConnectorChainId });
          }
        }
      }
    },

    walletConnecting: false,
    walletConnectionError: undefined,
    switchNetworkError: undefined,
    activeConnection: undefined,
    connections: {},

    setWalletConnectionError: (error) => set({ walletConnectionError: error }),

    /**
     * Connects to a wallet
     * @param walletType - Type of wallet to connect to
     * @param chainId - Chain ID to connect on
     */
    connect: async ({ walletType, chainId }) => {
      set({ walletConnecting: true, walletConnectionError: undefined });
      const foundAdapter = get().getAdapter(getAdapterFromWalletType(walletType));

      if (!foundAdapter) {
        set({
          walletConnecting: false,
          walletConnectionError: `No adapter found for wallet type: ${walletType}`,
        });
        return;
      }

      try {
        // 1. Check if wallet is already connected
        const existingWallet = get().connections[walletType as WalletType];
        if (existingWallet) {
          return;
        }

        const wallet = await foundAdapter.connect({
          walletType,
          chainId,
        });

        // 2. Set initial wallet state
        set((state) => {
          return {
            activeConnection: wallet,
            connections: {
              ...state.connections,
              [wallet.walletType]: wallet,
            },
          };
        });

        // 3. Check for contract address if the adapter supports it
        if (foundAdapter.checkIsContractWallet) {
          const isContractAddress = await foundAdapter.checkIsContractWallet({
            address: wallet.address,
            chainId,
          });

          // Update only the isContractAddress property
          get().updateActiveConnection({ ...wallet, isContractAddress });
        }

        // 4. Run callback if provided
        if (callbackAfterConnected) {
          // Use the latest wallet state after potential updates (like isContractAddress)
          const updatedWallet = get().activeConnection;
          if (updatedWallet && updatedWallet.walletType === walletType) {
            await callbackAfterConnected(updatedWallet);
          }
        }

        // 5. Final state updates
        set({ walletConnecting: false });
        lastConnectedWalletHelpers.setLastConnectedWallet({
          walletType,
          chainId,
          address: get().activeConnection?.address,
        });
        recentConnectedWalletHelpers.setRecentConnectedWallet({
          [getAdapterFromWalletType(walletType)]: {
            [walletType.split(':')[1]]: true,
          },
        } as RecentConnectedWallet);
      } catch (e) {
        set({
          walletConnecting: false,
          walletConnectionError: 'Wallet connection failed: ' + (e instanceof Error ? e.message : String(e)),
        });
      }
    },

    /**
     * Disconnects the currently active wallet or a specific wallet
     */
    /**
     * Disconnects the currently active wallet or a specific wallet
     */
    disconnect: async (walletType?: string) => {
      if (walletType) {
        // Disconnect specific wallet
        const walletToDisconnect = get().connections[walletType as WalletType];

        if (walletToDisconnect) {
          const foundAdapter = get().getAdapter(getAdapterFromWalletType(walletToDisconnect.walletType));
          await foundAdapter?.disconnect(walletToDisconnect);

          set((state) => {
            const newConnections = { ...state.connections };
            delete newConnections[walletType as WalletType];

            // If the disconnected wallet was the active one, set activeConnection to undefined
            const newActiveConnection =
              state.activeConnection?.walletType === walletType ? undefined : state.activeConnection;

            return {
              connections: newConnections,
              activeConnection: newActiveConnection,
              walletConnectionError: undefined,
              switchNetworkError: undefined,
            };
          });
        }
      } else {
        // Disconnect ALL wallets
        await get().disconnectAll();
      }

      if (Object.keys(get().connections).length === 0) {
        lastConnectedWalletHelpers.removeLastConnectedWallet();
        impersonatedHelpers.removeImpersonated();
      } else {
        // Update last connected to the current active one (if any)
        const currentActive = get().activeConnection;
        if (currentActive) {
          lastConnectedWalletHelpers.setLastConnectedWallet({
            walletType: currentActive.walletType,
            chainId: currentActive.chainId,
            address: currentActive.address,
          });
        }
      }
    },

    disconnectAll: async () => {
      await delay(null, 150);

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
        walletConnectionError: undefined,
        switchNetworkError: undefined,
      });
      impersonatedHelpers.removeImpersonated();
    },

    /**
     * Contains error message if connection failed
     */
    // walletConnectionError is declared above with an initial value

    /**
     * Resets any wallet connection errors
     */
    resetWalletConnectionError: () => {
      set({ walletConnectionError: undefined });
    },

    /**
     * Updates the active wallet's properties
     * @param wallet - Partial wallet object with properties to update
     */
    /**
     * Updates the active connection's properties
     * @param wallet - Partial wallet object with properties to update
     */
    updateActiveConnection: (wallet: Partial<Wallet<W>>) => {
      const activeConnection = get().activeConnection;
      // Determine which wallet to update. If walletType is provided, use it. Otherwise use activeConnection.
      const targetWalletType = wallet.walletType ?? activeConnection?.walletType;

      if (targetWalletType) {
        // If chainId is updated, update storage
        if (wallet.chainId && targetWalletType === activeConnection?.walletType) {
          // Update lastConnectedWallet storage if chainId changes and it's the active wallet
          lastConnectedWalletHelpers.setLastConnectedWallet({
            walletType: targetWalletType,
            chainId: wallet.chainId,
            address: wallet.address ?? activeConnection?.address,
          });
        }

        // Use produce for immutable state update
        set((state) =>
          produce(state, (draft) => {
            if (draft.connections[targetWalletType as WalletType]) {
              draft.connections[targetWalletType as WalletType] = {
                ...draft.connections[targetWalletType as WalletType],
                ...wallet,
              } as Wallet<W>;

              // Also update activeConnection if it matches
              if (draft.activeConnection?.walletType === targetWalletType) {
                draft.activeConnection = draft.connections[targetWalletType as WalletType];
              }
            }
          }),
        );
      } else {
        const isWalletCanChange =
          wallet.walletType !== undefined && wallet.chainId !== undefined && wallet.address !== undefined;

        if (isWalletCanChange) {
          lastConnectedWalletHelpers.setLastConnectedWallet({
            walletType: wallet.walletType!,
            chainId: wallet.chainId!,
            address: wallet.address!,
          });
          // It's a new wallet or full replacement
          set((state) => {
            const newWallet = wallet as W;
            return {
              activeConnection: newWallet,
              connections: {
                ...state.connections,
                [newWallet.walletType]: newWallet,
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
    switchConnection: (walletType: string) => {
      const targetWallet = get().connections[walletType as WalletType];
      if (targetWallet) {
        set({ activeConnection: targetWallet });
        lastConnectedWalletHelpers.setLastConnectedWallet({
          walletType: targetWallet.walletType,
          chainId: targetWallet.chainId,
          address: targetWallet.address,
        });
      }
    },

    /**
     * Switches the connected wallet to a different network
     * @param chainId - Target chain ID to switch to
     */
    switchNetwork: async (chainId: string | number, walletType?: string) => {
      set({ switchNetworkError: undefined });
      const targetWallet = walletType ? get().connections[walletType as WalletType] : get().activeConnection;

      if (targetWallet) {
        const foundAdapter = get().getAdapter(getAdapterFromWalletType(targetWallet.walletType));

        if (!foundAdapter) {
          set({ switchNetworkError: `No adapter found for active wallet type: ${targetWallet.walletType}` });
          return;
        }

        try {
          // Pass the local updateActiveConnection method from 'get()' to the adapter
          await foundAdapter.checkAndSwitchNetwork(chainId, targetWallet.chainId, get().updateActiveConnection);
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
