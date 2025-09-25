import { connectedWalletChainHelpers, selectAdapterByKey } from '@tuwaio/orbit-core';
import { Draft, produce } from 'immer';
import { createStore } from 'zustand/vanilla';

import { Connector, ISatelliteConnectStore, SatelliteConnectStoreInitialParameters, Wallet } from '../types';
import { getAdapterFromWalletType } from '../utils/getAdapterFromWalletType';
import { impersonatedHelpers } from '../utils/impersonatedHelpers';

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
     * Available wallet connectors for each chain
     */
    availableConnectors: {},

    /**
     * Initializes wallet connectors for all configured adapters
     * @param autoConnect - Whether to automatically reconnect to last used wallet
     */
    initializeAppConnectors: async ({ autoConnect }) => {
      if (Array.isArray(adapter)) {
        const connectors = await Promise.all(adapter.map((a) => a.getConnectors()));
        connectors.forEach((connectors) => {
          set((state) =>
            produce(state, (draft) => {
              draft.availableConnectors[connectors.adapter] = connectors.connectors as Draft<Connector[]>;
            }),
          );
        });
      } else {
        const connectors = await adapter.getConnectors();
        set((state) =>
          produce(state, (draft) => {
            draft.availableConnectors[connectors.adapter] = connectors.connectors as Draft<Connector[]>;
          }),
        );
      }
      if (autoConnect) {
        const lastConnectedWallet = get().lastConnectedWallet;
        if (lastConnectedWallet) {
          await get().connect({ walletType: lastConnectedWallet.walletType, chainId: lastConnectedWallet.chainId });
        }
      }
    },

    /**
     * Connects to a wallet
     * @param walletType - Type of wallet to connect to
     * @param chainId - Chain ID to connect on
     */
    connect: async ({ walletType, chainId }) => {
      set({ walletConnecting: true, walletConnectionError: undefined });
      const foundAdapter = selectAdapterByKey({ adapter, adapterKey: getAdapterFromWalletType(walletType) });
      try {
        const wallet = await foundAdapter?.connect({
          walletType,
          chainId,
          connectors: get().availableConnectors[getAdapterFromWalletType(walletType)] ?? [],
        });
        set({ activeWallet: wallet });
        connectedWalletChainHelpers.setConnectedWalletChain(chainId);
        if (foundAdapter?.checkIsContractWallet && wallet) {
          get().updateActiveWallet({
            isContractAddress: await foundAdapter.checkIsContractWallet({
              address: wallet.address,
              chainId,
            }),
          });
          if (callbackAfterConnected) {
            await callbackAfterConnected(wallet);
          }
        }
        set({ walletConnecting: false, lastConnectedWallet: { walletType, chainId } });
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
        await foundAdapter?.disconnect();
        set({ activeWallet: undefined, lastConnectedWallet: undefined });
        connectedWalletChainHelpers.removeConnectedWalletChain();
        impersonatedHelpers.removeImpersonated();
      }
    },

    walletConnecting: false,

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
        if (wallet.chainId) {
          connectedWalletChainHelpers.setConnectedWalletChain(wallet.chainId);
        }
        set((state) =>
          produce(state, (draft) => {
            if (draft.activeWallet) {
              draft.activeWallet = {
                ...draft.activeWallet,
                ...wallet,
              };
            }
          }),
        );
      } else {
        if (wallet.walletType !== undefined && wallet.chainId !== undefined && wallet.address !== undefined) {
          connectedWalletChainHelpers.setConnectedWalletChain(wallet.chainId);
          set({ activeWallet: wallet as Wallet });
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
        const foundAdapter = selectAdapterByKey({
          adapter,
          adapterKey: getAdapterFromWalletType(activeWallet.walletType),
        });
        try {
          await foundAdapter?.checkAndSwitchNetwork(chainId, activeWallet.chainId, get().updateActiveWallet);
        } catch (e) {
          set({ switchNetworkError: 'Switch network failed: ' + (e instanceof Error ? e.message : String(e)) });
        }
      }
    },

    /**
     * Resets any network switching errors
     */
    resetSwitchNetworkError: () => set({ switchNetworkError: undefined }),
  }));
}
