/**
 * @file ConnectedModalMainContent component with comprehensive customization options for all child components.
 */

import { cn, standardButtonClasses } from '@tuwaio/nova-core';
import { getAdapterFromWalletType } from '@tuwaio/orbit-core';
import { Transaction } from '@tuwaio/pulsar-core';
import { AnimatePresence, type Easing, motion, type Variants } from 'framer-motion';
import React, { ComponentPropsWithoutRef, ComponentType, forwardRef, useCallback, useMemo } from 'react';

import { NativeBalanceResult } from '../../hooks';
import { useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { ConnectButtonProps } from '../ConnectButton/ConnectButton';
import { WalletAvatar, WalletAvatarProps } from '../WalletAvatar';
import {
  ConnectedModalNameAndBalance,
  ConnectedModalNameAndBalanceCustomization,
  ConnectedModalNameAndBalanceProps,
} from './ConnectedModalNameAndBalance';
import { IconButton, IconButtonProps } from './IconButton';

// --- Default Motion Variants ---
const DEFAULT_CONTAINER_ANIMATION_VARIANTS: Variants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut', staggerChildren: 0.1 },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: -20,
    transition: { duration: 0.3, ease: 'easeIn' },
  },
};

const DEFAULT_LOADING_ANIMATION_VARIANTS: Variants = {
  initial: { scale: 0.6, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: { duration: 0.4 } },
  exit: { scale: 0.6, opacity: 0, transition: { duration: 0.3 } },
};

const DEFAULT_AVATAR_SECTION_ANIMATION_VARIANTS: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const DEFAULT_INFO_SECTION_ANIMATION_VARIANTS: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.2 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const DEFAULT_TRANSACTIONS_ANIMATION_VARIANTS: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

// --- Types for Customization ---
type LoadingIndicatorProps = {
  isLoading: boolean;
  labels: Record<string, string>;
  className?: string;
};

type AvatarSectionProps = {
  activeWallet: NonNullable<ReturnType<typeof useNovaConnect>['activeWallet']>;
  ensAvatar: string | null;
  walletName: string;
  connectorsCount: number;
  chainsList: (string | number)[];
  labels: Record<string, string>;
  onSwitchWallet: () => void;
  onSwitchNetwork: () => void;
  className?: string;
};

type InfoSectionProps = {
  balanceLoading: boolean;
  balance: NativeBalanceResult | null;
  ensNameAbbreviated: string | undefined;
  labels: Record<string, string>;
  className?: string;
};

type TransactionsSectionProps = {
  walletTransactions: Transaction[];
  hasPendingTransactions: boolean;
  labels: Record<string, string>;
  onViewTransactions: () => void;
  showPendingIndicators?: boolean;
  className?: string;
};

type NoTransactionsIndicatorProps = {
  className?: string;
};

/**
 * Customization options for ConnectedModalMainContent component
 */
