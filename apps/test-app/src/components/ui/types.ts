import { SolanaClusterMoniker } from 'gill';
import { Chain } from 'viem/chains';

export type InitialChains = {
  appChains?: readonly [Chain, ...Chain[]];
  solanaRPCUrls?: Partial<Record<SolanaClusterMoniker, string>>;
};
