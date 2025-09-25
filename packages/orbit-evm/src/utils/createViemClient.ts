/**
 * @file This file contains a utility function for creating a viem Public Client.
 */

import { createPublicClient, http, PublicClient } from 'viem';
import { Chain } from 'viem/chains';

/**
 * Creates a viem Public Client for a specific chain.
 *
 * This client is used for read-only interactions with the blockchain, such as fetching
 * transaction receipts or reading contract state, without needing a wallet connection.
 *
 * @param {number} chainId - The ID of the chain for which to create the client.
 * @param {Chain[]} chains - An array of supported viem Chain objects.
 *
 * @returns {import('viem').PublicClient | undefined} A viem PublicClient instance if a matching chain is found, otherwise undefined.
 * It will also log a warning to the console if the chain is not configured.
 */
export function createViemClient(chainId: number, chains: readonly [Chain, ...Chain[]]): PublicClient | undefined {
  const chain = chains.find((c) => c.id === chainId);

  if (chain) {
    return createPublicClient({
      chain: chain,
      transport: http(),
    });
  }
  // Log a warning for easier debugging if a chain configuration is missing.
  console.warn(`createViemClient: No chain configuration found for chainId ${chainId}. A client could not be created.`);

  return undefined;
}