export type ConnectedModalMainContentCustomization = {
  /** Override root container props */
  containerProps?: Partial<
    Omit<
      ComponentPropsWithoutRef<'div'>,
      | 'popover'
      | 'onDrag'
      | 'onDragEnd'
      | 'onDragExit'
      | 'onDragStart'
      | 'onDragStartCapture'
      | 'onAnimationStart'
      | 'onAnimationEnd'
      | 'onAnimationStartCapture'
      | 'onAnimationEndCapture'
      | 'onAnimationIteration'
      | 'onAnimationIterationCapture'
    >
  >;
  /** Custom components */
  components?: {
    /** Custom loading indicator component */
    LoadingIndicator?: ComponentType<LoadingIndicatorProps>;
    /** Custom avatar section component */
    AvatarSection?: ComponentType<AvatarSectionProps>;
    /** Custom wallet avatar component */
    WalletAvatar?: ComponentType<WalletAvatarProps>;
    /** Custom switch wallet icon button component */
    SwitchWalletButton?: ComponentType<IconButtonProps>;
    /** Custom switch network icon button component */
    SwitchNetworkButton?: ComponentType<IconButtonProps>;
    /** Custom info section component */
    InfoSection?: ComponentType<InfoSectionProps>;
    /** Custom name and balance component */
    NameAndBalance?: ComponentType<ConnectedModalNameAndBalanceProps>;
    /** Custom transactions section component */
    TransactionsSection?: ComponentType<TransactionsSectionProps>;
    /** Custom no transactions indicator component */
    NoTransactionsIndicator?: ComponentType<NoTransactionsIndicatorProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: {
      hasActiveWallet: boolean;
      isLoading: boolean;
      hasTransactions: boolean;
      hasPendingTransactions: boolean;
    }) => string;
    /** Function to generate loading indicator classes */
    loadingIndicator?: (params: { isLoading: boolean }) => string;
    /** Function to generate loading spinner classes */
    loadingSpinner?: () => string;
    /** Function to generate avatar section classes */
    avatarSection?: () => string;
    /** Function to generate wallet avatar classes */
    walletAvatar?: (params: { ensAvatar: string | null }) => string;
    /** Function to generate switch wallet button classes */
    switchWalletButton?: (params: { connectorsCount: number }) => string;
    /** Function to generate switch network button classes */
    switchNetworkButton?: (params: { chainsCount: number }) => string;
    /** Function to generate info section classes */
    infoSection?: () => string;
    /** Function to generate transactions section classes */
    transactionsSection?: (params: { transactionsCount: number; hasPendingTransactions: boolean }) => string;
    /** Function to generate transactions button classes */
    transactionsButton?: () => string;
    /** Function to generate pending indicator classes */
    pendingIndicator?: () => string;
    /** Function to generate pending spinner classes */
    pendingSpinner?: () => string;
    /** Function to generate no transactions classes */
    noTransactions?: () => string;
  };
  /** Custom animation variants */
  variants?: {
    /** Container animation variants */
    container?: Variants;
    /** Loading animation variants */
    loading?: Variants;
    /** Avatar section animation variants */
    avatarSection?: Variants;
    /** Info section animation variants */
    infoSection?: Variants;
    /** Transactions animation variants */
    transactions?: Variants;
  };
  /** Custom animation configuration */
  animation?: {
    /** Container animation configuration */
    container?: {
      /** Animation duration in seconds */
      duration?: number;
      /** Animation easing curve */
      ease?: Easing | Easing[];
      /** Animation delay in seconds */
      delay?: number;
      /** Children stagger delay */
      staggerChildren?: number;
    };
    /** Loading animation configuration */
    loading?: {
      /** Animation duration in seconds */
      duration?: number;
      /** Animation easing curve */
      ease?: Easing | Easing[];
      /** Animation delay in seconds */
      delay?: number;
    };
    /** Sections animation configuration */
    sections?: {
      /** Animation duration in seconds */
      duration?: number;
      /** Animation easing curve */
      ease?: Easing | Easing[];
      /** Animation delay in seconds */
      delay?: number;
    };
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom handler for wallet switch */
    onSwitchWallet?: () => void;
    /** Custom handler for network switch */
    onSwitchNetwork?: () => void;
    /** Custom handler for view transactions */
    onViewTransactions?: () => void;
    /** Custom handler for loading state changes */
    onLoadingStateChange?: (isLoading: boolean) => void;
    /** Custom handler for transaction updates */
    onTransactionsUpdate?: (transactions: Transaction[], pendingCount: number) => void;
  };
  /** Child component customizations */
  childCustomizations?: {
    /** Customization for ConnectedModalNameAndBalance component */
    nameAndBalance?: ConnectedModalNameAndBalanceCustomization;
    /** Customization for WalletAvatar component */
    walletAvatar?: Partial<WalletAvatarProps>;
    /** Customization for switch wallet IconButton */
    switchWalletButton?: Partial<IconButtonProps>;
    /** Customization for switch network IconButton */
    switchNetworkButton?: Partial<IconButtonProps>;
  };
  /** Configuration options */
  config?: {
    /** Whether to disable animations */
    disableAnimation?: boolean;
    /** Whether to reduce motion for accessibility */
    reduceMotion?: boolean;
    /** Whether to show loading indicators */
    showLoadingIndicators?: boolean;
    /** Whether to show pending transaction indicators */
    showPendingIndicators?: boolean;
    /** Custom ARIA labels for different states */
    ariaLabels?: {
      container?: string;
      loadingIndicator?: string;
      avatarSection?: string;
      infoSection?: string;
      transactionsSection?: string;
      noTransactions?: string;
    };
  };
};

/**
 * Props for the ConnectedModalMainContent component
 */
