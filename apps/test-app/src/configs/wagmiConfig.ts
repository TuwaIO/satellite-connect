import { createWagmiConfig } from '@tuwaio/satellite-evm';
import { Chain, mainnet, sepolia } from 'viem/chains';

export const appChains = [mainnet, sepolia] as readonly [Chain, ...Chain[]];

export const wagmiConfig = createWagmiConfig({
  appName: 'Satellite EVM Test App',
  projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID ?? '9077e559e63e099f496b921a027d0f04',
  chains: appChains,
  ssr: true,
  syncConnectedChain: true,
});
