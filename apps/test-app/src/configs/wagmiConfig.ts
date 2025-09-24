import { createWagmiConfig } from '@tuwaio/satellite-evm';
import { Chain } from 'viem';
import { mainnet, sepolia } from 'viem/chains';

export const appChains = [mainnet, sepolia] as [Chain, ...Chain[]];

export const wagmiConfig = createWagmiConfig({
  chains: appChains,
  ssr: true,
  autoConnect: false,
  connectorsInitProps: {
    appName: 'Test TUWA App',
    defaultChainId: sepolia.id,
    wcParams: {
      projectId: process.env.NEXT_PUBLIC_WALLET_PROJECT_ID ?? '9077e559e63e099f496b921a027d0f04',
      metadata: {
        name: '',
        description: '',
        url: '',
        icons: [''],
      },
    },
  },
});