export interface ConnectedModalMainContentProps extends Pick<ConnectButtonProps, 'transactionPool' | 'store'> {
  /** List of available chains for the current wallet */
  chainsList: (string | number)[];
  ensAvatar: string | null;
  avatarIsLoading: boolean;
  balanceLoading: boolean;
  ensNameAbbreviated: string | undefined;
  balance: NativeBalanceResult | null;
  /** Additional CSS classes for the container */
  className?: string;
  /** Custom aria-label for the container */
  'aria-label'?: string;
  /** Customization options */
  customization?: ConnectedModalMainContentCustomization;
}

// --- Default Sub-Components ---
const DefaultLoadingIndicator: React.FC<LoadingIndicatorProps> = ({ isLoading, labels, className }) => {
  if (!isLoading) return null;

  return (
    <motion.div
      variants={DEFAULT_LOADING_ANIMATION_VARIANTS}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn('novacon:absolute novacon:right-5 novacon:top-2 novacon:w-5 novacon:h-5', className)}
      role="status"
      aria-label={labels.loading}
    >
      <div className="Toastify__spinner" aria-hidden="true" />
      <span className="novacon:sr-only">{labels.loading}</span>
    </motion.div>
  );
};

const DefaultAvatarSection: React.FC<AvatarSectionProps> = ({
  activeWallet,
  ensAvatar,
  walletName,
  connectorsCount,
  chainsList,
  labels,
  onSwitchWallet,
  onSwitchNetwork,
  className,
}) => {
  return (
    <motion.div
      variants={DEFAULT_AVATAR_SECTION_ANIMATION_VARIANTS}
      className={cn('novacon:mb-6 novacon:relative', className)}
      role="group"
      aria-label={labels.walletControls}
    >
      {/* Wallet Switch Button */}
      <IconButton
        className="novacon:absolute novacon:z-[11] novacon:bottom-[-10px] novacon:left-[-10px]"
        walletIcon={activeWallet.walletIcon}
        walletName={walletName}
        items={connectorsCount}
        onClick={onSwitchWallet}
        aria-label={`${labels.connectWallet} - ${connectorsCount} ${labels.connectWallet.toLowerCase()} available`}
        data-testid="switch-wallet-button"
      />

      {/* Network Switch Button */}
      <IconButton
        className="novacon:absolute novacon:z-[11] novacon:bottom-[-10px] novacon:right-[-10px]"
        walletChainId={activeWallet.chainId}
        items={chainsList.length}
        onClick={onSwitchNetwork}
        aria-label={`${labels.switchNetwork} - ${chainsList.length} ${labels.listOfNetworks.toLowerCase()} available`}
        data-testid="switch-network-button"
      />

      {/* Main Wallet Avatar */}
      <WalletAvatar
        ensAvatar={ensAvatar}
        address={activeWallet.address}
        className="novacon:w-28 novacon:h-28 novacon:sm:w-32 novacon:sm:h-32"
        aria-describedby="wallet-info"
      />
    </motion.div>
  );
};

const DefaultInfoSection: React.FC<InfoSectionProps> = ({
  balanceLoading,
  balance,
  ensNameAbbreviated,
  labels,
  className,
}) => {
  return (
    <motion.div
      variants={DEFAULT_INFO_SECTION_ANIMATION_VARIANTS}
      id="wallet-info"
      className={className}
      role="region"
      aria-label={labels.walletBalance}
    >
      <ConnectedModalNameAndBalance
        balanceLoading={balanceLoading}
        balance={balance}
        ensNameAbbreviated={ensNameAbbreviated}
      />
    </motion.div>
  );
};

