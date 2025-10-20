import React, { ComponentPropsWithoutRef, ComponentType, memo, useMemo } from 'react';

import { NovaConnectProviderProps } from '../../hooks/useNovaConnect';
import { NovaConnectProvider, NovaConnectProviderCustomization } from '../../providers';
import {
  ConnectButton as InternalConnectButton,
  ConnectButtonCustomization,
  ConnectButtonProps as InternalConnectButtonProps,
} from './ConnectButton';

// Re-export types for external use
export type { NovaConnectProviderCustomization } from '../../providers';
export type { ConnectButtonCustomization, ConnectButtonData } from './ConnectButton';

/**
 * Root customization data for the complete NovaConnectButton with provider
 */
export interface NovaConnectButtonWithProviderData {
  /** Store instance */
  store: NovaConnectProviderProps['store'];
  /** Current labels configuration */
  labels?: NovaConnectProviderProps['labels'];
  /** Whether wallet is connected */
  isConnected: boolean;
  /** Current provider state */
  providerState: {
    /** Modal states */
    isConnectModalOpen: boolean;
    isConnectedModalOpen: boolean;
    isChainsListOpen: boolean;
    isChainsListOpenMobile: boolean;
    /** Connection states */
    connectedButtonStatus: string;
    isConnected: boolean;
    /** Active states */
    selectedAdapter: unknown;
    activeConnector: string | undefined;
    activeWallet: unknown;
  };
}

// --- Component Props Types ---
type RootContainerProps = {
  className?: string;
  children: React.ReactNode;
  providerData: NovaConnectButtonWithProviderData;
} & React.RefAttributes<HTMLDivElement>;

/**
 * Complete customization system for NovaConnectButton with Provider
 */
export type NovaConnectButtonWithProviderCustomization = {
  /** Custom components for root level */
  components?: {
    /** Custom root container wrapper */
    RootContainer?: ComponentType<RootContainerProps>;
    /** Custom NovaConnectProvider component */
    Provider?: ComponentType<ComponentPropsWithoutRef<typeof NovaConnectProvider>>;
    /** Custom ConnectButton component */
    ConnectButton?: ComponentType<ComponentPropsWithoutRef<typeof InternalConnectButton>>;
  };
  /** Custom class name generators for root */
  classNames?: {
    /** Function to generate root container classes */
    rootContainer?: (params: { providerData: NovaConnectButtonWithProviderData }) => string;
  };
  /** Provider customization options - full NovaConnectProviderCustomization support */
  provider?: NovaConnectProviderCustomization;
  /** ConnectButton customization options */
  connectButton?: ConnectButtonCustomization;
  /** Configuration options */
  config?: {
    /** Whether to wrap in root container */
    useRootContainer?: boolean;
    /** Custom provider props override */
    providerPropsOverride?: Partial<NovaConnectProviderProps>;
    /** Custom connect button props override */
    connectButtonPropsOverride?: Partial<InternalConnectButtonProps>;
  };
};

// --- Default Sub-Components ---
const DefaultRootContainer = ({ className, children, ...props }: RootContainerProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { providerData: _providerData, ...restProps } = props;
  return (
    <div className={className} {...restProps}>
      {children}
    </div>
  );
};

/**
 * Props for the complete NovaConnectButton component with provider integration
 */
export type NovaConnectButtonProps = Omit<InternalConnectButtonProps, 'store'> &
  Pick<NovaConnectProviderProps, 'store' | 'labels'> & {
    /** Complete customization options */
    customization?: NovaConnectButtonWithProviderCustomization;
  };

