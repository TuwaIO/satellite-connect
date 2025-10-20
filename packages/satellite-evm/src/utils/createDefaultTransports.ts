import { CreateConfigParameters } from '@wagmi/core';
import { http, Transport } from 'viem';

/**
 * Creates default HTTP transports for each chain in the configuration
 *
 * @param chains - Array of chain configurations from wagmi
 * @returns Object mapping chain IDs to their corresponding HTTP transport instances
 *
 * @public
 */
export const createDefaultTransports = (chains: CreateConfigParameters['chains']): Record<number, Transport> => {
  return chains.reduce(
    (acc, chain) => {
      const key = chain.id;
      acc[key] = http() as Transport;
      return acc;
    },
    {} as Record<number, Transport>,
  );
};