const DefaultTransactionsSection: React.FC<TransactionsSectionProps> = ({
  walletTransactions,
  hasPendingTransactions,
  labels,
  onViewTransactions,
  showPendingIndicators = true,
  className,
}) => {
  if (walletTransactions.length === 0) return null;

  return (
    <motion.div
      variants={DEFAULT_TRANSACTIONS_ANIMATION_VARIANTS}
      className={cn(
        'novacon:relative novacon:flex novacon:items-center novacon:justify-center novacon:gap-2',
        className,
      )}
      role="group"
      aria-label={`${labels.transactionsInApp} - ${walletTransactions.length} transactions`}
    >
      <button
        type="button"
        className={standardButtonClasses}
        onClick={onViewTransactions}
        aria-describedby="transaction-count"
        data-testid="view-transactions-button"
      >
        {labels.viewTransactions}

        <span id="transaction-count" className="novacon:sr-only">
          {walletTransactions.length} transactions available
          {hasPendingTransactions && `, ${labels.transactionLoading}`}
        </span>
      </button>

      {/* Pending Transactions Indicator */}
      {showPendingIndicators && (
        <AnimatePresence>
          {hasPendingTransactions && (
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.6, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="novacon:block novacon:absolute novacon:left-[110%] novacon:w-4 novacon:h-4"
              role="status"
              aria-label={labels.transactionLoading}
            >
              <span className="novacon:block Toastify__spinner" aria-hidden="true" />
              <span className="novacon:sr-only">{labels.transactionLoading}</span>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

const DefaultNoTransactionsIndicator: React.FC<NoTransactionsIndicatorProps> = ({ className }) => {
  return (
    <div className={cn('novacon:sr-only', className)} role="status" aria-live="polite">
      No transactions found for this wallet
    </div>
  );
};

/**
 * Main content component for the connected wallet modal with comprehensive customization options.
 *
 * This component displays the primary interface for connected wallet management:
 * - Large wallet avatar with ENS support
 * - Wallet and network switching controls via IconButton components
 * - Loading indicators for avatar and balance states
 * - Transaction history access when transactions are available
 * - Animated pending transaction indicator
 * - Comprehensive customization for all UI elements and behaviors
 * - Animation support with reduced motion options
 * - Custom event handlers for enhanced interactivity
 * - Performance-optimized with memoized calculations
 * - Full customization of child components through parent
 *
 * The component provides full WCAG compliance with proper ARIA labels,
 * semantic HTML structure, and keyboard navigation support.
 *
 * @example Basic usage
 * ```tsx
 * <ConnectedModalMainContent
 *   transactionPool={transactionPool}
 *   chainsList={availableChains}
 *   ensAvatar={ensAvatar}
 *   avatarIsLoading={false}
 *   balanceLoading={false}
 *   ensNameAbbreviated="wallet.eth"
 *   balance={{ value: "1.23", symbol: "ETH" }}
 *   store={store}
 * />
 * ```
 *
 * @example With full customization
 * ```tsx
 * <ConnectedModalMainContent
 *   transactionPool={transactionPool}
 *   chainsList={availableChains}
 *   ensAvatar={ensAvatar}
 *   avatarIsLoading={false}
 *   balanceLoading={false}
 *   ensNameAbbreviated="wallet.eth"
 *   balance={{ value: "1.23", symbol: "ETH" }}
 *   store={store}
 *   customization={{
 *     classNames: {
 *       container: ({ hasActiveWallet }) =>
 *         `custom-container ${hasActiveWallet ? 'has-wallet' : 'no-wallet'}`,
 *       avatarSection: () => "custom-avatar-section",
 *       transactionsSection: ({ transactionsCount }) =>
 *         `transactions-section transactions-count-${transactionsCount}`,
 *     },
 *     components: {
 *       LoadingIndicator: ({ isLoading }) =>
 *         isLoading ? <div className="custom-spinner" /> : null,
 *       AvatarSection: ({ activeWallet, onSwitchWallet }) => (
 *         <div onClick={onSwitchWallet}>Custom Avatar: {activeWallet.address}</div>
 *       ),
 *     },
 *     childCustomizations: {
 *       nameAndBalance: {
 *         classNames: {
 *           container: () => "custom-name-balance-container",
 *         },
 *         components: {
 *           WalletNameDisplay: ({ ensNameAbbreviated }) =>
 *             <h2>{ensNameAbbreviated}</h2>,
 *         },
 *       },
 *       walletAvatar: {
 *         className: "custom-wallet-avatar",
 *       },
 *     },
 *     handlers: {
 *       onSwitchWallet: () => console.log('Custom wallet switch'),
 *       onViewTransactions: () => console.log('Custom view transactions'),
 *       onTransactionsUpdate: (transactions, pendingCount) =>
 *         console.log(`Transactions: ${transactions.length}, Pending: ${pendingCount}`),
 *     },
 *     config: {
 *       showLoadingIndicators: true,
 *       showPendingIndicators: true,
 *       ariaLabels: {
 *         container: 'Wallet management interface',
 *       },
 *     },
 *   }}
 * />
 * ```
 */
export const ConnectedModalMainContent = forwardRef<HTMLDivElement, ConnectedModalMainContentProps>(
  (
    {
      transactionPool,
      chainsList,
      ensAvatar,
      avatarIsLoading,
      balanceLoading,
      ensNameAbbreviated,
      balance,
      store,
      className,
      'aria-label': ariaLabel,
      customization,
      ...props
    },
    ref,
  ) => {
    // Get localized labels for UI text
    const labels = useNovaConnectLabels();
    // Get modal controls and state from hook
    const { setConnectedModalContentType, setIsConnectedModalOpen, setIsConnectModalOpen, activeWallet } =
      useNovaConnect();

    // Get wallet state from store
    const getConnectors = store.getState().getConnectors;

    // Extract custom components and config with stable references
    const customComponents = customization?.components;
    const customConfig = customization?.config;
    const customHandlers = customization?.handlers;

    const {
      LoadingIndicator = DefaultLoadingIndicator,
      AvatarSection = DefaultAvatarSection,
      InfoSection = DefaultInfoSection,
      TransactionsSection = DefaultTransactionsSection,
      NoTransactionsIndicator = DefaultNoTransactionsIndicator,
    } = customComponents ?? {};

    const {
      disableAnimation = false,
      reduceMotion = false,
      showLoadingIndicators = true,
      showPendingIndicators = true,
      ariaLabels,
    } = customConfig ?? {};

    /**
     * Handle wallet switching by closing connected modal and opening connect modal
     * Provides seamless transition between modal views
     */
    const handleSwitchWallet = useCallback(() => {
      if (customHandlers?.onSwitchWallet) {
        customHandlers.onSwitchWallet();
      } else {
        setIsConnectedModalOpen(false);
        setIsConnectModalOpen(true);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customHandlers?.onSwitchWallet, setIsConnectedModalOpen, setIsConnectModalOpen]);

    /**
     * Handle network switching by changing to chains view
     */
    const handleSwitchNetwork = useCallback(() => {
      if (customHandlers?.onSwitchNetwork) {
        customHandlers.onSwitchNetwork();
      } else {
        setConnectedModalContentType('chains');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customHandlers?.onSwitchNetwork, setConnectedModalContentType]);

    /**
     * Handle viewing transactions by changing to transactions view
     */
    const handleViewTransactions = useCallback(() => {
      if (customHandlers?.onViewTransactions) {
        customHandlers.onViewTransactions();
      } else {
        setConnectedModalContentType('transactions');
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customHandlers?.onViewTransactions, setConnectedModalContentType]);

    /**
     * Memoized connectors to prevent unnecessary recalculations
     */
    const connectors = useMemo(() => getConnectors(), [getConnectors]);

    /**
     * Memoized wallet transactions filtered by current wallet address
     * Only includes transactions from the currently connected wallet
     */
    const walletTransactions = useMemo(() => {
      if (!activeWallet || !transactionPool) return [];
      return Object.values(transactionPool).filter(
        (tx) => tx.from.toLowerCase() === activeWallet.address.toLowerCase(),
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeWallet?.address, transactionPool]);

    /**
     * Check if there are pending transactions for loading indicator
     */
    const hasPendingTransactions = useMemo(() => {
      return walletTransactions.some((tx) => tx.pending);
    }, [walletTransactions]);

    /**
     * Get number of available connectors for the current wallet type
     */
    const connectorsCount = useMemo(() => {
      if (!activeWallet) return 0;
      return connectors[getAdapterFromWalletType(activeWallet.walletType)]?.length || 0;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeWallet?.walletType, connectors]);

    /**
     * Get wallet name from wallet type for display
     */
    const walletName = useMemo(() => {
      return activeWallet?.walletType?.split(':')[1] || labels.unknownWallet;
    }, [activeWallet?.walletType, labels.unknownWallet]);

    /**
     * Memoized calculations for state
     */
    const hasActiveWallet = useMemo(() => Boolean(activeWallet?.isConnected), [activeWallet?.isConnected]);
    const isLoading = useMemo(() => avatarIsLoading || balanceLoading, [avatarIsLoading, balanceLoading]);
    const hasTransactions = useMemo(() => walletTransactions.length > 0, [walletTransactions]);

    /**
     * Effect for transaction updates
     */
    const pendingCount = useMemo(() => {
      return walletTransactions.filter((tx) => tx.pending).length;
    }, [walletTransactions]);

    // Call transaction update handler when transactions change
    React.useEffect(() => {
      if (customHandlers?.onTransactionsUpdate) {
        customHandlers.onTransactionsUpdate(walletTransactions, pendingCount);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [walletTransactions, pendingCount, customHandlers?.onTransactionsUpdate]);

    // Call loading state change handler when loading state changes
    React.useEffect(() => {
      if (customHandlers?.onLoadingStateChange) {
        customHandlers.onLoadingStateChange(isLoading);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoading, customHandlers?.onLoadingStateChange]);

    /**
     * Generate container classes with custom generator
     */
    const containerClasses = useMemo(() => {
      if (customization?.classNames?.container) {
        return customization.classNames.container({
          hasActiveWallet,
          isLoading,
          hasTransactions,
          hasPendingTransactions,
        });
      }

      return cn(
        'novacon:flex novacon:flex-col novacon:items-center novacon:justify-center novacon:gap-2 novacon:p-4',
        className,
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      customization?.classNames?.container,
      hasActiveWallet,
      isLoading,
      hasTransactions,
      hasPendingTransactions,
      className,
    ]);

    /**
     * Animation variants
     */
    const containerVariants = customization?.variants?.container || DEFAULT_CONTAINER_ANIMATION_VARIANTS;

    /**
     * Merge container props
     */
    const containerProps = useMemo(
      () => ({
        ...customization?.containerProps,
        ...props,
        ref,
        className: containerClasses,
        role: 'main',
        'aria-label': ariaLabel || ariaLabels?.container || `${labels.walletConnected} - ${walletName}`,
      }),
      [
        customization?.containerProps,
        props,
        ref,
        containerClasses,
        ariaLabel,
        ariaLabels?.container,
        labels.walletConnected,
        walletName,
      ],
    );

    // Early return if no active wallet
    if (!hasActiveWallet || !activeWallet) {
      return null;
    }

    const content = (
      <>
        {/* Loading Indicator */}
        {showLoadingIndicators && (
          <AnimatePresence>
            <LoadingIndicator
              isLoading={isLoading}
              labels={labels}
              className={customization?.classNames?.loadingIndicator?.({ isLoading })}
            />
          </AnimatePresence>
        )}

        {/* Wallet Avatar with Control Buttons */}
        <AvatarSection
          activeWallet={activeWallet}
          ensAvatar={ensAvatar}
          walletName={walletName}
          connectorsCount={connectorsCount}
          chainsList={chainsList}
          labels={labels}
          onSwitchWallet={handleSwitchWallet}
          onSwitchNetwork={handleSwitchNetwork}
          className={customization?.classNames?.avatarSection?.()}
        />

        {/* Wallet Name and Balance */}
        <InfoSection
          balanceLoading={balanceLoading}
          balance={balance}
          ensNameAbbreviated={ensNameAbbreviated}
          labels={labels}
          className={customization?.classNames?.infoSection?.()}
        />

        {/* Transactions Section */}
        <TransactionsSection
          walletTransactions={walletTransactions}
          hasPendingTransactions={hasPendingTransactions}
          labels={labels}
          onViewTransactions={handleViewTransactions}
          showPendingIndicators={showPendingIndicators}
          className={customization?.classNames?.transactionsSection?.({
            transactionsCount: walletTransactions.length,
            hasPendingTransactions,
          })}
        />

        {/* No Transactions State */}
        {walletTransactions.length === 0 && (
          <NoTransactionsIndicator className={customization?.classNames?.noTransactions?.()} />
        )}
      </>
    );

    if (disableAnimation || reduceMotion) {
      return <div {...containerProps}>{content}</div>;
    }

    return (
      <motion.div
        {...containerProps}
        variants={containerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: customization?.animation?.container?.duration ?? 0.4,
          ease: customization?.animation?.container?.ease ?? 'easeOut',
          delay: customization?.animation?.container?.delay ?? 0,
          staggerChildren: customization?.animation?.container?.staggerChildren ?? 0.1,
        }}
      >
        {content}
      </motion.div>
    );
  },
);

ConnectedModalMainContent.displayName = 'ConnectedModalMainContent';
