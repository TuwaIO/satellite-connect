/**
 * @file NetworkSelections component with comprehensive customization options for network selection.
 */

import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { cn, isTouchDevice } from '@tuwaio/nova-core';
import { formatWalletName, getWalletTypeFromConnectorName, OrbitAdapter, WalletType } from '@tuwaio/orbit-core';
import React, { ComponentType, forwardRef, memo, useCallback, useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { getNetworkIcon, networksLinks } from '../../utils';
import { ConnectCard, ConnectCardCustomization } from './ConnectCard';
import { GroupedConnector } from './ConnectModal';
import { Disclaimer, DisclaimerCustomization } from './Disclaimer';

// --- Types ---

/**
 * Network data for display
 */
interface NetworkData {
  /** Network adapter */
  adapter: OrbitAdapter;
  /** Chain ID for icon display */
  chainId?: number | string;
  /** Network display name */
  name: string;
  /** Network info link URL */
  infoLink?: string;
  /** Network index in list */
  index: number;
}

/**
 * Network selections data for customization context
 */
export interface NetworkSelectionsData {
  /** Currently active connector name */
  activeConnector?: string;
  /** Available grouped connectors */
  connectors: GroupedConnector[];
  /** Whether device is touch-enabled */
  isTouch: boolean;
  /** Whether in error state */
  isError: boolean;
  /** Available networks */
  networks: NetworkData[];
}

// --- Component Props Types ---
type ContainerProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-labelledby'?: string;
  selectionsData: NetworkSelectionsData;
} & React.RefAttributes<HTMLDivElement>;

type TitleProps = {
  className?: string;
  children: React.ReactNode;
  id?: string;
  role?: string;
  'aria-level'?: number;
  selectionsData: NetworkSelectionsData;
} & React.RefAttributes<HTMLHeadingElement>;

type NetworkListProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
  selectionsData: NetworkSelectionsData;
} & React.RefAttributes<HTMLDivElement>;

type NetworkItemProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  networkData: NetworkData;
  selectionsData: NetworkSelectionsData;
} & React.RefAttributes<HTMLDivElement>;

type NetworkIconProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
  networkData: NetworkData;
  selectionsData: NetworkSelectionsData;
} & React.RefAttributes<HTMLDivElement>;

type ErrorContainerProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-live'?: 'polite' | 'assertive';
  selectionsData: NetworkSelectionsData;
} & React.RefAttributes<HTMLDivElement>;

type ErrorIconProps = {
  className?: string;
  children: React.ReactNode;
  'aria-hidden'?: boolean;
  selectionsData: NetworkSelectionsData;
} & React.RefAttributes<HTMLDivElement>;

type ErrorTitleProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-level'?: number;
  selectionsData: NetworkSelectionsData;
} & React.RefAttributes<HTMLHeadingElement>;

type ErrorMessageProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  selectionsData: NetworkSelectionsData;
} & React.RefAttributes<HTMLParagraphElement>;

/**
 * NetworkSelections customization options
 */
