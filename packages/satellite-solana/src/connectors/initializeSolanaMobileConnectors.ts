import {
  createDefaultAuthorizationCache,
  createDefaultChainSelector,
  createDefaultWalletNotFoundHandler,
  registerMwa,
} from '@solana-mobile/wallet-standard-mobile';
import { SolanaRPCUrls } from '@tuwaio/orbit-solana';
import { ConnectorsInitProps } from '@tuwaio/satellite-core';

type InitializeSolanaMobileConnectorsProps = ConnectorsInitProps & SolanaRPCUrls;

export function initializeSolanaMobileConnectors({ rpcUrls, ...props }: InitializeSolanaMobileConnectorsProps) {
  if (typeof window !== 'undefined') {
    if (!window.isSecureContext) {
      console.warn(`Solana Mobile Connectors not loaded: https connection required`);
      return;
    }

    const chains = Object.keys(rpcUrls).map((key) => `solana:${key}` as `solana:${string}`);

    if (chains.length === 0) {
      console.warn(`Solana Mobile Connectors not loaded: no chains provided`);
      return;
    }

    registerMwa({
      appIdentity: {
        uri: props?.appUrl,
        icon: props?.appLogoUrl,
        name: props?.appName,
      },
      authorizationCache: createDefaultAuthorizationCache(),
      chains,
      chainSelector: createDefaultChainSelector(),
      onWalletNotFound: createDefaultWalletNotFoundHandler(),
    });
  }
}
