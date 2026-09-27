import { CreateConfigParameters } from '@wagmi/core';
import { http, Transport } from 'viem';

/**
 * Creates the `transports` of a wagmi config: a viem `http()` transport without a URL for every chain, so each chain
 * uses the first default RPC URL of its definition (`rpcUrls.default.http[0]`). These are public, rate-limited
 * endpoints: for production, pass `http(yourRpcUrl)` transports instead.
 *
 * @param chains - The chains of the wagmi config.
 * @returns Transports by chain ID.
 *
 * @example
 * ```ts
 * import { createDefaultTransports } from '@tuwaio/satellite-evm';
 * import { createConfig, injected } from '@wagmi/core';
 * import { mainnet, sepolia } from 'viem/chains';
 *
 * const chains = [mainnet, sepolia] as const;
 *
 * export const wagmiConfig = createConfig({
 *   chains,
 *   connectors: [injected()],
 *   transports: createDefaultTransports(chains),
 * });
 * ```
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
