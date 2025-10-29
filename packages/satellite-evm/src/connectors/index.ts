import { ConnectorsInitProps } from '@tuwaio/satellite-core';
import {
  baseAccount,
  gemini,
  GeminiParameters,
  injected,
  porto,
  PortoParameters,
  safe,
  walletConnect,
} from '@wagmi/connectors';
import { CreateConnectorFn } from '@wagmi/core';

import { impersonated } from './ImpersonatedConnector';

/**
 * Configuration options for Gnosis Safe SDK
 * @remarks
 * Defines allowed domains and debug mode for Safe integration
 */
export const safeSdkOptions = {
  /** Regular expressions for allowed Safe wallet domains */
  allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/, /metissafe.tech$/],
  /** Enable debug mode */
  debug: false,
};

/**
 * Initializes all supported wallet connectors based on provided configuration
 *
 * @remarks
 * Creates instances of various wallet connectors including:
 * - Injected wallets (e.g., MetaMask, Phantom, Trust Wallet, etc.)
 * - Coinbase Wallet
 * - Gnosis Safe
 * - WalletConnect (if projectId provided)
 * - Impersonated wallet (for development/testing)
 *
 * The order of connectors in the returned array determines their priority
 * in the wallet connection UI.
 *
 * @param props - Configuration options for initializing connectors
 * @param geminiParameters - Optional parameters for Gemini wallet connector
 * @param portoParameters - Optional parameters for Porto wallet connector
 * @returns Array of wallet connector instances
 *
 * @example
 * ```typescript
 * const connectors = initAllConnectors({
 *   appName: "My dApp",
 *   projectId: "wallet_connect_project_id",
 *   appUrl: "https://mydapp.com",
 *   appLogoUrl: "https://mydapp.com/logo.png"
 * });
 * ```
 */
export const initAllConnectors = (
  props: ConnectorsInitProps,
  geminiParameters?: GeminiParameters,
  portoParameters?: PortoParameters,
): readonly CreateConnectorFn[] => {
  const injectedConnector = injected();
  const baseConnector = baseAccount({
    appName: props.appName,
    appLogoUrl: props.appLogoUrl,
  });
  const gnosisSafeConnector = safe({
    ...safeSdkOptions,
  });
  const geminiConnector = gemini(geminiParameters);
  const portoConnector = porto(portoParameters);

  const connectors = [
    injectedConnector,
    baseConnector,
    gnosisSafeConnector,
    geminiConnector,
    portoConnector,
    impersonated({}),
  ];

  // WalletConnect metadata configuration
  const wcMetadata =
    props.appUrl && props.appIcons && props.appName && props.description
      ? {
          name: props.appName,
          description: props.description,
          url: props.appUrl,
          icons: props.appIcons,
        }
      : undefined;

  if (props.projectId) {
    const walletConnectConnector = walletConnect({
      projectId: props.projectId,
      metadata: wcMetadata,
    });
    // @ts-expect-error - WalletConnect has unique types for connectors and connectorsOptions
    connectors.push(walletConnectConnector);
  }

  return connectors;
};
