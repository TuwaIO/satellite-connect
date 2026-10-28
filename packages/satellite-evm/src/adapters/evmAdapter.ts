import { ConnectorType, formatConnectorName, getConnectorTypeFromName, OrbitAdapter } from '@tuwaio/orbit-core';
import { checkAndSwitchChain, getAddress, getAvatar, getName } from '@tuwaio/orbit-evm';
import { SatelliteAdapter } from '@tuwaio/satellite-core';
import {
  Config,
  connect,
  disconnect,
  getBalance,
  getChains,
  getConnection,
  getConnectors,
  signMessage,
  switchChain,
  switchConnection,
} from '@wagmi/core';
import { Address, formatUnits, zeroAddress } from 'viem';
import { Chain, mainnet } from 'viem/chains';

import { ConnectorEVM, EVMConnection } from '../types';
import { checkIsWalletAddressContract } from '../utils/checkIsWalletAddressContract';

/**
 * Creates the EVM adapter for the Satellite Connect store (`createSatelliteConnectStore` from `@tuwaio/satellite-core`
 * or `SatelliteConnectProvider` from `@tuwaio/satellite-react`). It implements `SatelliteAdapter` with `@wagmi/core`:
 * - `getConnectors` returns the connectors of `config`. A connector matches a `connectorType` such as `"evm:metamask"`
 *   through `formatConnectorName` from `@tuwaio/orbit-core` (for example, the `Safe` connector is `"evm:safe"`).
 * - `connect` runs wagmi's `connect` with the requested chain and returns an {@link EVMConnection}: the account (the
 *   zero address if wagmi reports none), the chain (`1` if unknown), the first default RPC URL of the chain, the
 *   connector icon and a `signMessage` that signs with wagmi's `signMessage`. An injected wallet shows its connect
 *   prompt (wagmi requests `wallet_requestPermissions`, then `eth_requestAccounts`). A wallet that wagmi already holds
 *   in this page (an earlier store on the same config connected it, or `WagmiProvider` restored it) is taken over
 *   without a request: it becomes wagmi's current connection, and wagmi's `switchChain` asks it to move to the
 *   requested chain (when it declines, the connection stays on its chain).
 * - `reconnect` restores a wallet without a prompt, for `initializeAutoConnect`: a wallet that wagmi already holds in
 *   this page is taken over as by `connect`; otherwise, when the connector reports authorized accounts
 *   (`eth_accounts` for injected wallets), wagmi's `connect` runs with `isReconnecting`, so the connector reads those
 *   accounts instead of asking for them. It resolves to `undefined` when the wallet reports no accounts (locked, or the
 *   site was disconnected in the wallet). When the wallet is on another chain than the requested one, wagmi's
 *   `switchChain` asks it to switch; when it declines, the connection stays on its chain.
 * - `getLiveConnections` lists, as {@link EVMConnection} objects, the live wagmi connections that this adapter object
 *   opened or took over (with `connect` or `reconnect`) and has not disconnected. The record of their connectors lives
 *   in memory, in the adapter object. Connections that other code opened or restored on the same config (for example
 *   `WagmiProvider`, or a store with another adapter object) are not listed.
 * - `disconnect` disconnects the given connection with wagmi's `disconnect`. Without a connection (or with one that is
 *   not connected), it disconnects only the live connections of `getLiveConnections` (of that connection's connector
 *   type), never a connector without a connection or a connection opened by other code: wagmi's injected connector
 *   sends `wallet_revokePermissions` on every disconnect, and wallets such as MetaMask revoke the site's permission for
 *   every tab of the origin. Two stores on one wagmi config with their own adapter objects do not close each other's
 *   wallets this way (a wallet both of them connected is still one wagmi connection).
 * - `checkAndSwitchNetwork` asks the wallet to switch chains with `checkAndSwitchChain` from `@tuwaio/orbit-evm`.
 * - `getBalance` reads the native balance through the wagmi transports and formats it with the chain's decimals.
 * - `getExplorerUrl(url?, chainId?)` joins `url` to the block explorer of `chainId` (looked up in `chains`, then in
 *   `config`), or of the connected chain when `chainId` is omitted. It returns `undefined` when the chain has no
 *   explorer.
 * - `getName`, `getAvatar` and `getAddress` resolve ENS names on Ethereum Mainnet with `@tuwaio/orbit-evm`, which
 *   caches the results in memory.
 * - `checkIsContractAddress` is {@link checkIsWalletAddressContract}; `getSafeConnectorChainId` returns the chain of
 *   the `Safe` connector; `switchConnection` runs wagmi's `switchConnection`.
 *
 * @param config - The wagmi config of the app.
 * @param chains - The app chains. ENS lookups use the Ethereum Mainnet entry of this list (its default RPC URL), or
 * viem's `mainnet` when it is missing.
 * @returns The EVM adapter.
 * @throws {Error} `Satellite EVM adapter requires a wagmi config object.` when `config` is missing.
 *
 * @example
 * ```ts
 * import { satelliteEVMAdapter } from '@tuwaio/satellite-evm';
 * import { createConfig, http, injected } from '@wagmi/core';
 * import { mainnet, sepolia } from 'viem/chains';
 *
 * const chains = [mainnet, sepolia] as const;
 * const wagmiConfig = createConfig({
 *   chains,
 *   connectors: [injected()],
 *   transports: { [mainnet.id]: http(), [sepolia.id]: http() },
 * });
 *
 * export const evmAdapter = satelliteEVMAdapter(wagmiConfig, chains);
 * ```
 */
