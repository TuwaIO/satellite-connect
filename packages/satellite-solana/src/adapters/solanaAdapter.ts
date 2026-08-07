import { formatConnectorName, getConnectorTypeFromName, OrbitAdapter } from '@tuwaio/orbit-core';
import {
  createSolanaRPC,
  getAvailableSolanaConnectors,
  getCluster,
  getRpcUrlForCluster,
  getSolanaAddressAvatar,
  getSolanaAddressName,
  getSolanaExplorerLink,
  SolanaRPCUrls,
} from '@tuwaio/orbit-solana';
import { SatelliteAdapter } from '@tuwaio/satellite-core';
import { createSolanaSiwxSigner, SolanaSiwxSignerTarget } from '@tuwaio/siwx-solana';
import { UiWallet } from '@wallet-standard/ui';
import { address as adr, lamportsToSol, SolanaClusterMoniker } from 'gill';

import { ConnectorSolana, SolanaConnection } from '../types';
import { connect, disconnect } from '../utils/connectionUtils';

/**
 * Creates a Solana blockchain adapter for the Satellite Connect system
 *
 * @remarks
 * This adapter implements the SatelliteAdapter interface for Solana blockchain,
 * providing connector connection, network switching, and name resolution capabilities.
 * It uses the Wallet Standard for consistent interactions.
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
export function satelliteSolanaAdapter({
  rpcUrls,
}: SolanaRPCUrls): SatelliteAdapter<ConnectorSolana, SolanaConnection> {
  return {
    key: OrbitAdapter.SOLANA,

    async connect({ connectorType, chainId }) {
      const connectors = getAvailableSolanaConnectors();
      const connector = connectors.find(
        (connector) =>
          getConnectorTypeFromName(OrbitAdapter.SOLANA, formatConnectorName(connector.name)) === connectorType,
      );
      if (!connector) throw new Error('Cannot find connector with this wallet type');

      try {
        const { uiWallet, accounts: connectedAccount } = await connect(connector as UiWallet);
        const cluster = getCluster({ cluster: chainId as string });
        const signMessage = createSolanaSiwxSigner(
          (connectedAccount[0] || uiWallet) as unknown as SolanaSiwxSignerTarget,
        );

        return {
          connectorType,
          address: connectedAccount[0].address,
          chainId: cluster,
          rpcURL: getRpcUrlForCluster({
            cluster: cluster as SolanaClusterMoniker,
            rpcUrls,
          }),
          isConnected: true,
          isContractAddress: false,
          icon: uiWallet?.icon?.trim(),
          connectedAccount: connectedAccount[0],
          connectedWallet: uiWallet,
          signMessage,
        };
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : String(e), { cause: e });
      }
    },

    async disconnect(activeWallet) {
      if (activeWallet && (activeWallet as SolanaConnection)?.connectedWallet) {
        await disconnect((activeWallet as SolanaConnection).connectedWallet as UiWallet);
      } else {
        const connectors = getAvailableSolanaConnectors();
        const connectedWallets = connectors.filter((wallet) => wallet.accounts.length > 0);
        await Promise.allSettled(
          connectedWallets.map(async (w) => {
            try {
              await disconnect(w);
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
            } catch (e) {
              /* empty */
            }
          }),
        );
      }
    },

    getConnectors() {
      const connectors = getAvailableSolanaConnectors();
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

    getBalance: async (address, chainId) => {
      const rpc = createSolanaRPC({ rpcUrlOrMoniker: getCluster({ cluster: chainId as string }), rpcUrls });
      const balance = await rpc.getBalance(adr(address)).send();
      return {
        value: lamportsToSol(balance.value),
        symbol: 'SOL',
      };
    },

    getExplorerUrl(url, chainId) {
      return getSolanaExplorerLink(url, chainId);
    },
    async getName(address) {
      return getSolanaAddressName(address);
    },
    async getAvatar(name) {
      return getSolanaAddressAvatar(name);
    },

    switchConnection: async (connectorType) => {
      const connectors = getAvailableSolanaConnectors();
      const connector = connectors.find(
        (c) => getConnectorTypeFromName(OrbitAdapter.SOLANA, formatConnectorName(c.name)) === connectorType,
      );
      if (!connector) {
        throw new Error(`Cannot find connector with type: ${connectorType}`);
      }
      try {
        await connect(connector);
      } catch (e) {
        throw new Error(
          `Failed to switch to connector ${connectorType}: ${e instanceof Error ? e.message : String(e)}`,
          { cause: e },
        );
      }
    },
  };
}
