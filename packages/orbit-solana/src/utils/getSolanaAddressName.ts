import { getConnectedSolanaWallet } from './getConnectedSolanaWallet';

/**
 * Cache for Solana address lookup results.
 * Key: normalized address (lowercase string), Value: Account name/label (string).
 */
const solanaNameCache = new Map<string, string>();

/**
 * Searches and returns the account name (label) for a given Solana address
 * among connected wallets. Includes caching for performance on repeated requests.
 *
 * @param address The Solana account address to look up.
 * @returns A promise that resolves to the account's name/label, or the original address string if the name is not found.
 */
export const getSolanaAddressName = async (address: string): Promise<string> => {
  // Normalize the address to use as a cache key, ensuring case-insensitivity.
  const normalizedAddress = address.toLowerCase();

  // Check the cache: if the result exists, return it immediately.
  const cachedName = solanaNameCache.get(normalizedAddress);
  if (cachedName !== undefined) {
    return cachedName;
  }

  const connectedWallet = getConnectedSolanaWallet();
  // The result is the found label, or the original address if no label was found.
  const resultName =
    connectedWallet.accounts.find((a) => a.address.toLowerCase() === normalizedAddress)?.label ?? address;
  // Store the result (including the fallback address string if label is null) in the cache.
  solanaNameCache.set(normalizedAddress, resultName);

  return resultName;
};
