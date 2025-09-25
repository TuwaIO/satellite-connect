import { SolanaClusterMoniker } from 'gill';

/**
 * The default RPC URLs for each Solana cluster.
 * Not all clusters need to be defined; undefined ones will fall back to other logic.
 * @internal
 */
export const defaultRpcUrlsByMoniker: Partial<Record<SolanaClusterMoniker, string>> = {
  mainnet: 'https://api.mainnet-beta.solana.com',
  devnet: 'https://api.devnet.solana.com',
  testnet: 'https://api.testnet.solana.com',
};
