import { OrbitAdapter } from '@tuwaio/orbit-core';

import { InitialChains } from '@/components/ui/types';

export const getConnectChainId = ({
  selectedAdapter,
  appChains,
  solanaRPCUrls,
}: { selectedAdapter: OrbitAdapter } & InitialChains) => {
  switch (selectedAdapter) {
    case OrbitAdapter.EVM:
      return appChains ? appChains[0].id : 1;
    case OrbitAdapter.SOLANA:
      return solanaRPCUrls ? Object.keys(solanaRPCUrls)[0] : 'mainnet';
    default:
      return 1;
  }
};
