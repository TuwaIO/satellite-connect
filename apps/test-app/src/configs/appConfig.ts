import { impersonatedHelpers } from '@tuwaio/satellite-core';
import { createWagmiConfig } from '@tuwaio/satellite-evm';
import { Chain, mainnet, sepolia } from 'viem/chains';

export const appConfig = {
  appName: 'Satellite EVM Test App',
  projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID ?? '9077e559e63e099f496b921a027d0f04',
};

export const solanaRPCUrls = {
  devnet: 'https://api.devnet.solana.com',
};

export const appEVMChains = [mainnet, sepolia] as readonly [Chain, ...Chain[]];

export const wagmiConfig = createWagmiConfig({
  ...appConfig,
  getImpersonatedAccount: () => impersonatedHelpers.getImpersonated() ?? undefined,
  chains: appEVMChains,
  ssr: true,
  syncConnectedChain: true,
});
