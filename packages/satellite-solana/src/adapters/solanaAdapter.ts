import { OrbitAdapter } from '@tuwaio/orbit-core';
import { getCluster, getRpcUrlForCluster, getSolanaExplorerLink, SolanaRPCUrls } from '@tuwaio/orbit-solana';
import { ConnectorSolana, getWalletTypeFromConnectorName, SatelliteAdapter } from '@tuwaio/satellite-core';
import { getWallets } from '@wallet-standard/app';
import { UiWallet } from '@wallet-standard/ui';
import { getOrCreateUiWalletForStandardWallet_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as getOrCreateUiWalletForStandardWallet } from '@wallet-standard/ui-registry'; // Sorry for this, but it's the only way to get the wallets from the registry.'
import { SolanaClusterMoniker } from 'gill';

import { connect, disconnect } from '../utils/connectionUtils';

export function satelliteSolanaAdapter({ rpcUrls }: SolanaRPCUrls): SatelliteAdapter {
  return {
    key: OrbitAdapter.SOLANA,
    connect: async ({ walletType, chainId, connectors }) => {
      const connector = connectors.find(
        (connector) => getWalletTypeFromConnectorName(OrbitAdapter.SOLANA, connector.name) === walletType,
      );
      if (!connector) throw new Error('Cannot find connector with this wallet type');
      try {
        const connectedAccount = await connect(connector as UiWallet);
        const wallets = getWallets().get().map(getOrCreateUiWalletForStandardWallet);
        return {
          walletType,
          address: connectedAccount[0].address,
          chainId: getCluster({ cluster: chainId as string }),
          rpcURL: getRpcUrlForCluster({
            cluster: getCluster({ cluster: chainId as string }) as SolanaClusterMoniker,
            rpcUrls,
          }),
          isConnected: true,
          isContractAddress: false,
          connectedAccount,
          connectedWallet: wallets.filter((wallet) => wallet.accounts.length > 0)[0],
        };
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : String(e));
      }
    },
    disconnect: async () => {
      const wallets = getWallets().get().map(getOrCreateUiWalletForStandardWallet);
      const connectedWallet = wallets.filter((wallet) => wallet.accounts.length > 0)[0];
      await disconnect(connectedWallet);
    },
    getConnectors: async () => {
      const connectors = getWallets().get().map(getOrCreateUiWalletForStandardWallet);
      return {
        adapter: OrbitAdapter.SOLANA,
        connectors: connectors.map((connector) => {
          return connector;
        }) as ConnectorSolana[],
      };
    },
    checkAndSwitchNetwork: async (chainId, currentChainId, updateActiveWallet) => {
      if (currentChainId !== chainId && updateActiveWallet) {
        updateActiveWallet({
          chainId: getCluster({ cluster: chainId as string }),
          rpcURL: getRpcUrlForCluster({
            cluster: getCluster({ cluster: chainId as string }) as SolanaClusterMoniker,
            rpcUrls,
          }),
        });
      }
    },

    getExplorerUrl: (url, chainId) => {
      const cluster = getCluster({ cluster: chainId as string }) ?? 'mainnet';
      return getSolanaExplorerLink(url, cluster as SolanaClusterMoniker);
    },

    getName: async (address) => {
      const wallets = getWallets().get().map(getOrCreateUiWalletForStandardWallet);
      const connectedWallet = wallets.filter((wallet) =>
        wallet.accounts.map((account) => account.address.toLowerCase() === address.toLowerCase()),
      )[0];
      return connectedWallet.accounts[0].label ?? address;
    },
    getAvatar: async (name) => {
      const wallets = getWallets().get().map(getOrCreateUiWalletForStandardWallet);
      const connectedWallet = wallets.filter((wallet) =>
        wallet.accounts.map((account) => account.label?.toLowerCase() === name.toLowerCase()),
      )[0];
      return connectedWallet.accounts[0].icon ?? name;
    },
  };
}
