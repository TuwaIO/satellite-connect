import { selectAdapterByKey } from '@tuwaio/orbit-core';
import { Draft, produce } from 'immer';
import { createStore } from 'zustand/vanilla';

import { Connector, ISatelliteConnectStore, SatelliteConnectStoreInitialParameters, Wallet } from '../types';
import { getAdapterFromWalletType } from '../utils/getAdapterFromWalletType';

export function createSatelliteConnectStore({
  adapter,
  callbackAfterConnected,
}: SatelliteConnectStoreInitialParameters) {
  return createStore<ISatelliteConnectStore>()((set, get) => ({
    getAdapter: () => adapter,

    availableConnectors: {},
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
    disconnect: async () => {
      const activeWallet = get().activeWallet;
      if (activeWallet) {
        const foundAdapter = selectAdapterByKey({
          adapter,
          adapterKey: getAdapterFromWalletType(activeWallet.walletType),
        });
        await foundAdapter?.disconnect();
        set({ activeWallet: undefined, lastConnectedWallet: undefined });
      }
    },

    walletConnecting: false,
    resetWalletConnectionError: () => {
      set({ walletConnectionError: undefined });
    },

    updateActiveWallet: (wallet: Partial<Wallet>) => {
      const activeWallet = get().activeWallet;
      if (activeWallet) {
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
          set({ activeWallet: wallet as Wallet });
        }
      }
    },

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
    resetSwitchNetworkError: () => set({ switchNetworkError: undefined }),
  }));
}
