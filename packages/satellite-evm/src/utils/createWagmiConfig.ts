import { AllConnectorsInitProps } from '@tuwaio/satellite-core';
import { createConfig, CreateConfigParameters } from '@wagmi/core';
import { http, Transport } from 'viem';

import { initAllConnectors } from '../connectors';

export interface GetDefaultConfigParameters
  extends Omit<
    CreateConfigParameters,
    // If you use 'client' you can't use 'transports' (we force to use 'transports')
    // More info here https://wagmi.sh/core/api/createConfig#client
    // We will also use our own 'connectors' instead of letting user specifying it
    'client' | 'connectors'
  > {
  connectorsInitProps: AllConnectorsInitProps;
}

const createDefaultTransports = (chains: CreateConfigParameters['chains']): Record<number, Transport> => {
  const transportsObject = chains.reduce((acc: CreateConfigParameters['transports'], chain) => {
    const key = chain.id;
    acc![key] = http() as Transport;
    return acc;
  }, {});
  return transportsObject ?? {};
};

export function createWagmiConfig({ connectorsInitProps, ...params }: GetDefaultConfigParameters) {
  const { chains, transports, ...restParams } = params;
  const connectors = initAllConnectors({
    ...connectorsInitProps,
  });
  return createConfig({
    connectors,
    transports: transports || createDefaultTransports(chains),
    chains,
    ...restParams,
  });
}
