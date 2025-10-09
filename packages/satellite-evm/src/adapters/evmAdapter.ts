import { getWalletTypeFromConnectorName, OrbitAdapter } from '@tuwaio/orbit-core';
import { checkAndSwitchChain, getAvatar, getName } from '@tuwaio/orbit-evm';
import { formatWalletName, isSafeApp, SatelliteAdapter } from '@tuwaio/satellite-core';
import { Config, connect, disconnect, getAccount, getBalance, getChains, getConnectors } from '@wagmi/core';
import { Address, formatUnits, zeroAddress } from 'viem';
import { mainnet } from 'viem/chains';

import { ConnectorEVM } from '../types';
import { checkIsWalletAddressContract } from '../utils/checkIsWalletAddressContract';

/**
 * Creates an EVM-compatible adapter for Satellite
 *
 * @remarks
 * This adapter implements the SatelliteAdapter interface for Ethereum Virtual Machine (EVM) compatible chains.
 * It uses wagmi as the underlying library for wallet connections and chain interactions.
 *
 * @param config - Wagmi configuration object containing chain and connector settings
 * @param signInWithSiwe - Optional function for signing in with SIWE
 * @returns A configured SatelliteAdapter instance for EVM chains
 * @throws Error if config is not provided
 *
 * @example
 * ```typescript
 * const config = createConfig({
 *   chains: [mainnet, polygon],
 *   connectors: [
 *     new InjectedConnector(),
 *     new WalletConnectConnector({ projectId: 'your_project_id' })
 *   ]
 * });
 *
 * const evmAdapter = satelliteEVMAdapter(config);
 * ```
 */
export function satelliteEVMAdapter(
  config: Config,
  signInWithSiwe?: () => Promise<void>,
): SatelliteAdapter<ConnectorEVM> {
  if (!config) throw new Error('Satellite EVM adapter requires a wagmi config object.');

  return {
    /** Identifies this adapter as EVM-compatible */
    key: OrbitAdapter.EVM,

    /**
     * Connects to an EVM wallet
     * @returns Connected wallet information
     * @throws Error if connector not found or connection fails
     */
    connect: async ({ walletType, chainId }) => {
      const connectors = getConnectors(config);
      const connector = connectors.find(
        (connector) =>
          getWalletTypeFromConnectorName(OrbitAdapter.EVM, formatWalletName(connector.name)) === walletType,
      );
      if (!connector) throw new Error('Cannot find connector with this wallet type');

      try {
        await connect(config, {
          connector: connector as ConnectorEVM,
          chainId: chainId as number,
        });
        if (signInWithSiwe && !isSafeApp) {
          await signInWithSiwe();
        }
        const account = getAccount(config);

        return {
          walletType,
          address: account.address ?? zeroAddress,
          chainId: account.chainId ?? mainnet.id,
          rpcURL: account.chain?.rpcUrls.default.http[0] ?? mainnet.rpcUrls.default.http[0],
          isConnected: account.isConnected,
          isContractAddress: false,
          walletIcon: connector?.icon?.trim(),
          connector,
        };
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : String(e));
      }
    },

    /**
     * Disconnects the currently connected wallet
     */
    disconnect: async () => await disconnect(config),

    /**
     * Retrieves available EVM wallet connectors
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
     * Switches the connected wallet to specified network
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
    getExplorerUrl: (url) => {
      const { chain } = getAccount(config);
      const baseExplorerLink = chain?.blockExplorers?.default.url;
      return url ? `${baseExplorerLink}/${url}` : baseExplorerLink;
    },

    /**
     * Resolves ENS name for given address
     * @param address - Ethereum address to resolve
     * @returns ENS name if available, null otherwise
     */
    getName: (address: string) => getName(address as `0x${string}`),

    /**
     * Retrieves avatar for ENS name
     * @param name - ENS name to get avatar for
     * @returns Avatar URL if available, null otherwise
     */
    getAvatar: (name: string) => getAvatar(name),

    /**
     * Checks if given address is a smart contract
     * @param address - Address to check
     * @param chainId - Chain ID on which to perform the check
     * @returns Promise resolving to boolean indicating if address is a contract
     */
    checkIsContractWallet: async ({ address, chainId }) => {
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
  };
}
