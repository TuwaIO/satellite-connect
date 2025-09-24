import { createViemClient } from '@tuwaio/orbit-evm';
import { Config, getBytecode } from '@wagmi/core';
import { Address } from 'viem';
import { Chain } from 'viem/chains';

/**
 * An in-memory cache for wallets bytecode to avoid redundant requests to the blockchain.
 * @internal
 */
const walletsCache = new Map<string, boolean>();

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
}) {
  if (walletsCache.has(address)) {
    return walletsCache.get(address)!;
  }
  const client = createViemClient(chainId as number, chains);
  if (client) {
    const codeOfWalletAddress = await getBytecode(config, {
      address: address as Address,
    });
    walletsCache.set(address, !!codeOfWalletAddress);
    return !!codeOfWalletAddress;
  } else {
    return false;
  }
}
