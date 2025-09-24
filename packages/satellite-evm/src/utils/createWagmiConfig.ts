import { ConnectorsInitProps } from '@tuwaio/satellite-core';
import { createConfig, CreateConfigParameters } from '@wagmi/core';
import { http, Transport } from 'viem';

import { initAllConnectors } from '../connectors';

const createDefaultTransports = (chains: CreateConfigParameters['chains']) => {
  return chains.reduce(
    (acc, chain) => {
      const key = chain.id;
      acc[key] = http() as Transport;
      return acc;
    },
    {} as Record<number, Transport>,
  );
};

export const createWagmiConfig = ({
  chains,
  transports,
  projectId,
  appLogoUrl,
  appLogo,
  appUrl,
  appIcons,
  appName,
  getImpersonatedAccount,
  description,
  ...params
}: ConnectorsInitProps & Omit<CreateConfigParameters, 'client' | 'connectors'>) => {
  const connectors = initAllConnectors({
    projectId,
    appLogoUrl,
    appLogo,
    appUrl,
    appIcons,
    appName,
    getImpersonatedAccount,
    description,
  });
  return createConfig({
    connectors,
    transports: transports ?? createDefaultTransports(chains),
    chains,
    ...params,
  });
};
