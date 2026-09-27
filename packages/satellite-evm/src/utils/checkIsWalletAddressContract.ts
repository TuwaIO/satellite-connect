import { createViemClient } from '@tuwaio/orbit-evm';
import { Config, getBytecode } from '@wagmi/core';
import { Address } from 'viem';
import { Chain } from 'viem/chains';

/**
 * In-memory cache of the results, keyed by `<chainId>:<lowercase address>`. It lives as long as the page.
 * @internal
 */
const walletsCache = new Map<string, boolean>();

/**
 * Checks whether an address has contract code on a chain, for example to detect smart contract wallets such as Safe.
 * The EVM adapter uses it as `checkIsContractAddress`, and the store saves the result in `isContractAddress`.
 *
 * Side effects: reads the code with wagmi's `getBytecode` through the wagmi transport of `chainId` (an RPC request),
 * and caches the result in memory per chain and address for the lifetime of the page. Addresses with code include
 * EIP-7702 delegated accounts.
 *
 * @param params - Address and chain to check.
 * @param params.config - The wagmi config whose transports are used.
 * @param params.address - The address to check.
 * @param params.chainId - The chain to check it on, as a number or numeric string.
 * @param params.chains - The app chains. When `chainId` is not in this list, nothing is requested and a warning is
 * logged.
 * @returns `true` when the address has code; `false` when it has none or `chainId` is not in `chains`.
 * @throws {Error} When the RPC request fails (the failure is not cached).
 *
 * @example
 * ```ts
 * import { checkIsWalletAddressContract } from '@tuwaio/satellite-evm';
 * import { type Config } from '@wagmi/core';
 * import { mainnet } from 'viem/chains';
 *
 * declare const wagmiConfig: Config;
 *
 * const isContract = await checkIsWalletAddressContract({
 *   config: wagmiConfig,
 *   address: '0xAb5801a7D398351b8bE11C439e05C5B3259aeC9B',
 *   chainId: mainnet.id,
 *   chains: [mainnet],
 * });
 * ```
 */
export async function checkIsWalletAddressContract({
  config,
  address,
  chainId,
  chains,
}: {
  config: Config;
  address: string;
  chainId: number | string;
  chains: readonly [Chain, ...Chain[]];
}): Promise<boolean> {
  // An address can be a contract on one chain and an EOA on another, so results are cached per chain
  const cacheKey = `${Number(chainId)}:${address.toLowerCase()}`;

  // Check cache first to avoid redundant blockchain requests
  if (walletsCache.has(cacheKey)) {
    return walletsCache.get(cacheKey)!;
  }

  // Create Viem client for blockchain interaction
  const client = createViemClient(Number(chainId), chains);

  if (client) {
    // Get bytecode from the requested chain
    const codeOfWalletAddress = await getBytecode(config, {
      address: address as Address,
      chainId: Number(chainId),
    });

    // Cache the result
    const isContract = !!codeOfWalletAddress;
    walletsCache.set(cacheKey, isContract);

    return isContract;
  } else {
    // Return false if client creation failed
    return false;
  }
}
