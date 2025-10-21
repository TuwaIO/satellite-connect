import { InformationCircleIcon } from '@heroicons/react/24/outline';
import {
  CloseIcon,
  cn,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  standardButtonClasses,
} from '@tuwaio/nova-core';
import {
  delay,
  formatWalletName,
  getWalletTypeFromConnectorName,
  impersonatedHelpers,
  OrbitAdapter,
  waitFor,
  WalletType,
} from '@tuwaio/orbit-core';
import { motion } from 'framer-motion';
import { isAddress } from 'gill';
import React, {
  ComponentPropsWithoutRef,
  ComponentType,
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useMemo,
} from 'react';

import { ConnectContentType, useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { Connector, InitialChains } from '../../types';
import { getConnectChainId, getFilteredConnectors, networksLinks } from '../../utils';
import { ConnectButtonProps } from '../ConnectButton/ConnectButton';
import { AboutWallets, AboutWalletsCustomization } from './AboutWallets';
import { Connecting, ConnectingCustomization } from './Connecting';
import { ConnectorsSelections, ConnectorsSelectionsCustomization } from './ConnectorsSelections';
import { GetWallet, GetWalletCustomization } from './GetWallet';
import { ImpersonateForm, ImpersonateFormCustomization } from './ImpersonatedForm';
import { NetworkSelections, NetworkSelectionsCustomization } from './NetworkSelections';
import { NetworkTabs, NetworkTabsCustomization } from './NetworkTabs';

/**
 * Interface for grouped wallet connectors
 */
export interface GroupedConnector {
  /** Name of the wallet connector */
  name: string;
  /** Optional icon for the wallet */
  icon?: string;
  /** Array of supported network adapters */
  adapters: OrbitAdapter[];
  /** Array of connectors with their associated adapters */
  connectors: (Connector & { adapter: OrbitAdapter })[];
}

/**
 * Connect modal data for customization context
 */
export interface ConnectModalData {
  /** Current content type being displayed */
  contentType: ConnectContentType;
  /** Selected network adapter */
  selectedAdapter: OrbitAdapter | undefined;
  /** Active connector name */
  activeConnector: string | undefined;
  /** Impersonated address */
  impersonatedAddress: string;
  /** Whether connection is established */
  isConnected: boolean;
  /** Whether modal is open */
  isOpen: boolean;
  /** Connection error if any */
  error: Error | string | null | undefined;
  /** Available connectors */
  connectors: Record<string, Connector[]>;
  /** Filtered connectors for current adapter */
  filteredConnectors: GroupedConnector[];
  /** Current labels from i18n */
  labels: ReturnType<typeof useNovaConnectLabels>;
}

/**
 * Bottom button configuration
 */
export interface BottomButtonConfig {
  /** Button title text */
  title: string;
  /** Button click handler */
  onClick: () => void | Promise<void>;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Loading state */
  loading?: boolean;
}

// --- Component Props Types ---
type ModalContainerProps = {
  className?: string;
  children: React.ReactNode;
  modalData: ConnectModalData;
} & React.RefAttributes<HTMLDivElement>;

type ModalHeaderProps = {
  className?: string;
  children: React.ReactNode;
  modalData: ConnectModalData;
} & React.RefAttributes<HTMLDivElement>;

type InfoButtonProps = {
  className?: string;
  onClick: () => void;
  'aria-label'?: string;
  modalData: ConnectModalData;
} & React.RefAttributes<HTMLButtonElement>;

type TitleProps = {
  className?: string;
  children: React.ReactNode;
  modalData: ConnectModalData;
} & React.RefAttributes<HTMLDivElement>;

type CloseButtonProps = {
  className?: string;
  onClick: () => void;
  'aria-label'?: string;
  modalData: ConnectModalData;
} & React.RefAttributes<HTMLButtonElement>;

type MainContentProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  id?: string;
  modalData: ConnectModalData;
} & React.RefAttributes<HTMLDivElement>;

type FooterProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  modalData: ConnectModalData;
} & React.RefAttributes<HTMLDivElement>;

type BackButtonProps = {
  className?: string;
  onClick: () => void;
  'aria-label'?: string;
  children: React.ReactNode;
  modalData: ConnectModalData;
} & React.RefAttributes<HTMLButtonElement>;

