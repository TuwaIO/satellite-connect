import { ConnectorsInitProps } from '@tuwaio/satellite-core';
import { createConfig, CreateConfigParameters } from '@wagmi/core';
import { http, Transport } from 'viem';

import { initAllConnectors } from '../connectors';

/**
 * Creates default HTTP transports for each chain in the configuration
 *
 * @param chains - Array of chain configurations from wagmi
 * @returns Object mapping chain IDs to their corresponding HTTP transport instances
 *
 * @internal
 */
const createDefaultTransports = (chains: CreateConfigParameters['chains']): Record<number, Transport> => {
  return chains.reduce(
    (acc, chain) => {
      const key = chain.id;
      acc[key] = http() as Transport;
      return acc;
    },
    {} as Record<number, Transport>,
  );
};

/**
 * Creates a Wagmi configuration with initialized connectors and transports
 *
 * @remarks
 * This function combines Satellite connector initialization with Wagmi configuration.
 * It automatically sets up HTTP transports for each chain if custom transports are not provided.
 *
 * @param config - Combined configuration parameters for Satellite and Wagmi
 * @param config.chains - Array of supported blockchain networks
 * @param config.transports - Optional custom transport configurations for each chain
 * @param config.projectId - WalletConnect project ID
 * @param config.appName - Application name for wallet connection UI
 * @param config.appUrl - Application URL for metadata
 * @param config.appLogoUrl - URL to application logo
 * @param config.appLogo - Optional inline logo data
 * @param config.appIcons - Array of application icon URLs
 * @param config.description - Application description for wallet connection UI
 * @param config.getImpersonatedAccount - Optional function for development wallet impersonation
 *
 * @returns Configured Wagmi instance
 *
 * @example
 * ```typescript
 * const config = createWagmiConfig({
 *   chains: [mainnet, polygon],
 *   projectId: "your_project_id",
 *   appName: "My dApp",
 *   appUrl: "https://mydapp.com",
 *   appLogoUrl: "https://mydapp.com/logo.png"
 * });
 * ```
 */
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
  // Initialize wallet connectors with provided configuration
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

  // Create and return the complete Wagmi configuration
  return createConfig({
    connectors,
    // Use custom transports if provided, otherwise create default HTTP transports
    transports: transports ?? createDefaultTransports(chains),
    chains,
    ...params,
  });
};
