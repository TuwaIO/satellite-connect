/**
 * @file This file contains utility functions for interacting with the Ethereum Name Service (ENS).
 * It provides methods for resolving names to addresses, addresses to names, and fetching avatars,
 * all specifically targeting the Ethereum Mainnet where ENS is deployed.
 */

import { Address, Hex, isAddress } from 'viem';
import { mainnet } from 'viem/chains';
import { getEnsAddress, getEnsAvatar, getEnsName, normalize } from 'viem/ens';

import { createViemClient } from './createViemClient';

const nameCache = new Map<Hex, string | null>();
const avatarCache = new Map<string, string | null>();
const addressCache = new Map<string, Address | null>();

// -------------------

// A single, shared viem client for all ENS lookups.
// ENS lookups are always performed against Ethereum Mainnet, regardless of the app's connected chain.
const ensClient = createViemClient(mainnet.id, [mainnet]);

/**
 * Fetches the primary ENS name for a given Ethereum address from the Ethereum Mainnet.
 * Includes caching for performance.
 *
 * @param {Hex} address - The Ethereum address to look up.
 * @returns {Promise<string | null>} The ENS name if found, otherwise null.
 */
export const getName = async (address: Hex): Promise<string | null> => {
  if (!ensClient) return null;

  const cachedName = nameCache.get(address);
  if (cachedName !== undefined) {
    return cachedName;
  }

  try {
    const name = await getEnsName(ensClient, { address });
    nameCache.set(address, name);
    return name;
  } catch (error) {
    console.error(`ENS name lookup failed for address ${address}:`, error);
    return null;
  }
};

/**
 * Fetches the avatar URL for a given ENS name from the Ethereum Mainnet.
 * Includes caching for performance.
 *
 * @param {string} name - The ENS name (e.g., 'vitalik.eth').
 * @returns {Promise<string | null>} The URL of the avatar image if found, otherwise null.
 */
export const getAvatar = async (name: string): Promise<string | null> => {
  if (!ensClient) return null;
  const normalizedName = normalize(name);

  const cachedAvatar = avatarCache.get(normalizedName);
  if (cachedAvatar !== undefined) {
    return cachedAvatar;
  }

  try {
    const avatarUrl = await getEnsAvatar(ensClient, { name: normalizedName });
    avatarCache.set(normalizedName, avatarUrl);
    return avatarUrl;
  } catch (error) {
    console.error(`ENS avatar lookup failed for name ${name}:`, error);
    return null;
  }
};

/**
 * Fetches the Ethereum address associated with a given ENS name from the Ethereum Mainnet.
 * Includes caching for performance.
 *
 * @param {string} name - The ENS name to resolve (e.g., 'vitalik.eth').
 * @returns {Promise<Address | null>} The associated Ethereum address (lowercase) or null if not found.
 */
export const getAddress = async (name: string): Promise<Address | null> => {
  if (!ensClient) return null;
  const normalizedName = normalize(name);

  const cachedAddress = addressCache.get(normalizedName);
  if (cachedAddress !== undefined) {
    return cachedAddress;
  }

  try {
    const address = await getEnsAddress(ensClient, { name: normalizedName });
    const lowercasedAddress = address ? (address.toLowerCase() as Address) : null;
    addressCache.set(normalizedName, lowercasedAddress);
    return lowercasedAddress;
  } catch (error) {
    console.error(`ENS address lookup failed for name ${name}:`, error);
    return null;
  }
};

/**
 * A heuristic to check if a string is likely an ENS name.
 *
 * This is not a foolproof validation but a quick check. A valid ENS name
 * must contain at least one dot and should not be a valid Ethereum address.
 *
 * @param {string} nameOrAddress - The string to check.
 * @returns {boolean} True if the string is likely an ENS name.
 *
 * @example
 * isEnsName('vitalik.eth') // true
 * isEnsName('0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045') // false
 * isEnsName('notanaddress') // false (doesn't contain a dot)
 */
export const isEnsName = (nameOrAddress: string): boolean => {
  return nameOrAddress.includes('.') && !isAddress(nameOrAddress);
};
