/**
 * @file This file extends the program account fetching utility by adding decoding capabilities.
 * It allows fetching and transparently decoding on-chain account data into structured TypeScript objects.
 */

import { Buffer } from 'buffer'; // Ensure Buffer is explicitly imported for cross-platform compatibility.
import {
  Account,
  AccountInfoBase,
  AccountInfoWithBase64EncodedData,
  decodeAccount,
  Decoder,
  MaybeEncodedAccount,
  parseBase64RpcAccount,
  SolanaClient,
} from 'gill';

import { getProgramAccounts, GetProgramAccountsConfig } from './getProgramAccounts';

/**
 * Extends the basic program account configuration with a decoder for the account data.
 * @template T The structured object type that the raw account data will be decoded into.
 */
export interface GetProgramAccountsDecodedConfig<T extends object> extends GetProgramAccountsConfig {
  /** The decoder responsible for parsing the raw account data into type `T`. */
  decoder: Decoder<T>;
}

/**
 * Fetches program accounts, filters them, and decodes their data into a structured format.
 *
 * This function builds on `getProgramAccounts` by adding a decoding step. It is useful
 * for retrieving and immediately working with typed account data without manual parsing.
 *
 * @template T The object type to which the account data will be decoded.
 * @param rpc The Solana RPC client instance from the `gill` library.
 * @param config The configuration, including the program address, filter, and a data decoder.
 * @returns A promise that resolves to an array of fully decoded program accounts.
 * @throws Will throw an error if the RPC call or the decoding process fails.
 *
 * @example
 * // Assume `myAccountDecoder` is a valid Decoder<MyAccountType>
 * const decodedAccounts = await getProgramAccountsDecoded(rpc, {
 * programAddress: '...program_address...',
 * filter: '...base58_encoded_discriminator...',
 * decoder: myAccountDecoder,
 * });
 *
 * for (const account of decodedAccounts) {
 * console.log('Decoded data:', account.data); // account.data is now of type MyAccountType
 * }
 */
export async function getProgramAccountsDecoded<T extends object>(
  rpc: SolanaClient['rpc'],
  config: GetProgramAccountsDecodedConfig<T>,
) {
  // 1. Fetch the raw, encoded program accounts using the base utility.
  const programAccounts = await getProgramAccounts(rpc, {
    filter: config.filter,
    programAddress: config.programAddress,
  });

  // 2. Parse the RPC response and prepare it for the decoder.
  // @ts-ignore
  const encodedAccounts: Array<MaybeEncodedAccount> = programAccounts.map((item) => {
    const account = parseBase64RpcAccount(
      item.pubkey,
      item.account as AccountInfoBase & AccountInfoWithBase64EncodedData,
    );
    // The `decodeAccount` function expects data as a Buffer.
    return {
      ...account,
      data: Buffer.from(account.data),
      exists: true,
    };
  });

  // 3. Decode each account's data using the provided decoder.
  return encodedAccounts.map((item) => {
    return decodeAccount(item, config.decoder) as Account<T, string>;
  });
}
