import { createViemClient } from '@tuwaio/orbit-evm';
import { Config, getBytecode } from '@wagmi/core';
import { Address } from 'viem';
import { Chain } from 'viem/chains';

/**
 * An in-memory cache for wallets bytecode to avoid redundant requests to the blockchain.
 * Key is the wallet address, value is boolean indicating if it's a contract address.
 * @internal
 */
const walletsCache = new Map<string, boolean>();

/**
 * Checks if a given wallet address is a smart contract by examining its bytecode
 *
 * @remarks
 * This function uses an in-memory cache to store results and avoid redundant blockchain requests.
 * The cache persists for the lifetime of the application session.
 *
 * @param config - Wagmi configuration object
 * @param address - Ethereum address to check
 * @param chainId - ID of the blockchain network
 * @param chains - Array of supported chain configurations
 *
 * @returns Promise resolving to boolean indicating if the address is a contract
 * - true: Address is a smart contract
 * - false: Address is an EOA (Externally Owned Account) or client creation failed
 *
 * @example
 * ```typescript
 * const isContract = await checkIsWalletAddressContract({
 *   config: wagmiConfig,
 *   address: "0x1234...",
 *   chainId: 1,
 *   chains: [mainnet, polygon]
 * });
 * ```
 *
 * @throws Will throw an error if getBytecode request fails
 */
export async function checkIsWalletAddressContract({
  config,
  address,
  chainId,
  chains,
}: {
  /** Wagmi configuration for blockchain interaction */
  config: Config;
  /** Ethereum address to check */
  address: string;
  /** Chain ID where the check should be performed */
  chainId: number | string;
  /** Array of supported chain configurations */
  chains: readonly [Chain, ...Chain[]];
}): Promise<boolean> {
  // Check cache first to avoid redundant blockchain requests
  if (walletsCache.has(address)) {
    return walletsCache.get(address)!;
  }

  // Create Viem client for blockchain interaction
  const client = createViemClient(chainId as number, chains);

  if (client) {
    // Get bytecode from the blockchain
    const codeOfWalletAddress = await getBytecode(config, {
      address: address as Address,
    });

    // Cache the result
    const isContract = !!codeOfWalletAddress;
    walletsCache.set(address, isContract);

    return isContract;
  } else {
    // Return false if client creation failed
    return false;
  }
}
