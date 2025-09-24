import { ConnectorsInitProps } from '@tuwaio/satellite-core';
import { coinbaseWallet, injected, metaMask, safe, walletConnect } from '@wagmi/connectors';
import { CreateConnectorFn } from '@wagmi/core';

import { impersonated } from './ImpersonatedConnector';

export const safeSdkOptions = {
  allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/, /metissafe.tech$/],
  debug: false,
};

export const initAllConnectors = (props: ConnectorsInitProps): readonly CreateConnectorFn[] => {
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

  const connectors = [injectedConnector, metamaskConnector, coinbaseConnector, gnosisSafeConnector];

  const wcMetadata =
    props.appUrl && props.appIcons && props.appName && props.description
      ? {
          name: props.appName,
          description: props.description,
          url: props.appUrl,
          icons: props.appIcons,
        }
      : undefined;

  if (props.projectId && !props.getImpersonatedAccount) {
    const walletConnectConnector = walletConnect({
      projectId: props.projectId,
      metadata: wcMetadata,
    });
    return [walletConnectConnector, ...connectors];
  } else if (!props.projectId && !!props.getImpersonatedAccount) {
    const impersonatedConnector = impersonated({
      getAccountAddress: props.getImpersonatedAccount,
    });
    return [impersonatedConnector, ...connectors];
  } else if (props.projectId && !!props.getImpersonatedAccount) {
    const walletConnectConnector = walletConnect({
      projectId: props.projectId,
      metadata: wcMetadata,
    });
    const impersonatedConnector = impersonated({
      getAccountAddress: props.getImpersonatedAccount,
    });
    return [walletConnectConnector, impersonatedConnector, ...connectors];
  } else {
    return connectors;
  }
};