type ActionButtonProps = {
  className?: string;
  onClick: () => void | Promise<void>;
  'aria-describedby'?: string;
  children: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  modalData: ConnectModalData;
  buttonConfig: BottomButtonConfig;
} & React.RefAttributes<HTMLButtonElement>;

type ActionDescriptionProps = {
  id?: string;
  className?: string;
  children: React.ReactNode;
  modalData: ConnectModalData;
} & React.RefAttributes<HTMLSpanElement>;

type ModalEmptyProps = {
  className?: string;
  children: React.ReactNode;
  modalData: ConnectModalData;
} & React.RefAttributes<HTMLDivElement>;

/**
 * Customization options for ConnectModal component
 */
export type ConnectModalCustomization = {
  /** Custom components */
  components?: {
    /** Custom modal container */
    ModalContainer?: ComponentType<ModalContainerProps>;
    /** Custom modal header */
    ModalHeader?: ComponentType<ModalHeaderProps>;
    /** Custom info button */
    InfoButton?: ComponentType<InfoButtonProps>;
    /** Custom title */
    Title?: ComponentType<TitleProps>;
    /** Custom close button */
    CloseButton?: ComponentType<CloseButtonProps>;
    /** Custom main content wrapper */
    MainContent?: ComponentType<MainContentProps>;
    /** Custom footer */
    Footer?: ComponentType<FooterProps>;
    /** Custom back button */
    BackButton?: ComponentType<BackButtonProps>;
    /** Custom action button */
    ActionButton?: ComponentType<ActionButtonProps>;
    /** Custom action description */
    ActionDescription?: ComponentType<ActionDescriptionProps>;
    /** Custom dialog */
    Dialog?: ComponentType<ComponentPropsWithoutRef<typeof Dialog>>;
    /** Custom dialog content */
    DialogContent?: ComponentType<ComponentPropsWithoutRef<typeof DialogContent>>;
    /** Custom motion wrapper */
    MotionDiv?: ComponentType<ComponentPropsWithoutRef<typeof motion.div>>;
    /** Custom empty state */
    EmptyState?: ComponentType<ModalEmptyProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate modal container classes */
    modalContainer?: (params: { modalData: ConnectModalData }) => string;
    /** Function to generate header classes */
    header?: (params: { modalData: ConnectModalData }) => string;
    /** Function to generate info button classes */
    infoButton?: (params: { modalData: ConnectModalData }) => string;
    /** Function to generate title classes */
    title?: (params: { modalData: ConnectModalData }) => string;
    /** Function to generate close button classes */
    closeButton?: (params: { modalData: ConnectModalData }) => string;
    /** Function to generate main content classes */
    mainContent?: (params: { modalData: ConnectModalData }) => string;
    /** Function to generate footer classes */
    footer?: (params: { modalData: ConnectModalData }) => string;
    /** Function to generate back button classes */
    backButton?: (params: { modalData: ConnectModalData }) => string;
    /** Function to generate action button classes */
    actionButton?: (params: { modalData: ConnectModalData; buttonConfig: BottomButtonConfig }) => string;
    /** Function to generate action description classes */
    actionDescription?: (params: { modalData: ConnectModalData }) => string;
    /** Function to generate action description classes */
    emptyConnectors?: (params: { modalData: ConnectModalData }) => string;
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom modal open/close handler */
    onOpenChange?: (open: boolean, modalData: ConnectModalData) => void;
    /** Custom back navigation handler */
    onBack?: (modalData: ConnectModalData, originalHandler: () => void) => void;
    /** Custom info button click handler */
    onInfoClick?: (modalData: ConnectModalData) => void;
    /** Custom action button handlers for different content types */
    onActionClick?: {
      connectors?: (modalData: ConnectModalData) => void;
      getWallet?: (modalData: ConnectModalData) => void;
      about?: (modalData: ConnectModalData) => void;
      impersonate?: (modalData: ConnectModalData) => Promise<void>;
      connecting?: (modalData: ConnectModalData) => Promise<void>;
    };
  };
  /** Configuration options */
  config?: {
    /** Custom ARIA labels */
    ariaLabels?: {
      modal?: (modalData: ConnectModalData) => string;
      infoButton?: (modalData: ConnectModalData) => string;
      closeButton?: (modalData: ConnectModalData) => string;
      backButton?: (modalData: ConnectModalData) => string;
      mainContent?: (modalData: ConnectModalData) => string;
    };
    /** Animation configuration */
    animation?: {
      /** Layout transition duration */
      layoutDuration?: number;
      /** Disable animations */
      disabled?: boolean;
    };
  };
  /** Child component customizations */
  childComponents?: {
    /** AboutWallets customization */
    aboutWallets?: AboutWalletsCustomization;
    /** Connecting customization */
    connecting?: ConnectingCustomization;
    /** ConnectorsSelections customization */
    connectorsSelections?: ConnectorsSelectionsCustomization;
    /** GetWallet customization */
    getWallet?: GetWalletCustomization;
    /** ImpersonateForm customization */
    impersonateForm?: ImpersonateFormCustomization;
    /** NetworkSelections customization */
    networkSelections?: NetworkSelectionsCustomization;
    /** NetworkTabs customization */
    networkTabs?: NetworkTabsCustomization;
  };
};

