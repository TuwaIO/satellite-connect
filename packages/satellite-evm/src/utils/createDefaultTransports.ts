import { chainTransport } from '@tuwaio/orbit-evm';
import { CreateConfigParameters } from '@wagmi/core';
import { Transport } from 'viem';

/**
 * Creates the `transports` of a wagmi config: for every chain, the `chainTransport` from `@tuwaio/orbit-evm` over the
 * default RPC URLs of its definition (`rpcUrls.default.http`), the next one when one does not answer. Those of the
 * viem chains are public, rate-limited endpoints: for production, put your own URLs first in the chain definition or
 * pass `http(yourRpcUrl)` transports.
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
      acc[key] = chainTransport(chain);
      return acc;
    },
    {} as Record<number, Transport>,
  );
};