/**
 * NovaConnectButton - Complete wallet connection solution with provider integration
 *
 * This is the main entry point component that combines NovaConnectProvider with ConnectButton
 * to provide a complete wallet connection solution. It includes:
 *
 * Features:
 * - Complete provider context integration with full customization support
 * - Full wallet connection functionality
 * - Chain selector with multi-network support
 * - Transaction pool integration and monitoring
 * - Balance display and wallet avatar
 * - Impersonated wallet support
 * - Comprehensive accessibility features
 * - Complete customization system for all levels
 * - Memoized performance optimizations
 *
 * Provider Features:
 * - Wallet state management with custom handlers
 * - Modal state coordination
 * - Chain selection state
 * - Transaction status tracking
 * - Connection error handling with custom ErrorsProvider
 * - Impersonation support
 * - Custom labels merging and transformation
 * - Custom initialization and lifecycle hooks
 * - Custom context value transformation
 * - Custom provider tree rendering
 *
 * Button Features:
 * - Connect/disconnect wallet functionality
 * - Balance display when connected
 * - Chain selector for multi-network support
 * - Transaction pool integration
 * - Loading states and animations
 * - Keyboard navigation support
 * - Screen reader compatibility
 *
 * Customization System:
 * - Root container customization
 * - Full NovaConnectProvider customization (components, labels, errors, initialization, contextValue, rendering)
 * - ConnectButton customization (styling, components, handlers)
 * - All child component customizations (modals, selectors, content)
 * - Event handler overrides at every level
 * - Class name and style generators
 * - Configuration options
 *
 * Accessibility:
 * - Semantic HTML structure with proper roles
 * - ARIA labels and descriptions throughout
 * - Keyboard navigation with Enter and Space
 * - Focus management and visual indicators
 * - Screen reader announcements
 * - High contrast compatible styling
 *
 * @param appChains - Configuration for supported EVM blockchain networks (viem chain objects)
 * @param solanaRPCUrls - RPC URLs configuration for Solana network
 * @param store - Wallet store instance for state management
 * @param labels - Internationalization labels for all text content
 * @param className - Additional CSS classes for the button
 * @param transactionPool - Transaction pool for pending transactions display
 * @param pulsarAdapter - Pulsar adapter(s) for transaction handling
 * @param withBalance - Whether to show wallet balance in button
 * @param withChain - Whether to show chain selector when connected
 * @param withImpersonated - Whether to enable impersonated wallet functionality
 * @param customization - Complete customization options for all components
 * @returns JSX element representing the complete wallet connection interface
 *
 * @example
 * ```tsx
 * // Basic usage
 * <NovaConnectButton
 *   store={walletStore}
 *   appChains={[mainnet, polygon, arbitrum]} // EVM viem chain objects
 *   solanaRPCUrls={{
 *     'mainnet': 'https://api.mainnet-beta.solana.com'
 *   }}
 *   withBalance
 *   withChain
 *   withImpersonated
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With comprehensive customization
 * <NovaConnectButton
 *   store={walletStore}
 *   appChains={[mainnet, polygon, arbitrum]}
 *   solanaRPCUrls={solanaRPCConfig}
 *   labels={customLabels}
 *   withBalance
 *   withChain
 *   customization={{
 *     // Root level customization
 *     classNames: {
 *       rootContainer: ({ providerData }) =>
 *         `custom-root ${providerData.isConnected ? 'connected' : 'disconnected'}`
 *     },
 *     // Full provider customization
 *     provider: {
 *       // Custom components
 *       components: {
 *         LabelsProvider: CustomLabelsProvider,
 *         ErrorsProvider: CustomErrorsProvider
 *       },
 *       // Labels customization
 *       labels: {
 *         merge: (defaultLabels, userLabels) => ({ ...defaultLabels, ...userLabels }),
 *         transform: (mergedLabels, context) => ({
 *           ...mergedLabels,
 *           connectWallet: context.isConnected ? 'Reconnect' : 'Connect Wallet'
 *         })
 *       },
 *       // Error handling customization
 *       errors: {
 *         position: 'bottom-right',
 *         autoClose: 5000,
 *         components: {
 *           ToastError: CustomToastError
 *         }
 *       },
 *       // Initialization hooks
 *       initialization: {
 *         onConnectionStateChange: (isConnected, wallet, context) => {
 *           console.log('Connection changed:', isConnected, wallet);
 *         },
 *         onStoreSubscribed: (context) => {
 *           console.log('Store subscribed:', context);
 *         }
 *       },
 *       // Context value transformation
 *       contextValue: {
 *         transform: (defaultValue, context) => ({
 *           ...defaultValue,
 *           customProperty: 'custom value'
 *         })
 *       },
 *       // Custom provider tree
 *       rendering: {
 *         providerTree: (defaultTree, components, context) => (
 *           <div className="custom-provider-wrapper">
 *             {components.ErrorsProvider}
 *             {components.LabelsProvider}
 *           </div>
 *         )
 *       }
 *     },
 *     // ConnectButton customization
 *     connectButton: {
 *       classNames: {
 *         button: ({ buttonData }) =>
 *           buttonData.isConnected ? 'btn-connected' : 'btn-connect'
 *       },
 *       childComponents: {
 *         chainSelector: {
 *           classNames: {
 *             trigger: () => 'custom-chain-selector'
 *           }
 *         },
 *         connectedContent: {
 *           childCustomizations: {
 *             walletAvatar: {
 *               size: 'large',
 *               showBorder: true
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }}
 * />
 * ```
 *
 * @public
 */
export const NovaConnectButton = memo<NovaConnectButtonProps>(
  ({ store, labels, customization = {}, ...connectButtonProps }) => {
    // Extract customization options
    const {
      components = {},
      classNames = {},
      provider: providerCustomization,
      connectButton: connectButtonCustomization,
      config = {},
    } = customization;

    // Component selections with defaults
    const RootContainer = components.RootContainer || DefaultRootContainer;
    const CustomProvider = components.Provider || NovaConnectProvider;
    const CustomConnectButton = components.ConnectButton || InternalConnectButton;

    // Memoize provider data for customization context
    const providerData = useMemo<NovaConnectButtonWithProviderData>(
      () => ({
        store,
        labels,
        isConnected: false, // This will be updated by provider context
        providerState: {
          isConnectModalOpen: false,
          isConnectedModalOpen: false,
          isChainsListOpen: false,
          isChainsListOpenMobile: false,
          connectedButtonStatus: 'idle',
          isConnected: false,
          selectedAdapter: undefined,
          activeConnector: undefined,
          activeWallet: undefined,
        },
      }),
      [store, labels],
    );

    // Memoize provider props with full customization support
    const providerProps = useMemo(
      () => ({
        store,
        labels,
        customization: providerCustomization, // Full NovaConnectProviderCustomization
        ...config.providerPropsOverride,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [labels, providerCustomization, config.providerPropsOverride],
    );

    // Memoize connect button props
    const buttonProps = useMemo(
      () => ({
        store,
        customization: connectButtonCustomization,
        ...connectButtonProps,
        ...config.connectButtonPropsOverride,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [connectButtonCustomization, connectButtonProps, config.connectButtonPropsOverride],
    );

    // Render with or without root container based on configuration
    const content = (
      <CustomProvider {...providerProps}>
        <CustomConnectButton {...buttonProps} />
      </CustomProvider>
    );

    // Only wrap in root container if explicitly requested
    if (config.useRootContainer) {
      return (
        <RootContainer className={classNames.rootContainer?.({ providerData })} providerData={providerData}>
          {content}
        </RootContainer>
      );
    }

    return content;
  },
);

NovaConnectButton.displayName = 'NovaConnectButton';
