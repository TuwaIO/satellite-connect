import { ConnectorsInitProps } from '@tuwaio/satellite-core';
import { coinbaseWallet, injected, metaMask, safe, walletConnect } from '@wagmi/connectors';
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
 * - Injected provider (e.g. browser wallets)
 * - MetaMask
 * - Coinbase Wallet
 * - Gnosis Safe
 * - WalletConnect (if projectId provided)
 * - Impersonated wallet (for development/testing)
 *
 * The order of connectors in the returned array determines their priority
 * in the wallet connection UI.
 *
 * @param props - Configuration options for initializing connectors
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
export const initAllConnectors = (props: ConnectorsInitProps): readonly CreateConnectorFn[] => {
  // Base connectors that are always available
  const injectedConnector = injected();
  const metamaskConnector = metaMask({
    dappMetadata: { name: props.appName, url: props.appUrl },
  });
  const coinbaseConnector = coinbaseWallet({
    appName: props.appName,
    appLogoUrl: props.appLogoUrl,
  });
  const gnosisSafeConnector = safe({
    ...safeSdkOptions,
  });

  // Array of base connectors
  const connectors = [injectedConnector, metamaskConnector, coinbaseConnector, gnosisSafeConnector];

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

  // Add optional connectors based on configuration
  if (props.projectId && !props.getImpersonatedAccount) {
    // WalletConnect only
    const walletConnectConnector = walletConnect({
      projectId: props.projectId,
      metadata: wcMetadata,
    });
    return [walletConnectConnector, ...connectors];
  } else if (!props.projectId && !!props.getImpersonatedAccount) {
    // Impersonated connector only
    const impersonatedConnector = impersonated({
      getAccountAddress: props.getImpersonatedAccount,
    });
    return [impersonatedConnector, ...connectors];
  } else if (props.projectId && !!props.getImpersonatedAccount) {
    // Both optional connectors
    const walletConnectConnector = walletConnect({
      projectId: props.projectId,
      metadata: wcMetadata,
    });
    const impersonatedConnector = impersonated({
      getAccountAddress: props.getImpersonatedAccount,
    });
    return [walletConnectConnector, impersonatedConnector, ...connectors];
  } else {
    // Base connectors only
    return connectors;
  }
};
