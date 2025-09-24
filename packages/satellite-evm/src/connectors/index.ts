import { AllConnectorsInitProps } from '@tuwaio/satellite-core';
import { coinbaseWallet, injected, metaMask, safe, walletConnect } from '@wagmi/connectors';

import { impersonated } from './ImpersonatedConnector';

export const safeSdkOptions = {
  allowedDomains: [/gnosis-safe.io$/, /app.safe.global$/, /metissafe.tech$/],
  debug: false,
};

export const initAllConnectors = (props: AllConnectorsInitProps) => {
  const injectedConnector = injected();
  const metamaskConnector = metaMask({
    dappMetadata: { name: props.appName, url: props.wcParams?.metadata.url },
  });
  const coinbaseConnector = coinbaseWallet({
    appName: props.appName,
    appLogoUrl: props.wcParams?.metadata.url,
  });
  const gnosisSafeConnector = safe({
    ...safeSdkOptions,
  });

  const connectors = [injectedConnector, metamaskConnector, coinbaseConnector, gnosisSafeConnector];

  const wcParams = props.wcParams;
  if (wcParams && !props.getImpersonatedAccount) {
    const walletConnectConnector = walletConnect({
      projectId: wcParams.projectId,
      metadata: wcParams.metadata,
    });
    return [walletConnectConnector, ...connectors];
  } else if (!wcParams && !!props.getImpersonatedAccount) {
    const impersonatedConnector = impersonated({
      getAccountAddress: props.getImpersonatedAccount,
    });
    return [impersonatedConnector, ...connectors];
  } else if (wcParams && !!props.getImpersonatedAccount) {
    const walletConnectConnector = walletConnect({
      projectId: wcParams.projectId,
      metadata: wcParams.metadata,
    });
    const impersonatedConnector = impersonated({
      getAccountAddress: props.getImpersonatedAccount,
    });
    return [walletConnectConnector, impersonatedConnector, ...connectors];
  } else {
    return connectors;
  }
};
