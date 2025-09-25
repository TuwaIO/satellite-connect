import {
  createDefaultAuthorizationCache,
  createDefaultChainSelector,
  createDefaultWalletNotFoundHandler,
  registerMwa,
} from '@solana-mobile/wallet-standard-mobile';
import { SolanaRPCUrls } from '@tuwaio/orbit-solana';
import { ConnectorsInitProps } from '@tuwaio/satellite-core';

/**
 * Combined props for initializing Solana mobile connectors
 */
type InitializeSolanaMobileConnectorsProps = ConnectorsInitProps & SolanaRPCUrls;

/**
 * Initializes Solana Mobile Wallet Adapter (MWA) for mobile wallet connections
 *
 * @remarks
 * This function sets up the Solana Mobile Wallet Adapter with appropriate configuration
 * for secure mobile wallet connections. It includes security checks and chain validation.
 * Only works in secure contexts (HTTPS) and requires at least one valid chain configuration.
 *
 * @param props - Combined initialization properties
 * @param props.rpcUrls - RPC endpoints for different Solana networks
 * @param props.appName - Application name to display in wallet
 * @param props.appUrl - Application URL
 * @param props.appLogoUrl - Application logo URL
 *
 * @example
 * ```typescript
 * initializeSolanaMobileConnectors({
 *   rpcUrls: {
 *     mainnet: 'https://api.mainnet-beta.solana.com',
 *     devnet: 'https://api.devnet.solana.com'
 *   },
 *   appName: 'My Solana App',
 *   appUrl: 'https://myapp.com',
 *   appLogoUrl: 'https://myapp.com/logo.png'
 * });
 * ```
 *
 * @throws {Warning} If not in secure context (non-HTTPS)
 * @throws {Warning} If no chains are configured
 */
export function initializeSolanaMobileConnectors({ rpcUrls, ...props }: InitializeSolanaMobileConnectorsProps): void {
  // Only run in browser environment
  if (typeof window === 'undefined') {
    return;
  }
  // Ensure secure context (HTTPS)
  if (!window.isSecureContext) {
    console.warn('Solana Mobile Connectors not loaded: https connection required');
    return;
  }

  // Generate chain identifiers
  const chains = Object.keys(rpcUrls).map((key) => `solana:${key}` as `solana:${string}`);

  // Validate chain configuration
  if (chains.length === 0) {
    console.warn('Solana Mobile Connectors not loaded: no chains provided');
    return;
  }

  // Register Mobile Wallet Adapter
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