/**
 * Helper function to safely get connector name from array
 */
function getConnectorName(
  connectors: Connector[] | undefined,
  activeConnector: string | undefined,
): string | undefined {
  if (!connectors || !Array.isArray(connectors) || !activeConnector) {
    return undefined;
  }

  const connector = connectors.find((c) => {
    // @ts-expect-error - no types for connector on package level
    if (c && typeof c === 'object' && 'name' in c && typeof c.name === 'string') {
      // @ts-expect-error - no types for connector on package level
      return formatWalletName(c.name) === activeConnector;
    }
    return false;
  });
  // @ts-expect-error - no types for connector on package level
  return connector && typeof connector === 'object' && 'name' in connector && typeof connector.name === 'string'
    ? // @ts-expect-error - no types for connector on package level
      connector.name
    : undefined;
}

// --- Default Sub-Components ---
const DefaultModalContainer = forwardRef<HTMLDivElement, ModalContainerProps>(
  // eslint-disable-next-line
  ({ className, children, modalData, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('novacon:relative novacon:flex novacon:w-full novacon:flex-col', className)}
      {...props}
    >
      {children}
    </div>
  ),
);
DefaultModalContainer.displayName = 'DefaultModalContainer';

const DefaultModalHeader = forwardRef<HTMLDivElement, ModalHeaderProps>(
  // eslint-disable-next-line
  ({ className, children, modalData, ...props }, ref) => (
    <div ref={ref} className={className} {...props}>
      <DialogHeader>{children}</DialogHeader>
    </div>
  ),
);
DefaultModalHeader.displayName = 'DefaultModalHeader';

const DefaultInfoButton = forwardRef<HTMLButtonElement, InfoButtonProps>(
  // eslint-disable-next-line
  ({ className, onClick, modalData, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        'novacon:cursor-pointer novacon:text-[var(--tuwa-text-secondary)] novacon:transition novacon:duration-300 novacon:ease-in-out novacon:active:scale-75 novacon:hover:scale-110',
        className,
      )}
      type="button"
      onClick={onClick}
      {...props}
    >
      <InformationCircleIcon width={20} height={20} className="novacon:mr-1" aria-hidden="true" />
    </button>
  ),
);
DefaultInfoButton.displayName = 'DefaultInfoButton';

const DefaultTitle = forwardRef<HTMLDivElement, TitleProps>(
  // eslint-disable-next-line
  ({ className, children, modalData, ...props }, ref) => (
    <DialogTitle ref={ref} className={cn('novacon:flex novacon:items-center', className)} {...props}>
      {children}
    </DialogTitle>
  ),
);
DefaultTitle.displayName = 'DefaultTitle';

const DefaultCloseButton = forwardRef<HTMLButtonElement, CloseButtonProps>(
  // eslint-disable-next-line
  ({ className, onClick, modalData, ...props }, ref) => (
    <DialogClose asChild>
      <button
        ref={ref}
        type="button"
        onClick={onClick}
        className={cn(
          'novacon:cursor-pointer novacon:rounded-full novacon:p-1 novacon:text-[var(--tuwa-text-tertiary)] novacon:transition-colors novacon:hover:bg-[var(--tuwa-bg-muted)] novacon:hover:text-[var(--tuwa-text-primary)]',
          className,
        )}
        {...props}
      >
        <CloseIcon aria-hidden="true" />
      </button>
    </DialogClose>
  ),
);
DefaultCloseButton.displayName = 'DefaultCloseButton';

