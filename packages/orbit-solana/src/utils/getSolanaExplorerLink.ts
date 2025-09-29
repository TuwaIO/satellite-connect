/**
 * @file This file contains a utility function for generating Solana transaction explorer links.
 */

import { getExplorerLink } from 'gill';

import { getCluster } from './clusterHelpers';

/**
 * Generates a full URL to a transaction on a Solana explorer like Solscan.
 *
 * @param {string} url - The url after baseUrl.
 * @param chainId
 * @returns {string} The full URL to the transaction on the explorer.
 */
export const getSolanaExplorerLink = (url?: string, chainId?: string | number | undefined): string => {
  const cluster = getCluster({ cluster: String(chainId) }) ?? 'mainnet';
  // Ensure there are no trailing slashes on the base URL for clean URL construction.
  const baseUrl = getExplorerLink();
  const sanitizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  // Build the cluster query parameter if provided.
  const clusterParam = cluster ? `?cluster=${cluster}` : '';

  return `${sanitizedBaseUrl}${url ? url : '/'}${clusterParam}`;
};
