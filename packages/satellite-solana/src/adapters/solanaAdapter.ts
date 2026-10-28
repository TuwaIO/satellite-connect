import { address as adr, decimalFixedPointToString, lamportsToSol } from '@solana/kit';
import { ConnectorType, formatConnectorName, getConnectorTypeFromName, OrbitAdapter } from '@tuwaio/orbit-core';
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
  watchAvailableSolanaConnectors,
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
 * - `watchConnectors` calls `onChange` (with no arguments) when a Wallet Standard wallet registers or unregisters,
 *   through `watchAvailableSolanaConnectors` from `@tuwaio/orbit-solana`: an extension that registers its wallet after
 *   the page loads, or a wallet enabled while the page is open. It subscribes to the `register` and `unregister` events
 *   of the Wallet Standard registry (`getWallets()` from `@wallet-standard/app`) until the returned function is called,
 *   and to nothing on the server (no `window`). It also runs for wallets that `getConnectors` leaves out, and does not
 *   follow the `change` events of the wallets themselves.
 * - `connect` asks the wallet to connect (`standard:connect`) and returns a {@link SolanaConnection}: the first
 *   account, the cluster moniker of the requested chain (the genesis-hash chain ID
 *   `"solana:EtWTRABZaYq6iMfeYKouRu166VU2xqa1"`, `"solana:devnet"` and `"devnet"` all become `"devnet"`), the
 *   RPC URL of that cluster from `rpcUrls`, the wallet icon, the Wallet Standard handles and a `signMessage` created
 *   with {@link createSolanaMessageSigner}. When `rpcUrls` has no URL for the cluster, `getRpcUrlForCluster` from
 *   `@tuwaio/orbit-solana` returns the public endpoint of that cluster (the mainnet-beta one for `localnet`, and for
 *   every cluster with `@tuwaio/orbit-solana` 0.3.1 and earlier).
 * - `reconnect` restores a wallet without a prompt, for `initializeAutoConnect`: `standard:connect` with `silent: true`
 *   returns the accounts that already authorize the app, and the connection is built as by `connect`. It resolves to
 *   `undefined` when the wallet returns no accounts or rejects (Phantom rejects a silent connect when the app is not
 *   trusted).
 * - `getLiveConnections` lists the connections this adapter opened (with `connect` or `reconnect`) and has not
 *   disconnected. The record lives in memory, in the adapter object.
 * - `disconnect` disconnects the wallet of the given connection, or, without a connection, only the wallets of
 *   `getLiveConnections` (`standard:disconnect`). A wallet that has accounts because other code or another store of the
 *   page connected it is never disconnected.
 * - `checkAndSwitchNetwork` makes no wallet request (Solana wallets have no network switch): it sets the connection's
 *   `chainId` and `rpcURL` to the new cluster, and does nothing when the requested chain is the current cluster in
 *   another form.
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
  // The wallets this adapter connected in this page and has not disconnected, by connector type. A wallet can have
  // accounts because other code or another store of the page connected it: those are never disconnected here
  const ownConnections = new Map<ConnectorType, SolanaConnection>();

  const findWallet = (connectorType: ConnectorType) =>
    getAvailableSolanaConnectors().find(
      (connector) =>
        getConnectorTypeFromName(OrbitAdapter.SOLANA, formatConnectorName(connector.name)) === connectorType,
    );

  // Opens the connection with `standard:connect` (`silent` asks the wallet not to prompt) and records it
  const openConnection = async (
    connectorType: ConnectorType,
    chainId: string | number,
    input?: { silent: boolean },
  ): Promise<SolanaConnection> => {
    const connector = findWallet(connectorType);
    if (!connector) throw new Error('Cannot find connector with this wallet type');

    try {
      const { uiWallet, accounts: connectedAccount } = await connect(connector as UiWallet, input);
      const cluster = getCluster({ cluster: chainId as string });
      // Extract raw wallet standard objects from UI handles
      const { wallet: rawWallet, account: rawAccount } = unwrapUiWalletHandles(uiWallet, connectedAccount[0]);

      const signerTarget: SolanaSignerTarget = {
        account: rawAccount as unknown as Record<string, unknown>,
        wallet: rawWallet as unknown as Record<string, unknown>,
      };
      const signMessage = createSolanaMessageSigner(signerTarget);

      const connection: SolanaConnection = {
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
      ownConnections.set(connectorType, connection);
      return connection;
    } catch (e) {
      throw new Error(e instanceof Error ? e.message : String(e), { cause: e });
    }
  };

  return {
    key: OrbitAdapter.SOLANA,

    connect: ({ connectorType, chainId }) => openConnection(connectorType, chainId),

    async reconnect({ connectorType, chainId }) {
      if (!findWallet(connectorType)) throw new Error('Cannot find connector with this wallet type');
      try {
        return await openConnection(connectorType, chainId, { silent: true });
      } catch {
        // A wallet that does not authorize the app returns no accounts or rejects (Phantom does)
        return undefined;
      }
    },

    getLiveConnections: async () => [...ownConnections.values()],

    async disconnect(activeWallet) {
      if (activeWallet) {
        const connectedWallet =
          (activeWallet as SolanaConnection).connectedWallet ??
          ownConnections.get(activeWallet.connectorType)?.connectedWallet;
        ownConnections.delete(activeWallet.connectorType);
        if (connectedWallet) await disconnect(connectedWallet);
        return;
      }
      const connections = [...ownConnections.values()];
      ownConnections.clear();
      for (const { connectedWallet } of connections) {
        try {
          if (connectedWallet) await disconnect(connectedWallet);
        } catch {
          // The other wallets are disconnected anyway
        }
      }
    },

    getConnectors() {
      const connectors = getAvailableSolanaConnectors();
      return {
        adapter: OrbitAdapter.SOLANA,
        connectors: connectors as ConnectorSolana[],
      };
    },

    watchConnectors: (onChange) => watchAvailableSolanaConnectors(onChange),

    async checkAndSwitchNetwork(chainId, currentChainId, updateActiveWallet) {
      const cluster = getCluster({ cluster: chainId as string });
      // `solana:devnet` and the genesis-hash chain ID of devnet name the cluster the connection is already on
      const currentCluster = currentChainId === undefined ? undefined : getCluster({ cluster: String(currentChainId) });
      if (currentCluster !== cluster && updateActiveWallet) {
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
      const connector = findWallet(connectorType);
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