export type NetworkSelectionsCustomization = {
  /** Custom components */
  components?: {
    /** Custom container wrapper */
    Container?: ComponentType<ContainerProps>;
    /** Custom title */
    Title?: ComponentType<TitleProps>;
    /** Custom network list */
    NetworkList?: ComponentType<NetworkListProps>;
    /** Custom network item wrapper */
    NetworkItem?: ComponentType<NetworkItemProps>;
    /** Custom network icon wrapper */
    NetworkIcon?: ComponentType<NetworkIconProps>;
    /** Custom error container */
    ErrorContainer?: ComponentType<ErrorContainerProps>;
    /** Custom error icon wrapper */
    ErrorIcon?: ComponentType<ErrorIconProps>;
    /** Custom error title */
    ErrorTitle?: ComponentType<ErrorTitleProps>;
    /** Custom error message */
    ErrorMessage?: ComponentType<ErrorMessageProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { selectionsData: NetworkSelectionsData }) => string;
    /** Function to generate title classes */
    title?: (params: { selectionsData: NetworkSelectionsData }) => string;
    /** Function to generate network list classes */
    networkList?: (params: { selectionsData: NetworkSelectionsData }) => string;
    /** Function to generate network item classes */
    networkItem?: (params: { networkData: NetworkData; selectionsData: NetworkSelectionsData }) => string;
    /** Function to generate network icon classes */
    networkIcon?: (params: { networkData: NetworkData; selectionsData: NetworkSelectionsData }) => string;
    /** Function to generate error container classes */
    errorContainer?: (params: { selectionsData: NetworkSelectionsData }) => string;
    /** Function to generate error icon classes */
    errorIcon?: (params: { selectionsData: NetworkSelectionsData }) => string;
    /** Function to generate error title classes */
    errorTitle?: (params: { selectionsData: NetworkSelectionsData }) => string;
    /** Function to generate error message classes */
    errorMessage?: (params: { selectionsData: NetworkSelectionsData }) => string;
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom network click handler */
    onNetworkClick?: (
      networkData: NetworkData,
      selectionsData: NetworkSelectionsData,
      originalHandler: (network: OrbitAdapter) => void,
    ) => void;
    /** Custom error retry handler */
    onErrorRetry?: (selectionsData: NetworkSelectionsData) => void;
  };
  /** Configuration options */
  config?: {
    /** Custom ARIA labels */
    ariaLabels?: {
      container?: (selectionsData: NetworkSelectionsData) => string;
      networkList?: (selectionsData: NetworkSelectionsData) => string;
      networkIcon?: (networkData: NetworkData) => string;
      errorContainer?: (selectionsData: NetworkSelectionsData) => string;
    };
    /** Custom scroll behavior */
    scroll?: {
      touchMaxHeight?: string;
      mouseMaxHeight?: string;
      gap?: {
        touch?: string;
        mouse?: string;
      };
    };
  };
  /** ConnectCard customization for network cards */
  connectCard?: ConnectCardCustomization;
  /** Disclaimer customization */
  disclaimer?: DisclaimerCustomization;
};

/**
 * Props for the NetworkSelections component
 */
interface NetworkSelectionsProps {
  /** Name of the currently active wallet connector */
  activeConnector: string | undefined;
  /** Array of grouped wallet connectors with their supported networks */
  connectors: GroupedConnector[];
  /** Click handler for network selection */
  onClick: (adapter: OrbitAdapter, walletType: WalletType) => Promise<void>;
  /** Customization options */
  customization?: NetworkSelectionsCustomization;
}

