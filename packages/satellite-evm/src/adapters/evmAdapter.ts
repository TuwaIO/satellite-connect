import { formatConnectorName, getConnectorTypeFromName, OrbitAdapter } from '@tuwaio/orbit-core';
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
 *   connector icon and a `signMessage` that signs with wagmi's `signMessage`.
 * - `disconnect` disconnects the given connection, or every connector of `config`.
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

  return {
    /** Identifies this adapter as EVM-compatible */
    key: OrbitAdapter.EVM,

    /**
     * Connects to an EVM connector
     * @returns Connected connector information
     * @throws Error if connector not found or connection fails
     */
    connect: async ({ connectorType, chainId }) => {
      const connectors = getConnectors(config);
      const connector = connectors.find(
        (connector) =>
          getConnectorTypeFromName(OrbitAdapter.EVM, formatConnectorName(connector.name)) === connectorType,
      );
      if (!connector) throw new Error('Cannot find connector with this wallet type');

      try {
        await connect(config, { connector, chainId: chainId as number });
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
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : String(e), { cause: e });
      }
    },

    /**
     * Disconnects the currently connected connector
     */
    disconnect: async (activeWallet) => {
      if (activeWallet && activeWallet.isConnected) {
        await disconnect(config, { connector: (activeWallet as EVMConnection)?.connector });
      } else {
        const connectors = getConnectors(config);
        await Promise.allSettled(
          connectors.map(async (connector) => {
            await disconnect(config, { connector });
          }),
        );
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
      const connectors = getConnectors(config);
      const connector = connectors.find(
        (c) => getConnectorTypeFromName(OrbitAdapter.EVM, formatConnectorName(c.name)) === connectorType,
      );

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
