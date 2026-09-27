import { address as adr, decimalFixedPointToString, lamportsToSol } from '@solana/kit';
import { formatConnectorName, getConnectorTypeFromName, OrbitAdapter } from '@tuwaio/orbit-core';
import {
  createSolanaRPC,
  getAvailableSolanaConnectors,
  getCluster,
  getRpcUrlForCluster,
  getSolanaAddressAvatar,
  getSolanaAddressName,
  getSolanaExplorerLink,
  SolanaClusterMoniker,
  SolanaRPCUrls,
} from '@tuwaio/orbit-solana';
import { SatelliteAdapter } from '@tuwaio/satellite-core';
import { UiWallet } from '@wallet-standard/ui';

import { ConnectorSolana, SolanaConnection } from '../types';
import { connect, disconnect, unwrapUiWalletHandles } from '../utils/connectionUtils';
import { createSolanaMessageSigner, SolanaSignerTarget } from '../utils/signerUtils';

/**
 * Creates the Solana adapter for the Satellite Connect store (`createSatelliteConnectStore` from
 * `@tuwaio/satellite-core` or `SatelliteConnectProvider` from `@tuwaio/satellite-react`). It implements
 * `SatelliteAdapter` with the Wallet Standard and `@solana/kit`:
 * - `getConnectors` returns the wallets of `getAvailableSolanaConnectors` from `@tuwaio/orbit-solana` (registered
 *   Wallet Standard wallets with the Solana features Satellite needs). A wallet matches a `connectorType` such as
 *   `"solana:phantom"` through `formatConnectorName` from `@tuwaio/orbit-core`.
 * - `connect` asks the wallet to connect (`standard:connect`) and returns a {@link SolanaConnection}: the first
 *   account, the cluster moniker of the requested chain (`"solana:devnet"` and `"devnet"` both become `"devnet"`), the
 *   RPC URL of that cluster from `rpcUrls`, the wallet icon, the Wallet Standard handles and a `signMessage` created
 *   with {@link createSolanaMessageSigner}. When `rpcUrls` has no URL for the cluster, `getRpcUrlForCluster` from
 *   `@tuwaio/orbit-solana` returns the public endpoint of that cluster (the mainnet-beta one for `localnet`, and for
 *   every cluster with `@tuwaio/orbit-solana` 0.3.1 and earlier).
 * - `disconnect` disconnects the wallet of the given connection, or every wallet that has accounts.
 * - `checkAndSwitchNetwork` makes no wallet request (Solana wallets have no network switch): it sets the connection's
 *   `chainId` and `rpcURL` to the new cluster.
 * - `getBalance` reads the balance with `getBalance` over RPC and returns it in SOL.
 * - `getExplorerUrl(url?, chainId?)` builds a Solana Explorer link (`explorer.solana.com`).
 * - `getName` and `getAvatar` resolve SNS names and avatars with `@tuwaio/orbit-solana` (Bonfida APIs, cached in
 *   memory); `getName` returns the address when there is no name. There is no `getAddress` and no contract check.
 * - `switchConnection` runs `standard:connect` of the wallet again.
 *
 * @param params - Adapter options: `rpcUrls`, the RPC URL for each cluster moniker (`mainnet`, `devnet`, `testnet`,
 * `localnet`). The URLs are kept in memory and exposed as `rpcURL` of the connection; they are not saved to
 * `localStorage`.
 * @returns The Solana adapter.
 *
 * @example
 * ```ts
 * import { satelliteSolanaAdapter } from '@tuwaio/satellite-solana';
 *
 * export const solanaAdapter = satelliteSolanaAdapter({
 *   rpcUrls: {
 *     mainnet: 'https://api.mainnet-beta.solana.com',
 *     devnet: 'https://api.devnet.solana.com',
 *   },
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
        // Extract raw wallet standard objects from UI handles
        const { wallet: rawWallet, account: rawAccount } = unwrapUiWalletHandles(uiWallet, connectedAccount[0]);

        const signerTarget: SolanaSignerTarget = {
          account: rawAccount as unknown as Record<string, unknown>,
          wallet: rawWallet as unknown as Record<string, unknown>,
        };
        const signMessage = createSolanaMessageSigner(signerTarget);

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
        value: decimalFixedPointToString(lamportsToSol(balance.value)),
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
