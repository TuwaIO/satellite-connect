import { OrbitAdapter } from '@tuwaio/orbit-core';
import { getAdapterFromWalletType, WalletType } from '@tuwaio/satellite-core';

import { InitialChains } from '@/components/ui/types';

export function getChainsListByWalletType({
  walletType,
  appChains,
  solanaRPCUrls,
}: { walletType: WalletType } & InitialChains) {
  switch (getAdapterFromWalletType(walletType)) {
    case OrbitAdapter.EVM:
      return appChains ? appChains.map((chain) => chain.id) : [];
    case OrbitAdapter.SOLANA:
      return solanaRPCUrls ? Object.keys(solanaRPCUrls).map((key) => key) : [];
    default:
      return [];
  }
}
