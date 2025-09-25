/**
 * @file This file provides a utility function for fetching and filtering program accounts on the Solana blockchain.
 */

import { type Address, Base58EncodedBytes, SolanaClient } from 'gill';

/**
 * Defines the configuration required for fetching program accounts with a memcmp filter.
 */
export interface GetProgramAccountsConfig {
  /**
   * The Base58 encoded string of bytes to match against the account data.
   * This is used as the core of the `memcmp` filter.
   */
  filter: string;
  /** The public address of the program whose accounts are being queried. */
  programAddress: Address;
}

/**
 * Fetches program accounts and filters them based on a memory comparison (`memcmp`).
 *
 * This function is a wrapper around the `getProgramAccounts` RPC method, pre-configured
 * to use a `memcmp` filter at offset 0. It's useful for finding all accounts
 * that start with a specific sequence of bytes (e.g., a discriminator for an account type).
 *
 * @param rpc - The Solana RPC client instance from the `gill` library.
 * @param config - The configuration object containing the program address and the filter bytes.
 * @returns A promise that resolves with the RPC response containing the filtered accounts.
 * @throws Will throw an error if the RPC call fails.
 *
 * @example
 * const accounts = await getProgramAccounts(rpc, {
 * programAddress: '...program_address...',
 * filter: '...base58_encoded_discriminator...',
 * });
 * console.log('Found accounts:', accounts);
 */
export async function getProgramAccounts(rpc: SolanaClient['rpc'], config: GetProgramAccountsConfig) {
  // 1. Call the getProgramAccounts RPC method.
  return await rpc
    .getProgramAccounts(config.programAddress, {
      // 2. Request the account data to be returned as parsed JSON.
      encoding: 'jsonParsed',
      filters: [
        {
          // 3. Apply a memory comparison filter.
          memcmp: {
            // Start the comparison at the beginning of the account data (offset 0).
            offset: 0n,
            // The bytes to match, provided as a Base58 encoded string.
            bytes: config.filter as Base58EncodedBytes,
            encoding: 'base58',
          },
        },
      ],
    })
    .send();
}
