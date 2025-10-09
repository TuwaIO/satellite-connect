import { OrbitAdapter } from '@tuwaio/orbit-core';
import { defaultRpcUrlsByMoniker, SolanaRPCUrls } from '@tuwaio/orbit-solana';
import { getAdapterFromWalletType, WalletType } from '@tuwaio/satellite-core';
import { IdentifierArray } from '@wallet-standard/base';
import { SolanaClusterMoniker } from 'gill';

import { InitialChains } from '@/components/ui/types';

export function getChainsListByWalletType({
  walletType,
  appChains,
  solanaRPCUrls,
  chains,
}: { walletType: WalletType; chains?: IdentifierArray } & InitialChains) {
  const availableSolanaRpcURLS: SolanaRPCUrls['rpcUrls'] = (chains ?? []).reduce(
    (acc: SolanaRPCUrls['rpcUrls'], chain: string) => {
      const cluster = chain.split(':')[1] as SolanaClusterMoniker;
      if (cluster) {
        acc[cluster] = solanaRPCUrls
          ? (solanaRPCUrls[cluster] ?? defaultRpcUrlsByMoniker[cluster])
          : defaultRpcUrlsByMoniker[cluster];
      }
      return acc;
    },
    {},
  );

  switch (getAdapterFromWalletType(walletType)) {
    case OrbitAdapter.EVM:
      return appChains ? appChains.map((chain) => chain.id) : [];
    case OrbitAdapter.SOLANA:
      return availableSolanaRpcURLS ? Object.keys(availableSolanaRpcURLS).map((key) => key) : [];
    default:
      return [];
  }
}
