import { getAvailableWallets } from './getAvailableSolanaWallets';

/**
 * Cache for Solana avatar lookup results.
 * Key: normalized name (lowercase string), Value: Avatar URL (string).
 */
const solanaAvatarCache = new Map<string, string>();

/**
 * Searches and returns the avatar URL (icon) for a given Solana account name (label)
 * among connected wallets. Includes caching for performance on repeated requests.
 *
 * @param name The account name (label) to look up.
 * @returns A promise that resolves to the account's icon URL, or the original name string if the icon is not found.
 */
export const getSolanaAddressAvatar = async (name: string): Promise<string> => {
  // Normalize the name to use as a cache key, ensuring case-insensitivity.
  const normalizedName = name.toLowerCase();

  // Check the cache: if the result exists, return it immediately.
  const cachedAvatar = solanaAvatarCache.get(normalizedName);
  if (cachedAvatar !== undefined) {
    return cachedAvatar;
  }

  const wallets = getAvailableWallets();

  // Find the first wallet that contains an account with a matching label.
  const connectedWallet = wallets.find((wallet) =>
    wallet.accounts.some((account) => account.label?.toLowerCase() === normalizedName),
  );

  // Retrieve the icon URL for the specific matching account.
  // If no matching account is found, fall back to the original name string.
  const resultAvatar =
    connectedWallet?.accounts.find((account) => account.label?.toLowerCase() === normalizedName)?.icon ?? name;

  // Store the result (including the fallback name if icon is null) in the cache.
  solanaAvatarCache.set(normalizedName, resultAvatar);

  return resultAvatar;
};
