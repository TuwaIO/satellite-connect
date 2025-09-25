import { getWalletTypeFromConnectorName, OrbitAdapter } from '@tuwaio/orbit-core';
import { getCluster, getRpcUrlForCluster, getSolanaExplorerLink, SolanaRPCUrls } from '@tuwaio/orbit-solana';
import { ConnectorSolana, SatelliteAdapter } from '@tuwaio/satellite-core';
import { getWallets } from '@wallet-standard/app';
import { UiWallet } from '@wallet-standard/ui';
import { getOrCreateUiWalletForStandardWallet_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as getOrCreateUiWalletForStandardWallet } from '@wallet-standard/ui-registry';
import { SolanaClusterMoniker } from 'gill';

import { connect, disconnect } from '../utils/connectionUtils';

/**
 * Creates a Solana blockchain adapter for the Satellite Connect system
 *
 * @remarks
 * This adapter implements the SatelliteAdapter interface for Solana blockchain,
 * providing wallet connection, network switching, and name resolution capabilities.
 * It uses the Wallet Standard for consistent wallet interactions.
 *
 * @param rpcUrls - Configuration object containing RPC endpoints for different Solana networks
 * @returns SatelliteAdapter implementation for Solana
 *
 * @example
 * ```typescript
 * const solanaAdapter = satelliteSolanaAdapter({
 *   rpcUrls: {
 *     mainnet: 'https://api.mainnet-beta.solana.com',
 *     devnet: 'https://api.devnet.solana.com',
 *     testnet: 'https://api.testnet.solana.com'
 *   }
 * });
 * ```
 */
export function satelliteSolanaAdapter({ rpcUrls }: SolanaRPCUrls): SatelliteAdapter {
  /**
   * Helper to get all available wallets
   */
  const getAvailableWallets = () => getWallets().get().map(getOrCreateUiWalletForStandardWallet);

  return {
    key: OrbitAdapter.SOLANA,

    async connect({ walletType, chainId, connectors }) {
      const connector = connectors.find(
        (connector) => getWalletTypeFromConnectorName(OrbitAdapter.SOLANA, connector.name) === walletType,
      );
      if (!connector) throw new Error('Cannot find connector with this wallet type');

      try {
        const connectedAccount = await connect(connector as UiWallet);
        const wallets = getAvailableWallets();
        const cluster = getCluster({ cluster: chainId as string });

        return {
          walletType,
          address: connectedAccount[0].address,
          chainId: cluster,
          rpcURL: getRpcUrlForCluster({
            cluster: cluster as SolanaClusterMoniker,
            rpcUrls,
          }),
          isConnected: true,
          isContractAddress: false,
          connectedAccount: connectedAccount[0],
          connectedWallet: wallets.filter((wallet) => wallet.accounts.length > 0)[0],
        };
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : String(e));
      }
    },

    async disconnect() {
      const wallets = getAvailableWallets();
      const connectedWallet = wallets.filter((wallet) => wallet.accounts.length > 0)[0];
      await disconnect(connectedWallet);
    },

    async getConnectors() {
      const connectors = getAvailableWallets();
      return {
        adapter: OrbitAdapter.SOLANA,
        connectors: connectors as ConnectorSolana[],
      };
    },

    async checkAndSwitchNetwork(chainId, currentChainId, updateActiveWallet) {
      if (currentChainId !== chainId && updateActiveWallet) {
        const cluster = getCluster({ cluster: chainId as string });
        updateActiveWallet({
          chainId: cluster,
          rpcURL: getRpcUrlForCluster({
            cluster: cluster as SolanaClusterMoniker,
            rpcUrls,
          }),
        });
      }
    },

    getExplorerUrl(url, chainId) {
      const cluster = getCluster({ cluster: chainId as string }) ?? 'mainnet';
      return getSolanaExplorerLink(url, cluster as SolanaClusterMoniker);
    },

    async getName(address) {
      const wallets = getAvailableWallets();
      const connectedWallet = wallets.filter((wallet) =>
        wallet.accounts.some((account) => account.address.toLowerCase() === address.toLowerCase()),
      )[0];
      return connectedWallet?.accounts[0]?.label ?? address;
    },

    async getAvatar(name) {
      const wallets = getAvailableWallets();
      const connectedWallet = wallets.filter((wallet) =>
        wallet.accounts.some((account) => account.label?.toLowerCase() === name.toLowerCase()),
      )[0];
      return connectedWallet?.accounts[0]?.icon ?? name;
    },
  };
}
