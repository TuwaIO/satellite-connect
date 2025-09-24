import { OrbitAdapter } from '@tuwaio/orbit-core';
import { checkAndSwitchChain, getAvatar, getName } from '@tuwaio/orbit-evm';
import { SatelliteAdapter, WalletForConnectorEVM } from '@tuwaio/satellite-core';
import {
  Config,
  connect,
  Connector,
  CreateConnectorFn,
  disconnect,
  getAccount,
  getChains,
  getConnectors,
} from '@wagmi/core';
import { zeroAddress } from 'viem';
import { mainnet } from 'viem/chains';

import { checkIsWalletAddressContract } from '../utils/checkIsWalletAddressContract';

export function satelliteEVMAdapter(config: Config): SatelliteAdapter {
  if (!config) throw new Error('Satellite EVM adapter requires a wagmi config object.');

  return {
    key: OrbitAdapter.EVM,
    connect: async ({ walletType, chainId, connectors }) => {
      const connector = connectors.find((connector) => connector.walletType === walletType);
      if (!connector) throw new Error('Cannot find connector with this wallet type');
      try {
        await connect(config, {
          connector: connector as Connector<CreateConnectorFn>,
          chainId: chainId as number,
        });
        const account = getAccount(config);
        console.log('account', account);
        return {
          walletType,
          address: account.address ?? zeroAddress,
          chainId: account.chainId ?? mainnet.id,
          rpcURL: account.chain?.rpcUrls.default.http[0] ?? mainnet.rpcUrls.default.http[0],
          isConnected: account.isConnected,
          isContractAddress: false,
        };
      } catch (e) {
        throw new Error(e instanceof Error ? e.message : String(e));
      }
    },
    disconnect: async () => {
      const account = getAccount(config);
      if (account.isConnected) {
        await disconnect(config);
      }
    },
    getConnectors: async () => {
      const connectors = getConnectors(config);
      return {
        adapter: OrbitAdapter.EVM,
        connectors: connectors.map((connector) => {
          return {
            walletType: `${OrbitAdapter.EVM}:${connector.type}`,
            ...connector,
          };
        }) as WalletForConnectorEVM[],
      };
    },
    checkAndSwitchNetwork: async (chainId) => await checkAndSwitchChain(chainId as number, config),
    getExplorerUrl: (url) => {
      const { chain } = getAccount(config);
      const baseExplorerLink = chain?.blockExplorers?.default.url;
      return url ? `${baseExplorerLink}/${url}` : baseExplorerLink;
    },
    getName: (address: string) => getName(address as `0x${string}`),
    getAvatar: (name: string) => getAvatar(name),
    checkIsContractWallet: async ({ address, chainId }) => {
      const chains = getChains(config);
      return await checkIsWalletAddressContract({ config, address, chainId, chains });
    },
  };
}
