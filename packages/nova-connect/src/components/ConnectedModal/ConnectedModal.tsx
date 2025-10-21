/**
 * @file ConnectedModal component with comprehensive customization options for all child components.
 */

import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { CloseIcon, cn, Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@tuwaio/nova-core';
import { formatWalletChainId, getAdapterFromWalletType, OrbitAdapter, WalletType } from '@tuwaio/orbit-core';
import { type Easing, motion, type Transition, type Variants } from 'framer-motion';
import React, { ComponentPropsWithoutRef, ComponentType, forwardRef, useCallback, useEffect, useMemo } from 'react';

import { NativeBalanceResult, useGetWalletNameAndAvatar, useWalletNativeBalance } from '../../hooks';
import { NovaConnectProviderType, useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { getChainsListByWalletType, getWalletChains } from '../../utils';
import { ScrollableChainList, type ScrollableChainListProps } from '../Chains/ScrollableChainList';
import { ConnectButtonProps } from '../ConnectButton/ConnectButton';
import { ConnectedModalFooter, type ConnectedModalFooterProps } from './ConnectedModalFooter';
import {
  ConnectedModalMainContent,
  type ConnectedModalMainContentCustomization,
  type ConnectedModalMainContentProps,
} from './ConnectedModalMainContent';
import { ConnectedModalTxHistory, type ConnectedModalTxHistoryProps } from './ConnectedModalTxHistory';

// --- Default Motion Variants ---
const DEFAULT_MODAL_ANIMATION_VARIANTS: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 10 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

// --- Content Types ---
type ConnectedModalContentType = 'main' | 'transactions' | 'chains';

// --- Component Props Types ---
type HeaderProps = {
  contentType: ConnectedModalContentType;
  title: string;
  onBack: () => void;
  onClose: () => void;
  labels: Record<string, string>;
  className?: string;
};

type BackButtonProps = {
  onBack: () => void;
  labels: Record<string, string>;
  className?: string;
};

type TitleProps = {
  title: string;
  className?: string;
};

type CloseButtonProps = {
  onClose: () => void;
  labels: Record<string, string>;
  className?: string;
};

type MainContentProps = Pick<ConnectButtonProps, 'transactionPool' | 'store' | 'pulsarAdapter'> &
  Pick<NovaConnectProviderType, 'activeWallet'> & {
    contentType: ConnectedModalContentType;
    balance: NativeBalanceResult | null;
    ensNameAbbreviated: string | undefined;
    avatarIsLoading: boolean;
    balanceLoading: boolean;
    ensAvatar: string | null;
    chainsList: (string | number)[];
    onChainChange: (chainId: string) => void;
    onBack: () => void;
    getChainData: (chain: string | number) => { formattedChainId: string | number; chain: string | number };
    className?: string;
  };

// --- Wallet Name Hook Config Type ---
type WalletNameConfig = {
  abbreviateSymbols?: number;
  maxNameLength?: number;
  autoRetry?: boolean;
  retryDelay?: number;
};

/**
 * Customization options for ConnectedModal component
 */
export type ConnectedModalCustomization = {
  /** Override root dialog props */
  dialogProps?: Partial<ComponentPropsWithoutRef<typeof Dialog>>;
  /** Override dialog content props */
  dialogContentProps?: Partial<ComponentPropsWithoutRef<typeof DialogContent>>;
  /** Custom components */
  components?: {
    /** Custom dialog component */
    Dialog?: ComponentType<ComponentPropsWithoutRef<typeof Dialog>>;
    /** Custom dialog content component */
    DialogContent?: ComponentType<ComponentPropsWithoutRef<typeof DialogContent>>;
    /** Custom dialog header component */
    DialogHeader?: ComponentType<ComponentPropsWithoutRef<'div'>>;
    /** Custom dialog title component */
    DialogTitle?: ComponentType<ComponentPropsWithoutRef<'h2'>>;
    /** Custom header component */
    Header?: ComponentType<HeaderProps>;
    /** Custom back button component */
    BackButton?: ComponentType<BackButtonProps>;
    /** Custom title component */
    Title?: ComponentType<TitleProps>;
    /** Custom close button component */
    CloseButton?: ComponentType<CloseButtonProps>;
    /** Custom main content component */
    MainContent?: ComponentType<MainContentProps>;
    /** Custom main content renderer for main view */
    MainContentRenderer?: ComponentType<ConnectedModalMainContentProps>;
    /** Custom transactions content renderer */
    TransactionsContentRenderer?: ComponentType<ConnectedModalTxHistoryProps>;
    /** Custom chains content renderer */
    ChainsContentRenderer?: ComponentType<ScrollableChainListProps>;
    /** Custom footer component */
    Footer?: ComponentType<ConnectedModalFooterProps>;
    /** Custom motion container */
    MotionContainer?: ComponentType<ComponentPropsWithoutRef<typeof motion.div>>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate dialog classes */
    dialog?: () => string;
    /** Function to generate dialog content classes */
    dialogContent?: (params: { contentType: ConnectedModalContentType; hasActiveWallet: boolean }) => string;
    /** Function to generate motion container classes */
    motionContainer?: () => string;
    /** Function to generate content container classes */
    contentContainer?: (params: { contentType: ConnectedModalContentType }) => string;
    /** Function to generate header classes */
    header?: (params: { contentType: ConnectedModalContentType }) => string;
    /** Function to generate back button classes */
    backButton?: () => string;
    /** Function to generate title classes */
    title?: (params: { contentType: ConnectedModalContentType }) => string;
    /** Function to generate close button classes */
    closeButton?: () => string;
    /** Function to generate main content classes */
    mainContent?: (params: { contentType: ConnectedModalContentType }) => string;
    /** Function to generate footer classes */
    footer?: () => string;
  };
  /** Custom animation variants */
  variants?: {
    /** Modal animation variants */
    modal?: Variants;
    /** Content animation variants */
    content?: Variants;
  };
  /** Custom animation configuration */
  animation?: {
    /** Modal animation configuration */
    modal?: {
      /** Animation duration in seconds */
      duration?: number;
      /** Animation easing curve */
      ease?: Easing | Easing[];
      /** Animation delay in seconds */
      delay?: number;
    };
    /** Content animation configuration */
    content?: {
      /** Animation duration in seconds */
      duration?: number;
      /** Animation easing curve */
      ease?: Easing | Easing[];
      /** Animation delay in seconds */
      delay?: number;
    };
    /** Layout animation configuration */
    layout?: {
      /** Animation duration in seconds */
      duration?: number;
      /** Animation easing curve */
      ease?: Easing | Easing[];
    };
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom handler for modal open state change */
    onOpenChange?: (open: boolean) => void;
    /** Custom handler for back navigation */
    onBack?: () => void;
    /** Custom handler for modal close */
    onClose?: () => void;
    /** Custom handler for chain change */
    onChainChange?: (chainId: string) => void;
    /** Custom handler for content type change */
    onContentTypeChange?: (type: ConnectedModalContentType) => void;
  };
  /** Child component customizations */
  childCustomizations?: {
    /** Customization for ConnectedModalMainContent component */
    mainContent?: ConnectedModalMainContentCustomization;
    /** Customization for ConnectedModalTxHistory component */
    txHistory?: Record<string, unknown>; // Will be properly typed when that component is updated
    /** Customization for ScrollableChainList component */
    chainList?: Record<string, unknown>; // Will be properly typed when that component is updated
    /** Customization for ConnectedModalFooter component */
    footer?: Record<string, unknown>; // Will be properly typed when that component is updated
  };
  /** Configuration options */
  config?: {
    /** Whether to disable animations */
    disableAnimation?: boolean;
    /** Whether to reduce motion for accessibility */
    reduceMotion?: boolean;
    /** Whether to auto-reset to main view when opening */
    autoResetToMain?: boolean;
    /** Custom ARIA labels for different states */
    ariaLabels?: {
      dialog?: string;
      header?: string;
      backButton?: string;
      closeButton?: string;
      mainContent?: string;
    };
    /** Hook configurations */
    hooks?: {
      /** Configuration for wallet name and avatar hook */
      walletNameAndAvatar?: WalletNameConfig;
    };
  };
};

/**
 * Props for the ConnectedModal component
 */
export interface ConnectedModalProps extends Omit<ConnectButtonProps, 'className' | 'customization'> {
  /** Additional CSS classes for the modal */
  className?: string;
  /** Customization options */
  customization?: ConnectedModalCustomization;
}

// --- Default Sub-Components ---
const DefaultBackButton: React.FC<BackButtonProps> = ({ onBack, labels, className }) => (
  <button
    type="button"
    onClick={onBack}
    aria-label={labels.back}
    className={cn(
      'novacon:cursor-pointer novacon:rounded-full novacon:p-1',
      'novacon:text-[var(--tuwa-text-tertiary)] novacon:transition-colors',
      'novacon:hover:bg-[var(--tuwa-bg-muted)] novacon:hover:text-[var(--tuwa-text-primary)]',
      'novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-[var(--tuwa-border-primary)]',
      className,
    )}
  >
    <ChevronLeftIcon className="novacon:h-5 novacon:w-5" />
  </button>
);

const DefaultTitle: React.FC<TitleProps> = ({ title, className }) => (
  <span className={cn('novacon:flex-1 novacon:text-center novacon:font-semibold', className)}>{title}</span>
);

const DefaultCloseButton: React.FC<CloseButtonProps> = ({ onClose, labels, className }) => (
  <DialogClose asChild>
    <button
      type="button"
      onClick={onClose}
      aria-label={labels.closeModal}
      className={cn(
        'novacon:cursor-pointer novacon:rounded-full novacon:p-1',
        'novacon:text-[var(--tuwa-text-tertiary)] novacon:transition-colors',
        'novacon:hover:bg-[var(--tuwa-bg-muted)] novacon:hover:text-[var(--tuwa-text-primary)]',
        'novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-[var(--tuwa-border-primary)]',
        className,
      )}
    >
      <CloseIcon />
    </button>
  </DialogClose>
);

const DefaultHeader: React.FC<HeaderProps> = ({ contentType, title, onBack, onClose, labels, className }) => (
  <DialogHeader className={className}>
    <DialogTitle>
      <div className="novacon:flex novacon:items-center novacon:justify-between novacon:gap-2">
        {contentType !== 'main' && <DefaultBackButton onBack={onBack} labels={labels} />}
        <DefaultTitle title={title} />
      </div>
    </DialogTitle>
    <DefaultCloseButton onClose={onClose} labels={labels} />
  </DialogHeader>
);

const DefaultMainContent: React.FC<MainContentProps> = ({
  contentType,
  balance,
  ensNameAbbreviated,
  avatarIsLoading,
  balanceLoading,
  store,
  ensAvatar,
  chainsList,
  transactionPool,
  pulsarAdapter,
  activeWallet,
  onChainChange,
  onBack,
  getChainData,
  className,
}) => {
  const renderContent = () => {
    switch (contentType) {
      case 'main':
        return (
          <ConnectedModalMainContent
            balance={balance}
            ensNameAbbreviated={ensNameAbbreviated}
            avatarIsLoading={avatarIsLoading}
            balanceLoading={balanceLoading}
            store={store}
            ensAvatar={ensAvatar}
            chainsList={chainsList}
            transactionPool={transactionPool}
          />
        );
      case 'transactions':
        return <ConnectedModalTxHistory transactionPool={transactionPool} pulsarAdapter={pulsarAdapter} />;
      case 'chains':
        if (!activeWallet) return null;
        return (
          <ScrollableChainList
            chainsList={chainsList}
            selectValue={String(
              formatWalletChainId(
                (activeWallet as { chainId: string | number }).chainId,
                getAdapterFromWalletType((activeWallet as { walletType: WalletType }).walletType),
              ),
            )}
            handleValueChange={onChainChange}
            getChainData={getChainData}
            onClose={onBack}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main
      className={cn('novacon:relative', className)}
      id="connected-modal-description"
      aria-live="polite"
      aria-atomic="true"
    >
      {renderContent()}
    </main>
  );
};

/**
 * Modal component that displays wallet connection status and provides access to wallet controls with comprehensive customization options.
 *
 * This modal serves as the main interface for connected wallet management, offering:
 * - Wallet connection status and information
 * - Network switching capabilities
 * - Transaction history viewing
 * - Wallet disconnection controls
 * - Comprehensive customization for all UI elements and behaviors
 * - Animation support with reduced motion options
 * - Custom event handlers for enhanced interactivity
 * - Performance-optimized with memoized calculations
 * - Full customization of child components through parent
 *
 * The modal adapts its content based on the current view state and provides
 * full WCAG compliance with proper ARIA labels and keyboard navigation support.
 *
 * @example Basic usage
 * ```tsx
 * <ConnectedModal
 *   solanaRPCUrls={solanaConfig}
 *   transactionPool={txPool}
 *   pulsarAdapter={adapter}
 *   appChains={chainConfig}
 *   store={store}
 * />
 * ```
 */
export const ConnectedModal = forwardRef<HTMLDivElement, ConnectedModalProps>(
  ({ solanaRPCUrls, transactionPool, pulsarAdapter, appChains, className, store, customization }, ref) => {
    // Get localized labels for UI text
    const labels = useNovaConnectLabels();

    // Get modal state and controls from hook
    const {
      setConnectedModalContentType,
      isConnectedModalOpen,
      setIsConnectedModalOpen,
      connectedModalContentType,
      activeWallet,
    } = useNovaConnect();

    // Extract customization options with stable references
    const {
      Dialog: CustomDialog = Dialog,
      DialogContent: CustomDialogContent = DialogContent,
      Header: CustomHeader = DefaultHeader,
      MainContent: CustomMainContent = DefaultMainContent,
      Footer: CustomFooter = ConnectedModalFooter,
      MotionContainer = motion.div,
    } = customization?.components ?? {};

    const {
      disableAnimation = false,
      reduceMotion = false,
      autoResetToMain = true,
      ariaLabels,
      hooks: hooksConfig,
    } = customization?.config ?? {};

    // Memoize handler references
    const customHandlers = useMemo(() => customization?.handlers, [customization?.handlers]);

    // Hook configurations
    const walletNameConfig: WalletNameConfig = useMemo(
      () =>
        hooksConfig?.walletNameAndAvatar ?? {
          abbreviateSymbols: 6,
          maxNameLength: 30,
          autoRetry: false,
          retryDelay: 3000,
        },
      [hooksConfig?.walletNameAndAvatar],
    );

    const {
      ensAvatar,
      ensNameAbbreviated,
      isLoading: avatarIsLoading,
    } = useGetWalletNameAndAvatar({
      activeWallet,
      store,
      ...walletNameConfig,
    });

    const { balance, isLoading: balanceLoading } = useWalletNativeBalance({ store, activeWallet });

    /**
     * Handles network switching when user selects a different chain
     */
    const handleChainChange = useCallback(
      (newChainId: string) => {
        if (customHandlers?.onChainChange) {
          customHandlers.onChainChange(newChainId);
        } else {
          (store?.getState() as { switchNetwork: (chainId: string) => void })?.switchNetwork(newChainId);
        }
      },
      [customHandlers, store],
    );

    /**
     * Handle modal open state changes
     */
    const handleOpenChange = useCallback(
      (open: boolean) => {
        if (customHandlers?.onOpenChange) {
          customHandlers.onOpenChange(open);
        } else {
          setIsConnectedModalOpen(open);
        }
      },
      [customHandlers, setIsConnectedModalOpen],
    );

    /**
     * Reset modal content to main view when modal opens
     * This ensures consistent initial state every time the modal is opened
     */
    useEffect(() => {
      if (isConnectedModalOpen && autoResetToMain) {
        setConnectedModalContentType('main');
      }
    }, [isConnectedModalOpen, autoResetToMain, setConnectedModalContentType]);

    /**
     * Memoized chains list to prevent unnecessary recalculations
     * Only recalculates when wallet type or configuration changes
     */
    const chainsList = useMemo(() => {
      if (!activeWallet) {
        return getChainsListByWalletType({
          walletType: `${OrbitAdapter.EVM}:not-connected`,
          appChains,
          solanaRPCUrls,
          chains: [],
        });
      }

      // Safely extract wallet chains using shared utility
      const walletChains = getWalletChains(activeWallet);

      return getChainsListByWalletType({
        walletType: (activeWallet as { walletType: WalletType }).walletType,
        appChains,
        solanaRPCUrls,
        chains: walletChains,
      });
    }, [activeWallet, appChains, solanaRPCUrls]);

    /**
     * Helper function to format chain data for display and selection
     * @param chain - Chain identifier (string or number)
     * @returns Object with formatted chain ID and original chain value
     */
    const getChainData = useCallback(
      (chain: string | number) => {
        if (!activeWallet) {
          return { formattedChainId: chain, chain };
        }

        return {
          formattedChainId: formatWalletChainId(
            chain,
            getAdapterFromWalletType((activeWallet as { walletType: WalletType }).walletType),
          ),
          chain,
        };
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [activeWallet?.walletType],
    );

    /**
     * Get localized title based on current modal content type
     * @returns Appropriate title string from labels
     */
    const getTitle = useCallback((): string => {
      switch (connectedModalContentType) {
        case 'transactions':
          return labels.transactionsInApp;
        case 'chains':
          return labels.switchNetwork;
        default:
          return labels.connected;
      }
    }, [connectedModalContentType, labels]);

    /**
     * Navigate back to main modal content
     * Used by back button in sub-views
     */
    const handleBackToMain = useCallback(() => {
      if (customHandlers?.onBack) {
        customHandlers.onBack();
      } else {
        setConnectedModalContentType('main');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customHandlers?.onBack, setConnectedModalContentType]);

    /**
     * Close the entire modal
     * Resets state and closes modal dialog
     */
    const handleCloseModal = useCallback(() => {
      if (customHandlers?.onClose) {
        customHandlers.onClose();
      } else {
        setIsConnectedModalOpen(false);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customHandlers?.onClose, setIsConnectedModalOpen]);

    /**
     * Memoized state calculations
     */
    const hasActiveWallet = useMemo(
      () => Boolean(activeWallet && (activeWallet as { isConnected?: boolean }).isConnected),
      [activeWallet],
    );
    const currentTitle = useMemo(() => getTitle(), [getTitle]);

    /**
     * Generate dialog content classes
     */
    const dialogContentClasses = useMemo(() => {
      if (customization?.classNames?.dialogContent) {
        return customization.classNames.dialogContent({
          contentType: connectedModalContentType,
          hasActiveWallet,
        });
      }
      return cn('novacon:w-full novacon:sm:max-w-md', className);
    }, [customization, connectedModalContentType, hasActiveWallet, className]);

    /**
     * Animation variants
     */
    const modalVariants = useMemo(
      () => customization?.variants?.modal || DEFAULT_MODAL_ANIMATION_VARIANTS,
      [customization?.variants?.modal],
    );

    /**
     * Motion props configuration
     */
    const motionProps = useMemo(() => {
      if (disableAnimation || reduceMotion) {
        return {};
      }

      const layoutTransition: Transition = {
        duration: customization?.animation?.layout?.duration ?? 0.0001,
        ease: customization?.animation?.layout?.ease,
      };

      return {
        layout: true,
        variants: modalVariants,
        initial: 'initial' as const,
        animate: 'animate' as const,
        exit: 'exit' as const,
        transition: {
          layout: layoutTransition,
          duration: customization?.animation?.modal?.duration ?? 0.3,
          ease: customization?.animation?.modal?.ease ?? 'easeOut',
          delay: customization?.animation?.modal?.delay ?? 0,
        },
      };
    }, [disableAnimation, reduceMotion, modalVariants, customization]);

    // Early return if no active wallet - prevents rendering empty modal
    if (!hasActiveWallet || !activeWallet) {
      return null;
    }

    const content = (
      <>
        {/* Modal header with navigation and close controls */}
        <CustomHeader
          contentType={connectedModalContentType}
          title={currentTitle}
          onBack={handleBackToMain}
          onClose={handleCloseModal}
          labels={labels}
          className={customization?.classNames?.header?.({ contentType: connectedModalContentType })}
        />

        {/* Main content area - changes based on current view */}
        <CustomMainContent
          contentType={connectedModalContentType}
          balance={balance}
          ensNameAbbreviated={ensNameAbbreviated}
          avatarIsLoading={avatarIsLoading}
          balanceLoading={balanceLoading}
          store={store}
          ensAvatar={ensAvatar}
          chainsList={chainsList}
          transactionPool={transactionPool}
          pulsarAdapter={pulsarAdapter}
          activeWallet={activeWallet}
          onChainChange={handleChainChange}
          onBack={handleBackToMain}
          getChainData={getChainData}
          className={customization?.classNames?.mainContent?.({ contentType: connectedModalContentType })}
        />

        {/* Footer with additional controls */}
        <CustomFooter
          store={store}
          setIsOpen={setIsConnectedModalOpen}
          className={customization?.classNames?.footer?.()}
        />
      </>
    );

    return (
      <CustomDialog open={isConnectedModalOpen} onOpenChange={handleOpenChange} {...customization?.dialogProps}>
        <CustomDialogContent
          ref={ref}
          className={dialogContentClasses}
          role="dialog"
          aria-modal="true"
          aria-label={ariaLabels?.dialog}
          {...customization?.dialogContentProps}
        >
          <MotionContainer className={customization?.classNames?.motionContainer?.()} {...motionProps}>
            <div
              className={
                customization?.classNames?.contentContainer?.({ contentType: connectedModalContentType })
                  ? customization?.classNames?.contentContainer?.({ contentType: connectedModalContentType })
                  : cn('novacon:relative novacon:flex novacon:w-full novacon:flex-col')
              }
            >
              {content}
            </div>
          </MotionContainer>
        </CustomDialogContent>
      </CustomDialog>
    );
  },
);

ConnectedModal.displayName = 'ConnectedModal';