// --- Default Sub-Components ---
const DefaultContainer = forwardRef<HTMLDivElement, ContainerProps>(
  // eslint-disable-next-line
  ({ children, className, selectionsData, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
);
DefaultContainer.displayName = 'DefaultContainer';

const DefaultTitle = forwardRef<HTMLHeadingElement, TitleProps>(
  // eslint-disable-next-line
  ({ children, className, selectionsData, ...props }, ref) => (
    <h2 ref={ref} className={className} {...props}>
      {children}
    </h2>
  ),
);
DefaultTitle.displayName = 'DefaultTitle';

const DefaultNetworkList = forwardRef<HTMLDivElement, NetworkListProps>(
  // eslint-disable-next-line
  ({ children, className, selectionsData, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
);
DefaultNetworkList.displayName = 'DefaultNetworkList';

const DefaultNetworkItem = forwardRef<HTMLDivElement, NetworkItemProps>(
  // eslint-disable-next-line
  ({ children, className, networkData, selectionsData, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
);
DefaultNetworkItem.displayName = 'DefaultNetworkItem';

const DefaultNetworkIcon = forwardRef<HTMLDivElement, NetworkIconProps>(
  // eslint-disable-next-line
  ({ children, className, networkData, selectionsData, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
);
DefaultNetworkIcon.displayName = 'DefaultNetworkIcon';

const DefaultErrorContainer = forwardRef<HTMLDivElement, ErrorContainerProps>(
  // eslint-disable-next-line
  ({ children, className, selectionsData, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
);
DefaultErrorContainer.displayName = 'DefaultErrorContainer';

const DefaultErrorIcon = forwardRef<HTMLDivElement, ErrorIconProps>(
  // eslint-disable-next-line
  ({ children, className, selectionsData, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  ),
);
DefaultErrorIcon.displayName = 'DefaultErrorIcon';

const DefaultErrorTitle = forwardRef<HTMLHeadingElement, ErrorTitleProps>(
  // eslint-disable-next-line
  ({ children, className, selectionsData, ...props }, ref) => (
    <h2 ref={ref} className={className} {...props}>
      {children}
    </h2>
  ),
);
DefaultErrorTitle.displayName = 'DefaultErrorTitle';

const DefaultErrorMessage = forwardRef<HTMLParagraphElement, ErrorMessageProps>(
  // eslint-disable-next-line
  ({ children, className, selectionsData, ...props }, ref) => (
    <p ref={ref} className={className} {...props}>
      {children}
    </p>
  ),
);
DefaultErrorMessage.displayName = 'DefaultErrorMessage';

/**
 * NetworkSelections component - Network/blockchain selection interface for multi-network wallets with full customization
 *
 * This component provides a network selection interface when a wallet supports multiple blockchains:
 * - Visual network cards with blockchain icons and names
 * - Responsive layout adapting to touch/mouse interfaces
 * - Error handling for invalid connector states
 * - Educational content about blockchain networks
 * - Full accessibility support with semantic structure
 * - External documentation links for each network
 * - Complete customization of all child components and styling
 *
 * Use cases:
 * - Multi-network wallets (e.g., MetaMask supporting EVM chains)
 * - Cross-chain wallets supporting both EVM and Solana
 * - Network-specific connection requirements
 * - User education about blockchain differences
 *
 * Layout features:
 * - Touch devices: Horizontal scrolling layout for easy mobile navigation
 * - Mouse devices: Vertical layout with fixed height scrolling
 * - Network icons with Web3Icon integration for consistency
 * - External links for additional network information
 *
 * Error handling:
 * - Graceful fallback when active connector is not found
 * - Clear error messaging with actionable guidance
 * - Visual error indicators with warning icons
 * - Accessible error state announcements
 *
 * Accessibility features:
 * - Semantic heading structure for network selection
 * - Proper ARIA labels for error states and selections
 * - Screen reader friendly network descriptions
 * - Keyboard navigation support for all interactive elements
 * - Error announcements with live regions
 *
 * @example Basic usage
 * ```tsx
 * <NetworkSelections
 *   activeConnector="metamask"
 *   connectors={multiNetworkConnectors}
 *   onClick={async (adapter, walletType) => {
 *     await connectToNetwork(adapter, walletType);
 *   }}
 * />
 * ```
 *
 * @example With customization
 * ```tsx
 * <NetworkSelections
 *   activeConnector="phantom"
 *   connectors={crossChainConnectors}
 *   onClick={(adapter, type) => handleNetworkConnection(adapter, type)}
 *   customization={{
 *     components: {
 *       Container: CustomNetworkContainer,
 *       NetworkIcon: CustomNetworkIcon
 *     },
 *     classNames: {
 *       networkList: ({ selectionsData }) =>
 *         selectionsData.isTouch ? 'touch-network-list' : 'desktop-network-list'
 *     },
 *     handlers: {
 *       onNetworkClick: (networkData, selectionsData, originalHandler) => {
 *         analytics.track('network_selected', { network: networkData.name });
 *         originalHandler(networkData.adapter);
 *       }
 *     }
 *   }}
 * />
 * ```
 */
export const NetworkSelections = memo(
  forwardRef<HTMLDivElement, NetworkSelectionsProps>(({ connectors, onClick, activeConnector, customization }, ref) => {
    const labels = useNovaConnectLabels();

    // Extract customization options
    const {
      Container: CustomContainer = DefaultContainer,
      Title: CustomTitle = DefaultTitle,
      NetworkList: CustomNetworkList = DefaultNetworkList,
      NetworkItem: CustomNetworkItem = DefaultNetworkItem,
      NetworkIcon: CustomNetworkIcon = DefaultNetworkIcon,
      ErrorContainer: CustomErrorContainer = DefaultErrorContainer,
      ErrorIcon: CustomErrorIcon = DefaultErrorIcon,
      ErrorTitle: CustomErrorTitle = DefaultErrorTitle,
      ErrorMessage: CustomErrorMessage = DefaultErrorMessage,
    } = customization?.components ?? {};

    const customHandlers = customization?.handlers;
    const customConfig = customization?.config;

    /**
     * Memoized touch device detection
     */
    const isTouch = useMemo(() => isTouchDevice(), []);

    /**
     * Memoized active connector configuration
     */
    const activeConnectors = useMemo(
      () => connectors.find((connector) => formatWalletName(connector.name) === activeConnector),
      [connectors, activeConnector],
    );

    /**
     * Memoized network data
     */
    const networks = useMemo((): NetworkData[] => {
      if (!activeConnectors?.adapters) return [];

      return activeConnectors.adapters.map((adapter, index) => {
        const networkInfo = getNetworkIcon(adapter);
        return {
          adapter,
          chainId: networkInfo?.chainId,
          name: networkInfo?.name ?? 'Ethereum',
          infoLink: networksLinks[adapter]?.aboutNetwork,
          index,
        };
      });
    }, [activeConnectors?.adapters]);

    /**
     * Memoized selections data
     */
    const selectionsData = useMemo(
      (): NetworkSelectionsData => ({
        activeConnector,
        connectors,
        isTouch,
        isError: !activeConnectors,
        networks,
      }),

      [activeConnector, connectors, isTouch, activeConnectors, networks],
    );

    /**
     * Memoized CSS classes
     */
    const cssClasses = useMemo(() => {
      const touchListClasses = [
        'novacon:flex-row',
        'novacon:overflow-x-auto',
        'novacon:max-h-none',
        customConfig?.scroll?.gap?.touch ?? 'novacon:gap-3',
        'novacon:pb-4',
        'novacon:px-1',
      ];

      const mouseListClasses = [
        'novacon:flex-col',
        customConfig?.scroll?.mouseMaxHeight ?? 'novacon:max-h-[310px]',
        'novacon:overflow-y-auto',
        customConfig?.scroll?.gap?.mouse ?? 'novacon:gap-2',
      ];

      return {
        touchListClasses,
        mouseListClasses,
      };
    }, [customConfig?.scroll]);

    /**
     * Handle network selection click
     */
    const handleNetworkClick = useCallback(
      (network: OrbitAdapter) => {
        const networkData = networks.find((n) => n.adapter === network);
        if (!networkData || !activeConnector) return;

        const originalHandler = (selectedNetwork: OrbitAdapter) => {
          onClick(
            selectedNetwork,
            getWalletTypeFromConnectorName(selectedNetwork, formatWalletName(activeConnector)) as WalletType,
          );
        };

        if (customHandlers?.onNetworkClick) {
          customHandlers.onNetworkClick(networkData, selectionsData, originalHandler);
        } else {
          originalHandler(network);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [networks, activeConnector, onClick, customHandlers?.onNetworkClick, selectionsData],
    );

    // Error state when active connector is not found
    if (!activeConnectors) {
      return (
        <CustomErrorContainer
          ref={ref}
          className={
            customization?.classNames?.errorContainer?.({ selectionsData }) ??
            'novacon:flex novacon:flex-col novacon:items-center novacon:justify-center novacon:p-8 novacon:text-center novacon:border novacon:border-[var(--tuwa-border-primary)] novacon:rounded-xl novacon:bg-[var(--tuwa-bg-secondary)] novacon:text-[var(--tuwa-text-secondary)]'
          }
          role="alert"
          aria-live="assertive"
          selectionsData={selectionsData}
        >
          <CustomErrorIcon
            className={
              customization?.classNames?.errorIcon?.({ selectionsData }) ??
              'novacon:text-[var(--tuwa-text-accent)] novacon:mb-3'
            }
            aria-hidden={true}
            selectionsData={selectionsData}
          >
            <ExclamationTriangleIcon width={32} height={32} />
          </CustomErrorIcon>
          <CustomErrorTitle
            className={
              customization?.classNames?.errorTitle?.({ selectionsData }) ??
              'novacon:text-lg novacon:font-semibold novacon:text-[var(--tuwa-text-primary)] novacon:mb-1'
            }
            role="heading"
            aria-level={2}
            selectionsData={selectionsData}
          >
            {labels.somethingWentWrong}
          </CustomErrorTitle>
          <CustomErrorMessage
            className={customization?.classNames?.errorMessage?.({ selectionsData }) ?? 'novacon:text-sm'}
            role="text"
            selectionsData={selectionsData}
          >
            {labels.networkPickingError}
          </CustomErrorMessage>
        </CustomErrorContainer>
      );
    }

    return (
      <CustomContainer
        ref={ref}
        className={
          customization?.classNames?.container?.({ selectionsData }) ??
          'novacon:flex novacon:flex-col novacon:gap-4 novacon:text-[var(--tuwa-text-primary)]'
        }
        role="region"
        aria-labelledby="network-selection-title"
        selectionsData={selectionsData}
      >
        <CustomTitle
          id="network-selection-title"
          className={customization?.classNames?.title?.({ selectionsData })}
          role="heading"
          aria-level={2}
          selectionsData={selectionsData}
        >
          {labels.selectAvailableNetwork}
        </CustomTitle>

        <CustomNetworkList
          className={
            customization?.classNames?.networkList?.({ selectionsData }) ??
            cn('novacon:flex NovaCustomScroll', isTouch ? cssClasses.touchListClasses : cssClasses.mouseListClasses)
          }
          role="list"
          aria-label={customConfig?.ariaLabels?.networkList?.(selectionsData) ?? 'Available networks'}
          selectionsData={selectionsData}
        >
          {networks.map((networkData) => (
            <CustomNetworkItem
              key={networkData.adapter}
              className={
                customization?.classNames?.networkItem?.({ networkData, selectionsData }) ??
                cn({ 'novacon:flex-shrink-0': isTouch })
              }
              role="listitem"
              networkData={networkData}
              selectionsData={selectionsData}
            >
              <ConnectCard
                icon={
                  <CustomNetworkIcon
                    className={
                      customization?.classNames?.networkIcon?.({ networkData, selectionsData }) ??
                      'novacon:w-8 novacon:h-8'
                    }
                    role="img"
                    aria-label={
                      customConfig?.ariaLabels?.networkIcon?.(networkData) ?? `${networkData.name} network icon`
                    }
                    networkData={networkData}
                    selectionsData={selectionsData}
                  >
                    <Web3Icon chainId={networkData.chainId} />
                  </CustomNetworkIcon>
                }
                onClick={() => handleNetworkClick(networkData.adapter)}
                title={networkData.name}
                infoLink={networkData.infoLink}
                customization={customization?.connectCard}
              />
            </CustomNetworkItem>
          ))}
        </CustomNetworkList>

        <Disclaimer
          title={labels.whatIsNetwork}
          description={labels.networkDescription}
          learnMoreAction="https://academy.binance.com/en/articles/what-is-blockchain-and-how-does-it-work"
          listAction="https://www.alchemy.com/dapps/top/blockchains"
          customization={customization?.disclaimer}
        />
      </CustomContainer>
    );
  }),
);

NetworkSelections.displayName = 'NetworkSelections';