export function satelliteEVMAdapter(
  config: Config,
  chains: readonly [Chain, ...Chain[]],
): SatelliteAdapter<ConnectorEVM, EVMConnection> {
  if (!config) throw new Error('Satellite EVM adapter requires a wagmi config object.');

  const connectorTypeOf = (connector: ConnectorEVM) =>
    getConnectorTypeFromName(OrbitAdapter.EVM, formatConnectorName(connector.name)) as ConnectorType;

  const findConnector = (connectorType: string) =>
    getConnectors(config).find((connector) => connectorTypeOf(connector) === connectorType);

  // The connectors whose wagmi connection this adapter opened or took over and has not disconnected, by `uid`. wagmi can
  // hold connections that other code opened or restored (`WagmiProvider` restores the wallets of its storage, another
  // store may share the config): those are never disconnected here, because wagmi's injected connector sends
  // `wallet_revokePermissions` on every disconnect, which MetaMask applies to every tab of the origin
  const ownConnectorUids = new Set<string>();

  // The live wagmi connections this adapter opened. `config.state` rather than `getConnections`, which returns its
  // previous result (possibly of another config) while a config reconnects
  const getOwnWagmiConnections = () =>
    [...config.state.connections.values()].filter(({ connector }) => ownConnectorUids.has(connector.uid));

  // The current wagmi connection of `connector` as a Satellite connection
  const currentConnection = (connectorType: ConnectorType, connector: ConnectorEVM): EVMConnection => {
    const account = getConnection(config);
    return {
      connectorType,
      address: account.address ?? zeroAddress,
      chainId: account.chainId ?? mainnet.id,
      rpcURL: account.chain?.rpcUrls.default.http[0] ?? mainnet.rpcUrls.default.http[0],
      isConnected: account.isConnected,
      isContractAddress: false,
      icon: connector?.icon?.trim(),
      connector,
      signMessage: (message: string) => signMessage(config, { message }),
    };
  };

  // Takes over the wagmi connection of `connector` that this page already holds: makes it wagmi's current connection and
  // asks the wallet to move to `chainId`; when the wallet declines, the connection stays on its chain
  const takeOverConnection = async (
    connectorType: ConnectorType,
    connector: ConnectorEVM,
    chainId: number | string,
  ) => {
    if (config.state.current !== connector.uid) await switchConnection(config, { connector });
    if (Number(chainId) && getConnection(config).chainId !== Number(chainId)) {
      await switchChain(config, { chainId: Number(chainId), connector }).catch(() => undefined);
    }
    ownConnectorUids.add(connector.uid);
    return currentConnection(connectorType, connector);
  };

  return {
    /** Identifies this adapter as EVM-compatible */
    key: OrbitAdapter.EVM,

    /**
     * Connects to an EVM connector
     * @returns Connected connector information
     * @throws Error if connector not found or connection fails
     */
    connect: async ({ connectorType, chainId }) => {
      const connector = findConnector(connectorType);
      if (!connector) throw new Error('Cannot find connector with this wallet type');

      try {
        // A wallet that wagmi already holds in this page (an earlier store or `WagmiProvider` connected it): wagmi's
        // `connect` would ask the wallet again, or throw when it is wagmi's current connection
        if (config.state.connections.has(connector.uid)) {
          return await takeOverConnection(connectorType, connector, chainId);
        }
        await connect(config, { connector, chainId: chainId as number });
        ownConnectorUids.add(connector.uid);
        return currentConnection(connectorType, connector);
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : String(e), { cause: e });
      }
    },

    reconnect: async ({ connectorType, chainId }) => {
      const connector = findConnector(connectorType);
      if (!connector) throw new Error('Cannot find connector with this wallet type');

      try {
        // A wallet that wagmi already holds in this page (for example `WagmiProvider` restored it) needs no request
        if (!config.state.connections.has(connector.uid)) {
          // Only a wallet that still authorizes the app: `eth_accounts` of an injected wallet never prompts
          const accounts = await connector.getAccounts().catch(() => []);
          if (accounts.length === 0) return undefined;
          // `isReconnecting` makes the connector read the authorized accounts instead of asking for them
          // (`wallet_requestPermissions`, `eth_requestAccounts`), as wagmi's `reconnect` does. wagmi's `connect`
          // passes it to the connector; `reconnect` is not used because it skips its work while any config
          // reconnects and resets the connections of the config when the wallet does not connect
          const parameters = { connector, isReconnecting: true };
          // Another restore may have connected it while the accounts were read
          if (!config.state.connections.has(connector.uid)) await connect(config, parameters);
        }
        // Back to the chain of the saved connection
        return await takeOverConnection(connectorType, connector, chainId);
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : String(e), { cause: e });
      }
    },

    getLiveConnections: async () =>
      getOwnWagmiConnections().map(({ connector, accounts, chainId }) => {
        const chain = getChains(config).find(({ id }) => id === chainId);
        return {
          connectorType: connectorTypeOf(connector),
          address: accounts[0] ?? zeroAddress,
          chainId,
          rpcURL: chain?.rpcUrls.default.http[0] ?? mainnet.rpcUrls.default.http[0],
          isConnected: true,
          isContractAddress: false,
          icon: connector.icon?.trim(),
          connector,
          signMessage: (message: string) => signMessage(config, { message, connector }),
        };
      }),

    /**
     * Disconnects the given connection, or the live wagmi connections this adapter opened (never a connector without a
     * connection or a connection opened by other code: wagmi asks it to revoke the site's permission, which MetaMask
     * applies to every tab of the origin)
     */
    disconnect: async (activeWallet) => {
      if (activeWallet && activeWallet.isConnected) {
        const { connector } = activeWallet as EVMConnection;
        await disconnect(config, { connector });
        if (connector) ownConnectorUids.delete(connector.uid);
        return;
      }
      const connections = getOwnWagmiConnections().filter(
        ({ connector }) => !activeWallet || connectorTypeOf(connector) === activeWallet.connectorType,
      );
      for (const { connector } of connections) {
        ownConnectorUids.delete(connector.uid);
        try {
          await disconnect(config, { connector });
        } catch {
          // The other connections are disconnected anyway
        }
      }
    },

    /**
     * Retrieves available EVM connectors
     * @returns Object containing adapter type and list of available connectors
     */
    getConnectors: () => {
      const connectors = getConnectors(config);
      return {
        adapter: OrbitAdapter.EVM,
        connectors: connectors.map((connector) => {
          return connector;
        }) as ConnectorEVM[],
      };
    },

    /**
     * Switches the connected connector to specified network
     * @param chainId - Target chain ID to switch to
     */
    checkAndSwitchNetwork: async (chainId) => await checkAndSwitchChain(Number(chainId), config),

    getBalance: async (address, chainId) => {
      const balance = await getBalance(config, { address: address as Address, chainId: Number(chainId) });
      return {
        value: formatUnits(balance.value, balance.decimals),
        symbol: balance.symbol,
      };
    },

    /**
     * Generates blockchain explorer URLs for the current network
     * @param url - Optional path to append to base explorer URL
     * @returns Complete explorer URL or base explorer URL if no path provided
     */
    getExplorerUrl: (url, chainId) => {
      const chain =
        chainId === undefined
          ? getConnection(config).chain
          : (chains.find((c) => c.id === Number(chainId)) ?? getChains(config).find((c) => c.id === Number(chainId)));
      const baseExplorerLink = chain?.blockExplorers?.default.url;
      if (!baseExplorerLink) return undefined;
      return url ? `${baseExplorerLink.replace(/\/+$/, '')}/${url.replace(/^\/+/, '')}` : baseExplorerLink;
    },

    /**
     * Resolves ENS name for given address
     * @param address - Ethereum address to resolve
     * @returns ENS name if available, null otherwise
     */
    getName: (address: string) => getName(address as `0x${string}`, chains),

    /**
     * Retrieves avatar for ENS name
     * @param name - ENS name to get avatar for
     * @returns Avatar URL if available, null otherwise
     */
    getAvatar: (name: string) => getAvatar(name, chains),

    /**
     * Resolves ENS name to address
     * @param name - ENS name to resolve
     * @returns Address if available, null otherwise
     */
    getAddress: (name: string) => getAddress(name, chains),

    /**
     * Checks if given address is a smart contract
     * @param address - Address to check
     * @param chainId - Chain ID on which to perform the check
     * @returns Promise resolving to boolean indicating if address is a contract
     */
    checkIsContractAddress: async ({ address, chainId }) => {
      const chains = getChains(config);
      return await checkIsWalletAddressContract({ config, address, chainId, chains });
    },

    getSafeConnectorChainId: async () => {
      const connectors = getConnectors(config);
      const safeConnector = connectors.find((c) => c.name === 'Safe');
      if (safeConnector) {
        return await safeConnector.getChainId();
      } else {
        return undefined;
      }
    },

    switchConnection: async (connectorType) => {
      const connector = findConnector(connectorType);

      if (!connector) {
        throw new Error(`Cannot find connector with type: ${connectorType}`);
      }

      try {
        await switchConnection(config, { connector });
      } catch (e) {
        throw new Error(
          `Failed to switch to connector ${connectorType}: ${e instanceof Error ? e.message : String(e)}`,
          { cause: e },
        );
      }
    },
  };
}
