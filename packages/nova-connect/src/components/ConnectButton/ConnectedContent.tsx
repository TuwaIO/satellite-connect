/**
 * @file ConnectedContent component displays wallet connection status with transaction monitoring and comprehensive customization options.
 */

import { ChevronArrowWithAnim, cn } from '@tuwaio/nova-core';
import { Transaction, TransactionStatus } from '@tuwaio/pulsar-core';
import React, {
  ComponentPropsWithoutRef,
  ComponentType,
  forwardRef,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';

import { useGetWalletNameAndAvatar, useWalletNativeBalance } from '../../hooks';
import { ButtonTxStatus, useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { WalletAvatar, WalletAvatarCustomization } from '../WalletAvatar';
import { ConnectButtonProps } from './ConnectButton';
import { StatusIcon, type StatusIconCustomization } from './StatusIcon';

// --- Types for Customization ---
type StatusDisplayData = {
  displayName: ReactNode;
  avatarIcon: ReactNode;
  ariaLabel: string;
};

type CustomBalanceContainerProps = {
  formattedBalance: string;
  labels: Record<string, string>;
  className?: string;
  'aria-label'?: string;
};

type CustomMainContentProps = {
  statusDisplay: StatusDisplayData;
  connectedButtonStatus: ButtonTxStatus;
  isConnectedModalOpen: boolean;
  withBalance: boolean;
  labels: Record<string, string>;
  className?: string;
};

type CustomLoadingAnimationProps = {
  connectedButtonStatus: ButtonTxStatus;
  className?: string;
};

type CustomBalanceDividerProps = {
  className?: string;
};

/**
 * Customization options for ConnectedContent component
 */
export type ConnectedContentCustomization = {
  /** Override root container props */
  containerProps?: Partial<ComponentPropsWithoutRef<'div'>>;
  /** Custom components */
  components?: {
    /** Custom balance container component */
    BalanceContainer?: ComponentType<CustomBalanceContainerProps>;
    /** Custom main content wrapper component */
    MainContent?: ComponentType<CustomMainContentProps>;
    /** Custom loading animation component */
    LoadingAnimation?: ComponentType<CustomLoadingAnimationProps>;
    /** Custom balance divider component */
    BalanceDivider?: ComponentType<CustomBalanceDividerProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { connectedButtonStatus: ButtonTxStatus; withBalance: boolean }) => string;
    /** Function to generate balance container classes */
    balanceContainer?: (params: { formattedBalance: string }) => string;
    /** Function to generate balance text classes */
    balanceText?: (params: { formattedBalance: string }) => string;
    /** Function to generate balance divider classes */
    balanceDivider?: () => string;
    /** Function to generate main content classes */
    mainContent?: (params: { withBalance: boolean }) => string;
    /** Function to generate loading animation classes */
    loadingAnimation?: (params: { connectedButtonStatus: ButtonTxStatus }) => string;
  };
  /** Customization options for child components */
  childCustomizations?: {
    /** WalletAvatar customization for idle and loading states */
    walletAvatar?: WalletAvatarCustomization;
    /** StatusIcon customization for transaction states */
    statusIcon?: {
      /** StatusIcon customization for success state */
      succeed?: StatusIconCustomization;
      /** StatusIcon customization for failed state */
      failed?: StatusIconCustomization;
      /** StatusIcon customization for replaced state */
      replaced?: StatusIconCustomization;
    };
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom handler for balance click events */
    onBalanceClick?: (formattedBalance: string, event: React.MouseEvent<HTMLDivElement>) => void;
  };
  /** Configuration options */
  config?: {
    /** Custom timeout for auto-reset status (in milliseconds) */
    statusResetTimeout?: number;
    /** Whether to show loading animation */
    showLoadingAnimation?: boolean;
    /** Whether to show balance divider */
    showBalanceDivider?: boolean;
  };
};

export interface ConnectedContentProps extends Pick<ConnectButtonProps, 'transactionPool' | 'store' | 'withBalance'> {
  /** Custom CSS classes for the container */
  className?: string;
  /** Custom aria-label for the container */
  'aria-label'?: string;
  /** Customization options */
  customization?: ConnectedContentCustomization;
}

// --- Default Sub-Components ---
const DefaultBalanceContainer = ({ formattedBalance, labels, className, ...props }: CustomBalanceContainerProps) => {
  return (
    <div
      className={cn(
        'novacon:relative novacon:hidden novacon:sm:flex novacon:items-center novacon:pr-2 novacon:gap-2 novacon:text-[var(--tuwa-text-secondary)]',
        className,
      )}
      role="text"
      aria-label={`${labels.walletBalance}: ${formattedBalance}`}
      {...props}
    >
      <span className="novacon:font-semibold novacon:mr-1" aria-hidden="true">
        {formattedBalance}
      </span>
    </div>
  );
};

const DefaultMainContent = ({
  statusDisplay,
  isConnectedModalOpen,
  withBalance,
  className,
}: CustomMainContentProps) => {
  return (
    <div
      className={cn(
        'novacon:flex novacon:items-center novacon:space-x-2',
        { 'novacon:sm:pl-2': withBalance },
        className,
      )}
    >
      {statusDisplay.avatarIcon}
      <span className="novacon:text-[var(--tuwa-text-primary)] novacon:font-medium novacon:hidden novacon:min-[480px]:block">
        {statusDisplay.displayName}
      </span>
      <div aria-hidden="true">
        <ChevronArrowWithAnim isOpen={isConnectedModalOpen} className="novacon:xs:hidden" />
      </div>
    </div>
  );
};

const DefaultLoadingAnimation = ({ connectedButtonStatus, className }: CustomLoadingAnimationProps) => {
  if (connectedButtonStatus !== 'loading') return null;

  return (
    <div
      className={cn(
        "novacon:w-full novacon:h-full novacon:rounded-full novacon:absolute novacon:inset-0 novacon:before:content-[''] novacon:after:content-[''] novacon:before:rounded-full novacon:after:rounded-full novacon:before:absolute novacon:after:absolute novacon:before:inset-0 novacon:after:inset-0 novacon:before:u-shadow-inner-base novacon:after:u-shadow-inset-arc novacon:after:animate-rotate novacon:after:duration-2000 novacon:after:ease-linear novacon:after:infinite",
        className,
      )}
      aria-hidden="true"
    />
  );
};

const DefaultBalanceDivider = ({ className }: CustomBalanceDividerProps) => {
  return (
    <div
      className={cn(
        'novacon:absolute novacon:top-1/2 novacon:right-0 novacon:transform novacon:-translate-y-1/2 novacon:h-4 novacon:w-[1px] novacon:bg-[var(--tuwa-border-primary)]',
        className,
      )}
      aria-hidden="true"
    />
  );
};

/**
 * ConnectedContent displays the wallet connection status with transaction monitoring capabilities.
 * Provides comprehensive customization for all visual elements, event handlers, and child components.
 *
 * Features:
 * - Real-time transaction status monitoring with visual feedback
 * - Comprehensive customization for all UI elements and behaviors
 * - Full accessibility support with ARIA labels and roles
 * - Responsive design with mobile-first approach
 * - Status-based styling and animations
 * - Balance display with optional divider
 * - Loading animation for pending transactions
 * - Customizable child components (WalletAvatar, StatusIcon)
 * - Event handler customization for enhanced interactivity
 * - Auto-reset functionality for transaction status
 *
 * @example Basic usage
 * ```tsx
 * <ConnectedContent
 *   transactionPool={transactionPool}
 *   withBalance={true}
 *   store={walletStore}
 * />
 * ```
 *
 * @example With full customization
 * ```tsx
 * <ConnectedContent
 *   transactionPool={transactionPool}
 *   withBalance={true}
 *   store={walletStore}
 *   customization={{
 *     classNames: {
 *       container: ({ connectedButtonStatus }) =>
 *         `custom-container ${connectedButtonStatus === 'loading' ? 'loading' : ''}`,
 *       balanceContainer: () => "custom-balance bg-blue-500",
 *     },
 *     components: {
 *       LoadingAnimation: ({ className }) =>
 *         <div className={cn("custom-spinner", className)} />,
 *     },
 *     handlers: {
 *       onBalanceClick: (balance, event) => console.log("Balance clicked:", balance),
 *     },
 *     config: {
 *       statusResetTimeout: 3000,
 *       showLoadingAnimation: true,
 *     },
 *     childCustomizations: {
 *       walletAvatar: {
 *         classNames: {
 *           container: () => "custom-avatar-border",
 *         },
 *       },
 *       statusIcon: {
 *         succeed: {
 *           classNames: {
 *             container: () => "custom-success-icon",
 *           },
 *         },
 *         failed: {
 *           classNames: {
 *             container: () => "custom-error-icon",
 *           },
 *         },
 *       },
 *     },
 *   }}
 * />
 * ```
 */
export const ConnectedContent = forwardRef<HTMLDivElement, ConnectedContentProps>(
  ({ transactionPool, withBalance, store, className, 'aria-label': ariaLabel, customization, ...props }, ref) => {
    const labels = useNovaConnectLabels();

    const { isConnectedModalOpen, setConnectedButtonStatus, connectedButtonStatus, activeWallet } = useNovaConnect();

    const { ensAvatar, ensNameAbbreviated } = useGetWalletNameAndAvatar({
      activeWallet,
      store,
      abbreviateSymbols: 6,
      maxNameLength: 30,
      autoRetry: false,
      retryDelay: 3000,
    });

    const { balance } = useWalletNativeBalance({ store, activeWallet });

    const formattedBalance = balance?.value ? parseFloat(balance.value).toFixed(3) : '0.000';

    const prevTxPoolRef = useRef<Transaction[]>(
      Object.values(transactionPool ?? {}).filter(
        (tx) => tx.from.toLowerCase() === activeWallet?.address.toLowerCase(),
      ),
    );

    // Extract custom components and config
    const {
      BalanceContainer = DefaultBalanceContainer,
      MainContent = DefaultMainContent,
      LoadingAnimation = DefaultLoadingAnimation,
      BalanceDivider = DefaultBalanceDivider,
    } = customization?.components ?? {};

    const {
      statusResetTimeout = 2000,
      showLoadingAnimation = true,
      showBalanceDivider = true,
    } = customization?.config ?? {};

    // Reset status on mount and cleanup
    useEffect(() => {
      setConnectedButtonStatus('idle');
      return () => setConnectedButtonStatus('idle');
    }, [setConnectedButtonStatus]);

    // Monitor transaction pool changes
    useEffect(() => {
      if (!activeWallet || !activeWallet?.isConnected) {
        return;
      }

      const currentPool =
        Object.values(transactionPool ?? {}).filter(
          (tx) => tx.from.toLowerCase() === activeWallet?.address.toLowerCase(),
        ) || [];
      const prevPool = prevTxPoolRef.current || [];
      let newStatus: ButtonTxStatus = 'idle';

      const isAnyTxLoading = currentPool.some((tx) => tx.pending);

      if (isAnyTxLoading) {
        newStatus = 'loading';
      } else {
        for (const currentTx of currentPool) {
          const prevTx = prevPool.find((tx) => tx.txKey === currentTx.txKey);

          if (currentTx.status && currentTx.status !== prevTx?.status) {
            switch (currentTx.status) {
              case TransactionStatus.Success:
                newStatus = 'succeed';
                break;
              case TransactionStatus.Replaced:
                newStatus = 'replaced';
                break;
              case TransactionStatus.Failed:
                newStatus = 'failed';
                break;
            }
          }
        }
      }

      if (newStatus === 'loading' || newStatus !== 'idle') {
        setConnectedButtonStatus(newStatus);
      }

      prevTxPoolRef.current = currentPool;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactionPool, activeWallet?.address, activeWallet?.isConnected, setConnectedButtonStatus]);

    // Auto-reset status after showing success/error states
    useEffect(() => {
      if (['succeed', 'failed', 'replaced'].includes(connectedButtonStatus)) {
        const timer = setTimeout(() => {
          setConnectedButtonStatus('idle');
        }, statusResetTimeout);
        return () => clearTimeout(timer);
      }
    }, [connectedButtonStatus, statusResetTimeout, setConnectedButtonStatus]);

    // Get status-specific aria label
    const getStatusAriaLabel = useCallback(
      (status: ButtonTxStatus) => {
        switch (status) {
          case 'succeed':
            return labels.transactionSuccess;
          case 'failed':
            return labels.transactionError;
          case 'replaced':
            return labels.transactionReplaced;
          case 'loading':
            return labels.transactionLoading;
          default:
            return labels.walletAddress;
        }
      },
      [labels],
    );

    // Memoized status display configuration
    const statusDisplay = useMemo(() => {
      if (!activeWallet) return { displayName: null, avatarIcon: null, ariaLabel: '' };

      const baseAriaLabel = `${labels.transactionStatus}: ${getStatusAriaLabel(connectedButtonStatus)}`;

      switch (connectedButtonStatus) {
        case 'succeed':
          return {
            displayName: labels.success,
            avatarIcon: (
              <StatusIcon
                txStatus="succeed"
                colorVar="success"
                aria-label={labels.transactionSuccess}
                customization={customization?.childCustomizations?.statusIcon?.succeed}
              >
                m4.5 12.75 6 6 9-13.5
              </StatusIcon>
            ),
            ariaLabel: baseAriaLabel,
          };
        case 'failed':
          return {
            displayName: labels.error,
            avatarIcon: (
              <StatusIcon
                txStatus="failed"
                colorVar="error"
                aria-label={labels.transactionError}
                customization={customization?.childCustomizations?.statusIcon?.failed}
              >
                M6 18 18 6M6 6l12 12
              </StatusIcon>
            ),
            ariaLabel: baseAriaLabel,
          };
        case 'replaced':
          return {
            displayName: labels.replaced,
            avatarIcon: (
              <StatusIcon
                txStatus="replaced"
                colorVar="text"
                aria-label={labels.transactionReplaced}
                customization={customization?.childCustomizations?.statusIcon?.replaced}
              >
                M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0
                13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99
              </StatusIcon>
            ),
            ariaLabel: baseAriaLabel,
          };
        case 'loading':
          return {
            displayName: ensNameAbbreviated,
            avatarIcon: (
              <div className="novacon:relative novacon:p-1">
                {showLoadingAnimation && (
                  <LoadingAnimation
                    connectedButtonStatus={connectedButtonStatus}
                    className={customization?.classNames?.loadingAnimation?.({ connectedButtonStatus })}
                  />
                )}
                <WalletAvatar
                  address={activeWallet?.address}
                  ensAvatar={ensAvatar}
                  className="novacon:relative novacon:z-2"
                  aria-label={`${labels.walletAvatar}: ${ensNameAbbreviated}`}
                  customization={customization?.childCustomizations?.walletAvatar}
                />
              </div>
            ),
            ariaLabel: `${labels.transactionLoading}. ${labels.walletAddress}: ${ensNameAbbreviated}`,
          };
        case 'idle':
        default:
          return {
            displayName: ensNameAbbreviated,
            avatarIcon: (
              <WalletAvatar
                address={activeWallet?.address}
                ensAvatar={ensAvatar}
                className="novacon:relative novacon:z-2"
                aria-label={`${labels.walletAvatar}: ${ensNameAbbreviated}`}
                customization={customization?.childCustomizations?.walletAvatar}
              />
            ),
            ariaLabel: `${labels.walletAddress}: ${ensNameAbbreviated}`,
          };
      }
    }, [
      connectedButtonStatus,
      ensNameAbbreviated,
      activeWallet,
      ensAvatar,
      labels,
      getStatusAriaLabel,
      customization,
      showLoadingAnimation,
      LoadingAnimation,
    ]);

    // Event handlers
    const handleBalanceClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        if (customization?.handlers?.onBalanceClick) {
          customization?.handlers?.onBalanceClick(formattedBalance, event);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [customization?.handlers?.onBalanceClick, formattedBalance],
    );

    // Generate container classes
    const containerClasses = useMemo(() => {
      if (customization?.classNames?.container) {
        return customization.classNames.container({ connectedButtonStatus, withBalance: Boolean(withBalance) });
      }
      return cn('novacon:flex novacon:items-center novacon:gap-2 novacon:sm:gap-3', className);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.container, connectedButtonStatus, withBalance, className]);

    // Merge container props
    const containerProps = useMemo(
      () => ({
        ...customization?.containerProps,
        ...props,
        ref,
        className: containerClasses,
        role: 'status',
        'aria-live': 'polite' as const,
        'aria-label': ariaLabel || statusDisplay.ariaLabel,
      }),
      [customization, props, ref, containerClasses, ariaLabel, statusDisplay.ariaLabel],
    );

    if (!activeWallet) return null;

    return (
      <div {...containerProps}>
        {/* Balance Display */}
        {withBalance && (
          <div onClick={handleBalanceClick}>
            <BalanceContainer
              formattedBalance={formattedBalance}
              labels={labels}
              className={customization?.classNames?.balanceContainer?.({ formattedBalance })}
            />
            {showBalanceDivider && <BalanceDivider className={customization?.classNames?.balanceDivider?.()} />}
          </div>
        )}

        {/* Main Content */}
        <MainContent
          statusDisplay={statusDisplay}
          connectedButtonStatus={connectedButtonStatus}
          isConnectedModalOpen={isConnectedModalOpen}
          withBalance={Boolean(withBalance)}
          labels={labels}
          className={customization?.classNames?.mainContent?.({ withBalance: Boolean(withBalance) })}
        />
      </div>
    );
  },
);

ConnectedContent.displayName = 'ConnectedContent';
