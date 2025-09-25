import type { SolanaClusterMoniker } from 'gill';

export type SolanaRPCUrls = {
  rpcUrls: Partial<Record<SolanaClusterMoniker, string>>;
};
