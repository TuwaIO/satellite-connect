import { connectedWalletChainHelpers, OrbitAdapter, selectAdapterByKey } from '@tuwaio/orbit-core';
import { produce } from 'immer';
import { createStore } from 'zustand/vanilla';

import { Connector, ISatelliteConnectStore, SatelliteConnectStoreInitialParameters, Wallet } from '../types';
import { getAdapterFromWalletType } from '../utils/getAdapterFromWalletType';
import { impersonatedHelpers } from '../utils/impersonatedHelpers';
import { lastConnectedWalletHelpers } from '../utils/lastConnectedWalletHelpers';
import { RecentConnectedWallet, recentConnectedWalletHelpers } from '../utils/recentConnectedWalletHelpers';

/**
 * Creates a Satellite Connect store instance for managing wallet connections and state
 *
 * @param params - Configuration parameters for the store
 * @param params.adapter - Single adapter or array of adapters for different chains
 * @param params.callbackAfterConnected - Optional callback function called after successful wallet connection
 *
 * @returns A Zustand store instance with wallet connection state and methods
 */
export function createSatelliteConnectStore({
  adapter,
  callbackAfterConnected,
}: SatelliteConnectStoreInitialParameters) {
  return createStore<ISatelliteConnectStore>()((set, get) => ({
    /**
     * Returns configured adapter(s)
     */
    getAdapter: () => adapter,

    /**
     * Get wallet connectors for all configured adapters
     */
    getConnectors: () => {
      let results: { adapter: OrbitAdapter; connectors: Connector[] }[];

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
        {} as Partial<Record<OrbitAdapter, Connector[]>>,
      );
    },

    initializeAutoConnect: async (autoConnect) => {
      if (autoConnect) {
        const lastConnectedWallet = lastConnectedWalletHelpers.getLastConnectedWallet();
        if (lastConnectedWallet) {
          // Explicitly await the connect call
          await get().connect({ walletType: lastConnectedWallet.walletType, chainId: lastConnectedWallet.chainId });
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
      const adapterKey = getAdapterFromWalletType(walletType);
      const foundAdapter = selectAdapterByKey({ adapter, adapterKey });

      if (!foundAdapter) {
        set({
          walletConnecting: false,
          walletConnectionError: `No adapter found for wallet type: ${walletType}`,
        });
        return;
      }

      try {
        const wallet = await foundAdapter.connect({
          walletType,
          chainId,
        });

        // 1. Set initial wallet state
        set({ activeWallet: wallet });

        // 2. Set connected chain storage
        connectedWalletChainHelpers.setConnectedWalletChain(chainId);

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
        lastConnectedWalletHelpers.setLastConnectedWallet({ walletType, chainId });
        const recentlyConnectedWallet = recentConnectedWalletHelpers.getRecentConnectedWallet();
        if (recentlyConnectedWallet) {
          const updatedRecentlyConnectedWallet = {
            wallets: {
              ...recentlyConnectedWallet.wallets,
              [getAdapterFromWalletType(walletType)]: walletType,
            },
          };
          recentConnectedWalletHelpers.setRecentConnectedWallet(updatedRecentlyConnectedWallet);
        } else {
          const updatedRecentlyConnectedWallet = {
            wallets: {
              [getAdapterFromWalletType(walletType)]: walletType,
            },
          } as RecentConnectedWallet;
          recentConnectedWalletHelpers.setRecentConnectedWallet(updatedRecentlyConnectedWallet);
        }
      } catch (e) {
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
        const foundAdapter = selectAdapterByKey({
          adapter,
          adapterKey: getAdapterFromWalletType(activeWallet.walletType),
        });

        // Call disconnect only if adapter is found
        await foundAdapter?.disconnect();

        // Clear all states and storages
        set({ activeWallet: undefined, walletConnectionError: undefined, switchNetworkError: undefined });
        lastConnectedWalletHelpers.removeLastConnectedWallet();
        connectedWalletChainHelpers.removeConnectedWalletChain();
        impersonatedHelpers.removeImpersonated();
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
    updateActiveWallet: (wallet: Partial<Wallet>) => {
      const activeWallet = get().activeWallet;
      if (activeWallet) {
        // If chainId is updated, update storage
        if (wallet.chainId) {
          connectedWalletChainHelpers.setConnectedWalletChain(wallet.chainId);

          // Update lastConnectedWallet storage if chainId changes
          lastConnectedWalletHelpers.setLastConnectedWallet({
            walletType: activeWallet.walletType,
            chainId: wallet.chainId,
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
              } as Wallet; // Cast ensures type compatibility after merging
            }
          }),
        );
      } else {
        const isWalletCanChange =
          wallet.walletType !== undefined && wallet.chainId !== undefined && wallet.address !== undefined;

        if (isWalletCanChange) {
          connectedWalletChainHelpers.setConnectedWalletChain(wallet.chainId!);
          set({ activeWallet: wallet as Wallet });
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
        const adapterKey = getAdapterFromWalletType(activeWallet.walletType);
        const foundAdapter = selectAdapterByKey({ adapter, adapterKey });

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
