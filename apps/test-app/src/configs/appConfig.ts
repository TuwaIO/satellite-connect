import { createDefaultTransports, initAllConnectors } from '@tuwaio/satellite-evm';
import { createConfig } from '@wagmi/core';
import {
  arbitrum,
  arbitrumSepolia,
  avalanche,
  avalancheFuji,
  base,
  bsc,
  Chain,
  mainnet,
  optimism,
  polygon,
  polygonZkEvm,
  sepolia,
} from 'viem/chains';

export const appConfig = {
  appName: 'Satellite EVM Test App',
  projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID ?? '9077e559e63e099f496b921a027d0f04',
};

export const solanaRPCUrls = {
  mainnet: `https://solana-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_KEY}`,
  devnet: 'https://api.devnet.solana.com',
};

export const appEVMChains = [
  mainnet,
  sepolia,
  polygon,
  polygonZkEvm,
  arbitrum,
  arbitrumSepolia,
  optimism,
  avalanche,
  avalancheFuji,
  base,
  bsc,
] as readonly [Chain, ...Chain[]];

export const wagmiConfig = createConfig({
  connectors: initAllConnectors({
    ...appConfig,
  }),
  transports: createDefaultTransports(appEVMChains),
  chains: appEVMChains,
  ssr: true,
  syncConnectedChain: true,
});