const DefaultMainContent = forwardRef<HTMLDivElement, MainContentProps>(
  // eslint-disable-next-line
  ({ className, children, modalData, ...props }, ref) => (
    <main
      ref={ref}
      className={cn('novacon:flex novacon:flex-col novacon:gap-4 novacon:p-4', className)}
      id="connect-modal-content"
      role="main"
      {...props}
    >
      {children}
    </main>
  ),
);
DefaultMainContent.displayName = 'DefaultMainContent';

const DefaultFooter = forwardRef<HTMLDivElement, FooterProps>(
  // eslint-disable-next-line
  ({ className, children, modalData, ...props }, ref) => (
    <footer
      ref={ref}
      className={cn(
        'novacon:flex novacon:w-full novacon:items-center novacon:justify-between novacon:border-t novacon:border-[var(--tuwa-border-primary)] novacon:p-4',
        className,
      )}
      role="contentinfo"
      {...props}
    >
      {children}
    </footer>
  ),
);
DefaultFooter.displayName = 'DefaultFooter';

const DefaultBackButton = forwardRef<HTMLButtonElement, BackButtonProps>(
  // eslint-disable-next-line
  ({ className, onClick, children, modalData, ...props }, ref) => (
    <button ref={ref} type="button" onClick={onClick} className={cn(standardButtonClasses, className)} {...props}>
      {children}
    </button>
  ),
);
DefaultBackButton.displayName = 'DefaultBackButton';

const DefaultActionButton = forwardRef<HTMLButtonElement, ActionButtonProps>(
  // eslint-disable-next-line
  ({ className, onClick, children, disabled, loading, buttonConfig, modalData, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(standardButtonClasses, className)}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </button>
  ),
);
DefaultActionButton.displayName = 'DefaultActionButton';

const DefaultActionDescription = forwardRef<HTMLSpanElement, ActionDescriptionProps>(
  // eslint-disable-next-line
  ({ className, children, modalData, ...props }, ref) => (
    <span ref={ref} className={cn('novacon:sr-only', className)} {...props}>
      {children}
    </span>
  ),
);
DefaultActionDescription.displayName = 'DefaultActionDescription';

const DefaultEmptyState = forwardRef<HTMLDivElement, ModalEmptyProps>(({ children, className, ...props }, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { modalData: _modalData, ...restProps } = props;
  return (
    <div ref={ref} className={className} {...restProps}>
      {children}
    </div>
  );
});
DefaultEmptyState.displayName = 'DefaultEmptyState';

/**
 * Props for the ConnectModal component
 */
export interface ConnectModalProps extends InitialChains, Pick<ConnectButtonProps, 'store' | 'withImpersonated'> {
  /** Customization options */
  customization?: ConnectModalCustomization;
}

/**
 * ConnectModal component - Main modal dialog for wallet connection workflow
 *
 * This component provides a comprehensive wallet connection interface with:
 * - Multi-step connection flow with different content types
 * - Network selection and adapter filtering
 * - Support for regular wallets and impersonated wallets
 * - Educational content about wallets and networks
 * - Error handling and retry mechanisms
 * - Full accessibility support with ARIA labels
 * - Keyboard navigation and screen reader compatibility
 *
 * Modal content types:
 * - 'connectors': Main wallet selection screen with network tabs
 * - 'network': Network selection for multi-network wallets
 * - 'connecting': Connection progress and status display
 * - 'about': Educational content about wallets
 * - 'getWallet': Onboarding flow for users without wallets
 * - 'impersonate': Form for wallet address impersonation
 *
 * Visual features:
 * - Responsive design adapting to different screen sizes
 * - Smooth transitions between different content states
 * - Loading states and progress indicators
 * - Clear navigation with back/forward buttons
 * - Contextual action buttons in footer
 *
 * Accessibility features:
 * - Proper ARIA labels and roles for screen readers
 * - Keyboard navigation support with focus management
 * - Semantic HTML structure for better navigation
 * - Screen reader announcements for state changes
 * - High contrast compatible styling
 *
 * @param appChains - Configuration for supported blockchain networks
 * @param solanaRPCUrls - RPC URLs configuration for Solana network
 * @param store - Wallet store instance
 * @param withImpersonated - Whether to show impersonated wallet option
 * @param customization - Customization options for the component
 * @returns JSX element representing the connection modal dialog
 *
 * @example
 * ```tsx
 * <ConnectModal
 *   appChains={{
 *     [OrbitAdapter.EVM]: [1, 137, 56], // Ethereum, Polygon, BSC
 *     [OrbitAdapter.SOLANA]: ['devnet', 'mainnet-beta']
 *   }}
 *   solanaRPCUrls={{
 *     'mainnet-beta': 'https://api.mainnet-beta.solana.com',
 *     'devnet': 'https://api.devnet.solana.com'
 *   }}
 *   store={walletStore}
 *   withImpersonated
 *   customization={{
 *     classNames: {
 *       title: ({ modalData }) =>
 *         modalData.contentType === 'about' ? 'custom-about-title' : ''
 *     }
 *   }}
 * />
 * ```
 *
 * @public
 */
