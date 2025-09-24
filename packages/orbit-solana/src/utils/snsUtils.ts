/**
 * @file This file contains utility functions for interacting with the Solana Name Service (SNS) provided by Bonfida.
 */

import { getDomainKeysWithReverses, getRecord, performReverseLookup, Record } from '@bonfida/spl-name-service';
import { Connection, PublicKey } from '@solana/web3.js';

/**
 * A cache to store Connection instances for different RPC URLs.
 * This prevents creating a new Connection object for every function call.
 * @type {Map<string, Connection>}
 */
const connectionCache = new Map<string, Connection>();

/**
 * A cache to store resolved domain names against wallet addresses.
 * This prevents repeated reverse lookups for the same address.
 * @type {Map<string, string | null>}
 */
const domainNameCache = new Map<string, string | null>();

/**
 * Retrieves a cached Connection object or creates a new one if it doesn't exist.
 * @param {string} rpcUrl - The RPC endpoint URL.
 * @returns {Connection} An instance of the Connection class.
 */
const getConnection = (rpcUrl: string): Connection => {
  if (!connectionCache.has(rpcUrl)) {
    connectionCache.set(rpcUrl, new Connection(rpcUrl));
  }
  return connectionCache.get(rpcUrl)!;
};

/**
 * Performs a reverse lookup to find the .sol domain name for a given wallet address.
 * Results are cached to avoid redundant network requests.
 * @param {string} rpcUrl - The RPC endpoint URL.
 * @param {string} address - The public key of the wallet as a string.
 * @returns {Promise<string | null>} The .sol domain name (e.g., "bonfida.sol") or null if not found.
 */
export const getSolanaName = async (rpcUrl: string, address: string): Promise<string | null> => {
  // Return the cached domain name if it exists for the given address.
  if (domainNameCache.has(address)) {
    return domainNameCache.get(address)!;
  }

  try {
    const connection = getConnection(rpcUrl);
    const pubKey = new PublicKey(address);

    const domainKeys = await getDomainKeysWithReverses(connection, pubKey);

    if (domainKeys.length === 0) {
      // Cache the null result to prevent future lookups for this address.
      domainNameCache.set(address, null);
      return null;
    }

    // @ts-expect-error - domainKeys is an array of PublicKey objects.
    const domainName = await performReverseLookup(connection, domainKeys[0]);
    const fullDomain = `${domainName}.sol`;

    // Cache the successful result.
    domainNameCache.set(address, fullDomain);
    return fullDomain;
  } catch {
    // Cache the null result in case of an error.
    domainNameCache.set(address, null);
    return null;
  }
};

/**
 * Retrieves the avatar URL from the 'pic' record of a .sol domain name.
 * @param {string} rpcUrl - The RPC endpoint URL.
 * @param {string} name - The .sol domain name (e.g., "bonfida.sol").
 * @returns {Promise<string | null>} The URL of the avatar or null if not found or set.
 */
export const getSolanaAvatar = async (rpcUrl: string, name: string): Promise<string | null> => {
  try {
    const connection = getConnection(rpcUrl);
    const record = await getRecord(connection, name, Record.Pic);

    if (!record || !record.data) {
      return null;
    }

    return record.data.toString('utf-8');
  } catch {
    // Fails silently if the record doesn't exist.
    return null;
  }
};
