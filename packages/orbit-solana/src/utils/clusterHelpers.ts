import type { SolanaClusterMoniker } from 'gill';

import { SolanaRPCUrls } from '../types';

/**
 * Safely extracts the cluster moniker from a chain identifier.
 * Handles both full chain IDs ('solana:mainnet-beta') and simple monikers ('mainnet-beta').
 * @returns The extracted cluster moniker.
 * @param walletCluster
 * @param cluster
 */
export const getCluster = ({ cluster, walletCluster }: { cluster?: string; walletCluster?: string }) => {
  const defaultCluster: SolanaClusterMoniker = 'mainnet';
  if (!cluster) {
    return walletCluster ?? defaultCluster;
  }
  return (cluster.includes(':') ? cluster.split(':')[1] : cluster) as SolanaClusterMoniker;
};

/**
 * Retrieves the configured RPC URL for a given cluster moniker.
 * @param cluster The target cluster. Defaults to the wallet's active chain.
 * @returns The RPC URL or undefined if not found.
 */
export const getRpcUrlForCluster = ({
  cluster,
  walletCluster,
  rpcUrls,
}: { cluster: SolanaClusterMoniker; walletCluster?: SolanaClusterMoniker } & SolanaRPCUrls) => {
  const targetCluster = walletCluster ?? cluster;
  return rpcUrls[targetCluster] ?? 'https://api.mainnet-beta.solana.com/';
};