export const ConnectModal = memo<ConnectModalProps>(
  ({ appChains, solanaRPCUrls, store, withImpersonated, customization = {} }) => {
    const {
      isConnectModalOpen,
      setIsConnectModalOpen,
      setConnectModalContentType,
      setActiveConnector,
      setImpersonatedAddress,
      setIsConnected,
      connectModalContentType,
      selectedAdapter,
      setSelectedAdapter,
      isConnected,
      activeConnector,
      impersonatedAddress,
      walletConnectionError,
    } = useNovaConnect();

    // Memoize store methods to prevent unnecessary re-renders
    const storeGetters = useMemo(
      () => ({
        getConnectors: store.getState().getConnectors,
        connect: store.getState().connect,
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    const labels = useNovaConnectLabels();

    // Memoize connectors to avoid recalculation on every render
    const connectors = useMemo(() => {
      if (isConnectModalOpen) {
        return storeGetters.getConnectors();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnectModalOpen]);

    const filteredConnectors = useMemo(
      () => getFilteredConnectors({ connectors: connectors!, selectedAdapter }),
      [connectors, selectedAdapter],
    );

    // Convert error to Error object if it's a string
    const normalizedError = useMemo(() => {
      if (!walletConnectionError) return null;
      if (typeof walletConnectionError === 'string') {
        return new Error(walletConnectionError);
      }
      return walletConnectionError;
    }, [walletConnectionError]);

    // Memoize modal data for customization context
    const modalData = useMemo<ConnectModalData>(
      () => ({
        contentType: connectModalContentType,
        selectedAdapter,
        activeConnector,
        impersonatedAddress,
        isConnected,
        isOpen: isConnectModalOpen,
        error: normalizedError,
        connectors: connectors!,
        filteredConnectors,
        labels,
      }),
      [
        connectModalContentType,
        selectedAdapter,
        activeConnector,
        impersonatedAddress,
        isConnected,
        isConnectModalOpen,
        normalizedError,
        connectors,
        filteredConnectors,
        labels,
      ],
    );

    // Reset modal state when opened
    useEffect(() => {
      if (isConnectModalOpen) {
        setConnectModalContentType('connectors');
        setSelectedAdapter(undefined);
        setActiveConnector(undefined);
        setImpersonatedAddress('');
        setIsConnected(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConnectModalOpen]);

    // Extract customization options
    const { components = {}, classNames = {}, handlers = {}, config = {}, childComponents = {} } = customization;

    // Component selections with defaults
    const ModalContainer = components.ModalContainer || DefaultModalContainer;
    const ModalHeader = components.ModalHeader || DefaultModalHeader;
    const InfoButton = components.InfoButton || DefaultInfoButton;
    const Title = components.Title || DefaultTitle;
    const CloseButton = components.CloseButton || DefaultCloseButton;
    const MainContent = components.MainContent || DefaultMainContent;
    const Footer = components.Footer || DefaultFooter;
    const BackButton = components.BackButton || DefaultBackButton;
    const ActionButton = components.ActionButton || DefaultActionButton;
    const ActionDescription = components.ActionDescription || DefaultActionDescription;
    const CustomEmptyState = components.EmptyState || DefaultEmptyState;
    const CustomDialog = components.Dialog || Dialog;
    const CustomDialogContent = components.DialogContent || DialogContent;
    const CustomMotionDiv = components.MotionDiv || motion.div;

    /**
     * Gets the appropriate title for the current modal content
     */
    const getTitle = useCallback(() => {
      switch (connectModalContentType) {
        case 'about':
          return labels.aboutWallets;
        case 'getWallet':
          return labels.getWallet;
        case 'connecting':
          if (selectedAdapter && activeConnector && connectors) {
            const connectorName = getConnectorName(connectors[selectedAdapter], activeConnector);
            return connectorName || labels.connectingEllipsis;
          }
          return labels.connectingEllipsis;
        case 'impersonate':
          return labels.connectImpersonatedWallet;
        default:
          return labels.connectWallet;
      }
    }, [connectModalContentType, selectedAdapter, activeConnector, connectors, labels]);

    /**
     * Determines the content type to navigate back to
     */
    const goBackContentType = useCallback((): ConnectContentType => {
      switch (connectModalContentType) {
        default:
          return 'connectors';
      }
    }, [connectModalContentType]);

    /**
     * Handle modal open/close with custom handler
     */
    const handleOpenChange = useCallback(
      (open: boolean) => {
        if (handlers?.onOpenChange) {
          handlers.onOpenChange(open, modalData);
        } else {
          setIsConnectModalOpen(open);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [handlers?.onOpenChange, modalData, setIsConnectModalOpen],
    );

    /**
     * Handle back navigation with custom handler
     */
    const handleBack = useCallback(() => {
      const originalHandler = () => setConnectModalContentType(goBackContentType());

      if (handlers?.onBack) {
        handlers.onBack(modalData, originalHandler);
      } else {
        originalHandler();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handlers?.onBack, modalData, setConnectModalContentType, goBackContentType]);

    /**
     * Handle info button click
     */
    const handleInfoClick = useCallback(() => {
      if (handlers?.onInfoClick) {
        handlers.onInfoClick(modalData);
      } else {
        setConnectModalContentType('about');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [handlers?.onInfoClick, modalData, setConnectModalContentType]);

    /**
     * Generic connection handler
     */
    const handleConnect = useCallback(
      async (walletType: WalletType, adapter: OrbitAdapter) => {
        await storeGetters.connect({
          walletType,
          chainId: getConnectChainId({ appChains, selectedAdapter: adapter, solanaRPCUrls }),
        });

        try {
          await waitFor(() => store?.getState().activeWallet?.isConnected);
          setIsConnected(true);
          const modalCloseTime = setTimeout(() => setIsConnectModalOpen(false), 400);
          const isConnectedTimer = setTimeout(() => setIsConnected(false), 500);
          await delay(null, 500);
          clearTimeout(modalCloseTime);
          clearTimeout(isConnectedTimer);
        } catch (error) {
          console.error(error);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [storeGetters],
    );

    /**
     * Handle network selection click
     */
    const handleNetworkClick = useCallback(
      async (adapter: OrbitAdapter, walletType: WalletType) => {
        setSelectedAdapter(adapter);
        setConnectModalContentType('connecting');
        await handleConnect(walletType, adapter);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [handleConnect],
    );

    /**
     * Handle connector selection click
     */
    const handleConnectorClick = useCallback(
      (connector: GroupedConnector) => {
        setActiveConnector(formatWalletName(connector.name));
        if (connector.adapters.length === 1) {
          setSelectedAdapter(connector.adapters[0]);
          setConnectModalContentType(
            formatWalletName(connector.name) === 'impersonatedwallet' ? 'impersonate' : 'connecting',
          );
        } else if (selectedAdapter) {
          setConnectModalContentType(
            formatWalletName(connector.name) === 'impersonatedwallet' ? 'impersonate' : 'connecting',
          );
        } else if (formatWalletName(connector.name) === 'impersonatedwallet') {
          setConnectModalContentType('impersonate');
        } else {
          setConnectModalContentType('network');
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [selectedAdapter],
    );

    /**
     * Renders the main content based on current modal state
     */
    const renderMainContent = useCallback(() => {
      switch (connectModalContentType) {
        case 'network':
          return (
            <NetworkSelections
              activeConnector={activeConnector}
              connectors={filteredConnectors}
              onClick={handleNetworkClick}
              customization={childComponents.networkSelections}
            />
          );
        case 'connectors':
          return connectors ? (
            <>
              <NetworkTabs
                networks={Object.keys(connectors) as OrbitAdapter[]}
                selectedAdapter={selectedAdapter}
                onSelect={(adapter) => setSelectedAdapter(adapter)}
                customization={childComponents.networkTabs}
              />

              <ConnectorsSelections
                isOnlyOneNetwork={Object.keys(connectors).length === 1}
                connectors={filteredConnectors}
                selectedAdapter={selectedAdapter}
                onClick={handleConnectorClick}
                setContentType={setConnectModalContentType}
                appChains={appChains}
                solanaRPCUrls={solanaRPCUrls}
                setIsConnected={setIsConnected}
                setIsOpen={setIsConnectModalOpen}
                waitForPredict={() => store?.getState().activeWallet?.isConnected}
                withImpersonated={withImpersonated}
                store={store}
                customization={childComponents.connectorsSelections}
              />
            </>
          ) : (
            <CustomEmptyState className={classNames.emptyConnectors?.({ modalData })} modalData={modalData}>
              No connectors available
            </CustomEmptyState>
          );
        case 'about':
          return <AboutWallets customization={childComponents.aboutWallets} />;
        case 'getWallet':
          return <GetWallet customization={childComponents.getWallet} />;
        case 'connecting':
          return (
            <Connecting
              selectedAdapter={selectedAdapter}
              connectors={filteredConnectors}
              activeConnector={activeConnector}
              isConnected={isConnected}
              customization={childComponents.connecting}
            />
          );
        case 'impersonate':
          return (
            <ImpersonateForm
              store={store}
              impersonatedAddress={impersonatedAddress}
              setImpersonatedAddress={setImpersonatedAddress}
              customization={childComponents.impersonateForm}
            />
          );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      connectModalContentType,
      activeConnector,
      filteredConnectors,
      handleNetworkClick,
      childComponents,
      connectors,
      selectedAdapter,
      handleConnectorClick,
      isConnected,
      impersonatedAddress,
    ]);

    /**
     * Gets configuration for the bottom action button
     */
    const getBottomButtonConfig = useCallback((): BottomButtonConfig | undefined => {
      switch (connectModalContentType) {
        case 'connectors':
          return {
            title: labels.iDontHaveWallet,
            onClick: () => {
              if (handlers.onActionClick?.connectors) {
                handlers.onActionClick.connectors(modalData);
              } else {
                setConnectModalContentType('getWallet');
              }
            },
          };
        case 'getWallet':
          return {
            title: labels.choseWallet,
            onClick: () => {
              if (handlers.onActionClick?.getWallet) {
                handlers.onActionClick.getWallet(modalData);
              } else {
                window.open(
                  networksLinks[selectedAdapter ?? (Object.keys(connectors!)[0] as OrbitAdapter)]?.choseWallet,
                  '_blank',
                  'noopener,noreferrer',
                );
              }
            },
          };
        case 'about':
          return {
            title: labels.learnMore,
            onClick: () => {
              if (handlers.onActionClick?.about) {
                handlers.onActionClick.about(modalData);
              } else {
                window.open(
                  networksLinks[selectedAdapter ?? (Object.keys(connectors!)[0] as OrbitAdapter)]?.about,
                  '_blank',
                  'noopener,noreferrer',
                );
              }
            },
          };
        case 'impersonate':
          return {
            title: labels.connect,
            onClick: async () => {
              if (handlers.onActionClick?.impersonate) {
                await handlers.onActionClick.impersonate(modalData);
              } else {
                const trimmedAddress = impersonatedAddress.trim();
                if (
                  walletConnectionError ||
                  !trimmedAddress ||
                  isAddress(trimmedAddress) ||
                  !!store?.getState().activeWallet?.isConnected
                )
                  return;

                impersonatedHelpers.setImpersonated(trimmedAddress);
                await handleConnect(
                  `${selectedAdapter ?? OrbitAdapter.EVM}:impersonatedwallet` as WalletType,
                  selectedAdapter ?? OrbitAdapter.EVM,
                );
                setConnectModalContentType('connecting');
              }
            },
          };
        case 'connecting':
          return walletConnectionError && selectedAdapter && activeConnector
            ? {
                title: labels.tryAgain,
                onClick: async () => {
                  if (handlers.onActionClick?.connecting) {
                    await handlers.onActionClick.connecting(modalData);
                  } else {
                    await handleConnect(
                      getWalletTypeFromConnectorName(selectedAdapter, activeConnector) as WalletType,
                      selectedAdapter,
                    );
                  }
                },
              }
            : undefined;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      connectModalContentType,
      labels,
      handlers,
      modalData,
      selectedAdapter,
      connectors,
      impersonatedAddress,
      walletConnectionError,
      handleConnect,
      activeConnector,
    ]);

    const bottomButtonConfig = getBottomButtonConfig();

    /**
     * Get action description text
     */
    const getActionDescription = useCallback(() => {
      switch (connectModalContentType) {
        case 'getWallet':
          return 'Opens external wallet selection page';
        case 'about':
          return 'Opens external documentation';
        case 'impersonate':
          return 'Connects with impersonated wallet address';
        case 'connecting':
          return 'Retries wallet connection';
        default:
          return '';
      }
    }, [connectModalContentType]);

    return (
      <CustomDialog open={isConnectModalOpen} onOpenChange={handleOpenChange}>
        <CustomDialogContent className={cn('novacon:w-full novacon:sm:max-w-md')}>
          <CustomMotionDiv
            layout
            transition={{
              layout: {
                duration: config.animation?.disabled ? 0 : (config.animation?.layoutDuration ?? 0.0001),
              },
            }}
          >
            <ModalContainer className={classNames.modalContainer?.({ modalData })} modalData={modalData}>
              <ModalHeader className={classNames.header?.({ modalData })} modalData={modalData}>
                <Title className={classNames.title?.({ modalData })} modalData={modalData}>
                  {connectModalContentType === 'connectors' && (
                    <InfoButton
                      className={classNames.infoButton?.({ modalData })}
                      onClick={handleInfoClick}
                      aria-label={
                        config.ariaLabels?.infoButton?.(modalData) || `${labels.learnMore} ${labels.aboutWallets}`
                      }
                      modalData={modalData}
                    />
                  )}
                  {getTitle()}
                </Title>

                <CloseButton
                  className={classNames.closeButton?.({ modalData })}
                  onClick={() => handleOpenChange(false)}
                  aria-label={config.ariaLabels?.closeButton?.(modalData) || labels.closeModal}
                  modalData={modalData}
                />
              </ModalHeader>

              <MainContent className={classNames.mainContent?.({ modalData })} modalData={modalData}>
                {renderMainContent()}
              </MainContent>

              <Footer className={classNames.footer?.({ modalData })} modalData={modalData}>
                <div className="novacon:flex novacon:items-center novacon:gap-4">
                  {connectModalContentType !== 'connectors' && (
                    <BackButton
                      className={classNames.backButton?.({ modalData })}
                      onClick={handleBack}
                      aria-label={config.ariaLabels?.backButton?.(modalData) || `${labels.back} to previous step`}
                      modalData={modalData}
                    >
                      {labels.back}
                    </BackButton>
                  )}
                </div>
                {bottomButtonConfig && (
                  <div className="novacon:flex novacon:items-center novacon:gap-3">
                    <ActionButton
                      className={classNames.actionButton?.({ modalData, buttonConfig: bottomButtonConfig })}
                      onClick={bottomButtonConfig.onClick}
                      disabled={bottomButtonConfig.disabled}
                      loading={bottomButtonConfig.loading}
                      aria-describedby="bottom-action-description"
                      modalData={modalData}
                      buttonConfig={bottomButtonConfig}
                    >
                      {bottomButtonConfig.title}
                    </ActionButton>
                    <ActionDescription
                      id="bottom-action-description"
                      className={classNames.actionDescription?.({ modalData })}
                      modalData={modalData}
                    >
                      {getActionDescription()}
                    </ActionDescription>
                  </div>
                )}
              </Footer>
            </ModalContainer>
          </CustomMotionDiv>
        </CustomDialogContent>
      </CustomDialog>
    );
  },
);

ConnectModal.displayName = 'ConnectModal';
