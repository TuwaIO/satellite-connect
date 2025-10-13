import { OrbitAdapter } from '@tuwaio/orbit-core';

export const getNetworkIcon = (adapter: OrbitAdapter) => {
  switch (adapter) {
    case OrbitAdapter.EVM:
      return {
        chainId: 1,
        name: 'Ethereum',
      };
    case OrbitAdapter.SOLANA:
      return {
        chainId: 'solana:mainnet',
        name: 'Solana',
      };
  }
};
