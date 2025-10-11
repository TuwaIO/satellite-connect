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
        if (lastConnectedWallet) {
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
    activeWallet: undefined,

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
        // 1. Check if wallet is already connected, case when you reconnect by another wallet
        if (get().activeWallet?.isConnected) {
          await get().disconnectAll();
        }
        const wallet = await foundAdapter.connect({
          walletType,
          chainId,
        });

        // 2. Set initial wallet state
        set({ activeWallet: wallet });

        // 3. Check for contract address if the adapter supports it
        if (foundAdapter.checkIsContractWallet) {
          const isContractAddress = await foundAdapter.checkIsContractWallet({
            address: wallet.address,
            chainId,
          });

          // Update only the isContractAddress property
          get().updateActiveWallet({ isContractAddress });
        }

        // 4. Run callback if provided
        if (callbackAfterConnected) {
          // Use the latest wallet state after potential updates (like isContractAddress)
          const updatedWallet = get().activeWallet;
          if (updatedWallet) {
            await callbackAfterConnected(updatedWallet);
          }
        }

        // 5. Final state updates
        set({ walletConnecting: false });
        lastConnectedWalletHelpers.setLastConnectedWallet({
          walletType,
          chainId,
          address: get().activeWallet?.address,
        });
        recentConnectedWalletHelpers.setRecentConnectedWallet({
          [getAdapterFromWalletType(walletType)]: {
            [walletType.split(':')[1]]: true,
          },
        } as RecentConnectedWallet);
      } catch (e) {
        await get().disconnectAll();
        lastConnectedWalletHelpers.removeLastConnectedWallet();
        set({
          walletConnecting: false,
          walletConnectionError: 'Wallet connection failed: ' + (e instanceof Error ? e.message : String(e)),
        });
      }
    },

    /**
     * Disconnects the currently active wallet
     */
    disconnect: async () => {
      const activeWallet = get().activeWallet;
      if (activeWallet) {
        // Clear all states and storages
        set({ activeWallet: undefined, walletConnectionError: undefined, switchNetworkError: undefined });
        lastConnectedWalletHelpers.removeLastConnectedWallet();
        impersonatedHelpers.removeImpersonated();
        const foundAdapter = get().getAdapter(getAdapterFromWalletType(activeWallet.walletType));
        // Call disconnect only if adapter is found
        await foundAdapter?.disconnect(activeWallet);
      }
    },

    disconnectAll: async () => {
      await delay(null, 150);

      set({ activeWallet: undefined, walletConnectionError: undefined, switchNetworkError: undefined });
      impersonatedHelpers.removeImpersonated();

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
    updateActiveWallet: (wallet: Partial<Wallet<W>>) => {
      const activeWallet = get().activeWallet;
      if (activeWallet) {
        // If chainId is updated, update storage
        if (wallet.chainId) {
          // Update lastConnectedWallet storage if chainId changes
          lastConnectedWalletHelpers.setLastConnectedWallet({
            walletType: wallet.walletType ?? activeWallet.walletType,
            chainId: wallet.chainId ?? activeWallet.chainId,
            address: wallet.address ?? activeWallet.address,
          });
        }

        // Use produce for immutable state update
        set((state) =>
          produce(state, (draft) => {
            if (draft.activeWallet) {
              // Ensure we merge partial properties into the existing activeWallet object
              draft.activeWallet = {
                ...draft.activeWallet,
                ...wallet,
              } as W; // Cast ensures type compatibility after merging
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
          set({ activeWallet: wallet as W });
        } else {
          console.warn('Attempted to set activeWallet with incomplete data while activeWallet was undefined.');
        }
      }
    },

    /**
     * Switches the connected wallet to a different network
     * @param chainId - Target chain ID to switch to
     */
    switchNetwork: async (chainId: string | number) => {
      set({ switchNetworkError: undefined });
      const activeWallet = get().activeWallet;
      if (activeWallet) {
        const foundAdapter = get().getAdapter(getAdapterFromWalletType(activeWallet.walletType));

        if (!foundAdapter) {
          set({ switchNetworkError: `No adapter found for active wallet type: ${activeWallet.walletType}` });
          return;
        }

        try {
          // Pass the local updateActiveWallet method from 'get()' to the adapter
          await foundAdapter.checkAndSwitchNetwork(chainId, activeWallet.chainId, get().updateActiveWallet);
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
