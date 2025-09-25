import { Config, writeContract } from '@wagmi/core';
import { sepolia } from 'viem/chains';

import { CounterAbi } from '@/abis/CounterAbi';
import { COUNTER_ADDRESS } from '@/constants';

export async function increment({ wagmiConfig }: { wagmiConfig?: Config }) {
  if (wagmiConfig) {
    return writeContract(wagmiConfig, {
      abi: CounterAbi,
      address: COUNTER_ADDRESS,
      functionName: 'increment',
      args: [],
      chainId: sepolia.id,
    });
  }
  return undefined;
}
