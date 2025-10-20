/**
 * @file ConnectedModalTxHistory component with comprehensive customization options for transaction history display.
 */

import { ExclamationTriangleIcon, PuzzlePieceIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import { type Easing, motion, type Variants } from 'framer-motion';
import React, {
  Component,
  ComponentPropsWithoutRef,
  ComponentType,
  forwardRef,
  lazy,
  ReactNode,
  Suspense,
  useCallback,
  useMemo,
} from 'react';

import { useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { ConnectButtonProps } from '../ConnectButton/ConnectButton';

// --- Default Motion Variants ---
const DEFAULT_CONTAINER_ANIMATION_VARIANTS: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
};

const DEFAULT_ERROR_ANIMATION_VARIANTS: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15, ease: 'easeIn' } },
};

// --- Types for Customization ---
type CustomLoadingContainerProps = {
  labels: Record<string, string>;
  className?: string;
};

type CustomErrorContainerProps = {
  className?: string;
};

type CustomNoWalletContainerProps = {
  className?: string;
};

type CustomTransactionsHistoryWrapperProps = {
  children: ReactNode;
  activeWalletAddress: string;
  transactionPool: NonNullable<ConnectButtonProps['transactionPool']>;
  pulsarAdapter: NonNullable<ConnectButtonProps['pulsarAdapter']>;
  labels: Record<string, string>;
  className?: string;
};

/**
 * Customization options for ConnectedModalTxHistory component
 */
export type ConnectedModalTxHistoryCustomization = {
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
    /** Custom loading container component */
    LoadingContainer?: ComponentType<CustomLoadingContainerProps>;
    /** Custom error container component */
    ErrorContainer?: ComponentType<CustomErrorContainerProps>;
    /** Custom no wallet container component */
    NoWalletContainer?: ComponentType<CustomNoWalletContainerProps>;
    /** Custom transactions history wrapper component */
    TransactionsHistoryWrapper?: ComponentType<CustomTransactionsHistoryWrapperProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { hasActiveWallet: boolean; hasValidAdapter: boolean }) => string;
    /** Function to generate loading container classes */
    loadingContainer?: () => string;
    /** Function to generate loading spinner classes */
    loadingSpinner?: () => string;
    /** Function to generate loading text classes */
    loadingText?: () => string;
    /** Function to generate error container classes */
    errorContainer?: () => string;
    /** Function to generate error icon container classes */
    errorIconContainer?: () => string;
    /** Function to generate error icon classes */
    errorIcon?: () => string;
    /** Function to generate error content classes */
    errorContent?: () => string;
    /** Function to generate error title classes */
    errorTitle?: () => string;
    /** Function to generate error description classes */
    errorDescription?: () => string;
    /** Function to generate no wallet container classes */
    noWalletContainer?: () => string;
    /** Function to generate no wallet text classes */
    noWalletText?: () => string;
    /** Function to generate pulsar required container classes */
    pulsarRequiredContainer?: () => string;
    /** Function to generate pulsar required icon container classes */
    pulsarRequiredIconContainer?: () => string;
    /** Function to generate pulsar required icon classes */
    pulsarRequiredIcon?: () => string;
    /** Function to generate pulsar required content classes */
    pulsarRequiredContent?: () => string;
    /** Function to generate pulsar required title classes */
    pulsarRequiredTitle?: () => string;
    /** Function to generate pulsar required description classes */
    pulsarRequiredDescription?: () => string;
    /** Function to generate transactions history wrapper classes */
    transactionsHistoryWrapper?: () => string;
  };
  /** Custom animation variants */
  variants?: {
    /** Container animation variants */
    container?: Variants;
    /** Error animation variants */
    error?: Variants;
    /** Loading animation variants */
    loading?: Variants;
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
    };
    /** Error animation configuration */
    error?: {
      /** Animation duration in seconds */
      duration?: number;
      /** Animation easing curve */
      ease?: Easing | Easing[];
      /** Animation delay in seconds */
      delay?: number;
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
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom handler for error retry actions */
    onErrorRetry?: (error: Error, event: React.MouseEvent<HTMLButtonElement>) => void;
    /** Custom handler for package loading failure */
    onPackageLoadingFailure?: (packageName: string, error: Error) => void;
  };
  /** Configuration options */
  config?: {
    /** Whether to disable animations */
    disableAnimation?: boolean;
    /** Whether to reduce motion for accessibility */
    reduceMotion?: boolean;
    /** Custom package name for error messages */
    packageName?: string;
    /** Custom aria labels for different states */
    ariaLabels?: {
      loading?: string;
      error?: string;
      noWallet?: string;
      pulsarRequired?: string;
      transactionsHistory?: string;
    };
  };
};

/**
 * Props for the ConnectedModalTxHistory component
 */
export interface ConnectedModalTxHistoryProps extends Pick<ConnectButtonProps, 'transactionPool' | 'pulsarAdapter'> {
  /** Additional CSS classes for the container */
  className?: string;
  /** Custom aria-label for the container */
  'aria-label'?: string;
  /** Customization options */
  customization?: ConnectedModalTxHistoryCustomization;
}

/**
 * Lazy import of TransactionsHistory component with error handling
 * This allows the component to work even if the @tuwaio/nova-transactions package is not available
 */
const TransactionsHistory = lazy(() => {
  try {
    return import('@tuwaio/nova-transactions').then((module) => ({
      default: module.TransactionsHistory,
    }));
  } catch (error) {
    console.warn('Failed to load @tuwaio/nova-transactions package:', error);
    // Return a promise that never resolves to trigger error boundary
    return new Promise(() => {});
  }
});

// --- Default Sub-Components ---
const DefaultLoadingContainer: React.FC<CustomLoadingContainerProps> = ({ labels, className }) => {
  return (
    <div
      className={cn(
        'novacon:flex novacon:flex-col novacon:items-center novacon:justify-center novacon:p-8 novacon:gap-4',
        className,
      )}
      role="status"
      aria-live="polite"
    >
      <div className="novacon:animate-spin novacon:rounded-full novacon:h-8 novacon:w-8 novacon:border-2 novacon:border-[var(--tuwa-text-accent)] novacon:border-t-transparent" />
      <p className="novacon:text-sm novacon:text-[var(--tuwa-text-secondary)]">
        {labels.loading} {labels.transactionsInApp.toLowerCase()}...
      </p>
    </div>
  );
};

const DefaultErrorContainer: React.FC<CustomErrorContainerProps> = ({ className }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={cn(
        'novacon:flex novacon:flex-col novacon:items-center novacon:justify-center novacon:text-center novacon:gap-4 novacon:p-6',
        className,
      )}
      role="alert"
      aria-live="assertive"
    >
      <div className="novacon:w-12 novacon:h-12 novacon:p-2 novacon:rounded-full novacon:bg-[var(--tuwa-warning-bg)] novacon:text-[var(--tuwa-warning-text)]">
        <ExclamationTriangleIcon className="novacon:w-full novacon:h-full" />
      </div>

      <div className="novacon:space-y-2">
        <h2 className="novacon:text-lg novacon:font-semibold novacon:text-[var(--tuwa-text-primary)]">
          Transaction History Not Available
        </h2>
        <p className="novacon:text-sm novacon:text-[var(--tuwa-text-secondary)] novacon:max-w-md">
          Transaction history is not supported by this application at the moment. The required package is not installed
          or configured.
        </p>
      </div>
    </motion.div>
  );
};

const DefaultNoWalletContainer: React.FC<CustomNoWalletContainerProps> = ({ className }) => {
  return (
    <div
      className={cn('novacon:flex novacon:flex-col novacon:items-center novacon:justify-center novacon:p-6', className)}
      role="status"
    >
      <p className="novacon:text-sm novacon:text-[var(--tuwa-text-secondary)]">No wallet connected</p>
    </div>
  );
};

const DefaultTransactionsHistoryWrapper: React.FC<CustomTransactionsHistoryWrapperProps> = ({
  children,
  activeWalletAddress,
  labels,
  className,
}) => {
  return (
    <div
      className={cn('novacon:w-full', className)}
      aria-label={`${labels.transactionsInApp} for ${activeWalletAddress}`}
    >
      {children}
    </div>
  );
};

/**
 * Pulsar adapter required fallback component
 */
function PulsarAdapterRequired({
  labels,
  customization,
}: {
  labels: Record<string, string>;
  customization?: ConnectedModalTxHistoryCustomization;
}) {
  const containerClasses =
    customization?.classNames?.pulsarRequiredContainer?.() ??
    'novacon:flex novacon:flex-col novacon:items-center novacon:justify-center novacon:text-center novacon:gap-4 novacon:p-6';
  const iconContainerClasses =
    customization?.classNames?.pulsarRequiredIconContainer?.() ??
    'novacon:w-12 novacon:h-12 novacon:p-2 novacon:rounded-full novacon:bg-gradient-to-r novacon:from-[var(--tuwa-button-gradient-from)] novacon:to-[var(--tuwa-button-gradient-to)] novacon:text-[var(--tuwa-text-on-accent)]';
  const iconClasses = customization?.classNames?.pulsarRequiredIcon?.() ?? 'novacon:w-full novacon:h-full';
  const contentClasses = customization?.classNames?.pulsarRequiredContent?.() ?? 'novacon:space-y-2';
  const titleClasses =
    customization?.classNames?.pulsarRequiredTitle?.() ??
    'novacon:text-lg novacon:font-semibold novacon:text-[var(--tuwa-text-primary)]';
  const descriptionClasses =
    customization?.classNames?.pulsarRequiredDescription?.() ??
    'novacon:text-sm novacon:text-[var(--tuwa-text-secondary)] novacon:max-w-md novacon:leading-relaxed';

  const errorVariants = customization?.variants?.error || DEFAULT_ERROR_ANIMATION_VARIANTS;
  const disableAnimation = customization?.config?.disableAnimation || customization?.config?.reduceMotion;

  const content = (
    <div className={containerClasses} role="alert">
      <div className={iconContainerClasses}>
        <PuzzlePieceIcon className={iconClasses} />
      </div>

      <div className={contentClasses}>
        <h2 className={titleClasses}>{labels.pulsarAdapterRequired}</h2>
        <p className={descriptionClasses}>{labels.pulsarAdapterDescription}</p>
      </div>
    </div>
  );

  if (disableAnimation) {
    return content;
  }

  return (
    <motion.div
      variants={errorVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{
        duration: customization?.animation?.error?.duration ?? 0.2,
        ease: customization?.animation?.error?.ease ?? 'easeOut',
        delay: customization?.animation?.error?.delay ?? 0,
      }}
    >
      {content}
    </motion.div>
  );
}

/**
 * Simple Error Boundary component for handling TransactionsHistory loading errors
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('TransactionsHistory component failed to load:', error, errorInfo);

    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

/**
 * Component for displaying transaction history with comprehensive customization options.
 *
 * This component provides comprehensive transaction history functionality:
 * - Conditional loading of the @tuwaio/nova-transactions package
 * - Graceful fallback when the package is not available
 * - Loading states with proper accessibility support
 * - Error handling for missing configuration
 * - Full WCAG compliance with ARIA labels
 * - Comprehensive customization for all UI elements and behaviors
 * - Animation support with reduced motion options
 * - Custom event handlers for enhanced interactivity
 * - Performance-optimized with memoized calculations
 *
 * The component automatically detects if the required dependencies are available
 * and provides appropriate fallbacks for different scenarios.
 *
 * @example Basic usage
 * ```tsx
 * <ConnectedModalTxHistory
 *   transactionPool={txPool}
 *   pulsarAdapter={adapter}
 *   className="custom-styling"
 * />
 * ```
 *
 * @example With full customization
 * ```tsx
 * <ConnectedModalTxHistory
 *   transactionPool={txPool}
 *   pulsarAdapter={adapter}
 *   customization={{
 *     classNames: {
 *       container: ({ hasActiveWallet }) =>
 *         `custom-container ${hasActiveWallet ? 'has-wallet' : 'no-wallet'}`,
 *       loadingContainer: () => "custom-loading bg-blue-100",
 *       errorContainer: () => "custom-error bg-red-100",
 *     },
 *     components: {
 *       LoadingContainer: ({ className }) =>
 *         <div className={cn("custom-spinner", className)} />,
 *     },
 *     handlers: {
 *       onPackageLoadingFailure: (packageName, error) =>
 *         console.error(`Failed to load ${packageName}:`, error),
 *     },
 *     config: {
 *       packageName: '@custom/transactions',
 *       ariaLabels: {
 *         loading: 'Loading transaction history...',
 *         error: 'Error loading transactions',
 *       },
 *     },
 *     animation: {
 *       container: { duration: 0.3, ease: 'easeOut' },
 *       error: { duration: 0.2, ease: 'easeIn' },
 *     },
 *   }}
 * />
 * ```
 */
export const ConnectedModalTxHistory = forwardRef<HTMLDivElement, ConnectedModalTxHistoryProps>(
  ({ transactionPool, pulsarAdapter, className, 'aria-label': ariaLabel, customization, ...props }, ref) => {
    const labels = useNovaConnectLabels();
    const { activeWallet } = useNovaConnect();

    // Extract custom components and config
    const {
      LoadingContainer = DefaultLoadingContainer,
      ErrorContainer = DefaultErrorContainer,
      NoWalletContainer = DefaultNoWalletContainer,
      TransactionsHistoryWrapper = DefaultTransactionsHistoryWrapper,
    } = customization?.components ?? {};

    const {
      disableAnimation = false,
      reduceMotion = false,
      packageName = '@tuwaio/nova-transactions',
      ariaLabels,
    } = customization?.config ?? {};

    /**
     * Memoized check for active wallet availability
     */
    const hasActiveWallet = useMemo(() => Boolean(activeWallet?.isConnected), [activeWallet?.isConnected]);

    /**
     * Memoized check for adapter availability
     */
    const hasValidAdapter = useMemo(() => Boolean(transactionPool && pulsarAdapter), [transactionPool, pulsarAdapter]);

    /**
     * Generate container classes with custom generator
     */
    const containerClasses = useMemo(() => {
      if (customization?.classNames?.container) {
        return customization.classNames.container({ hasActiveWallet, hasValidAdapter });
      }
      return cn('novacon:flex novacon:flex-col novacon:items-center novacon:justify-center novacon:p-4', className);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.container, hasActiveWallet, hasValidAdapter, className]);

    /**
     * Error handler callbacks
     */
    const handlePackageLoadingFailure = useCallback(
      (error: Error) => {
        if (customization?.handlers?.onPackageLoadingFailure) {
          customization.handlers.onPackageLoadingFailure(packageName, error);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [customization?.handlers?.onPackageLoadingFailure, packageName],
    );

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
        'aria-label': ariaLabel || ariaLabels?.transactionsHistory || `${labels.transactionsInApp}`,
      }),
      [
        customization?.containerProps,
        props,
        ref,
        containerClasses,
        ariaLabel,
        ariaLabels?.transactionsHistory,
        labels.transactionsInApp,
      ],
    );

    /**
     * Loading component with customization
     */
    const loadingComponent = useMemo(
      () => <LoadingContainer labels={labels} className={customization?.classNames?.loadingContainer?.()} />,
      [LoadingContainer, labels, customization?.classNames],
    );

    /**
     * Error fallback component with customization
     */
    const errorComponent = useMemo(
      () => <ErrorContainer className={customization?.classNames?.errorContainer?.()} />,
      [ErrorContainer, customization?.classNames],
    );

    /**
     * No wallet component with customization
     */
    const noWalletComponent = useMemo(
      () => <NoWalletContainer className={customization?.classNames?.noWalletContainer?.()} />,
      [NoWalletContainer, customization?.classNames],
    );

    const content = useMemo(() => {
      // Early return if no active wallet
      if (!hasActiveWallet) {
        return noWalletComponent;
      }

      if (hasValidAdapter && transactionPool && pulsarAdapter) {
        return (
          <Suspense fallback={loadingComponent}>
            <ErrorBoundary fallback={errorComponent} onError={handlePackageLoadingFailure}>
              <TransactionsHistoryWrapper
                activeWalletAddress={activeWallet!.address}
                transactionPool={transactionPool}
                pulsarAdapter={pulsarAdapter}
                labels={labels}
                className={customization?.classNames?.transactionsHistoryWrapper?.()}
              >
                <TransactionsHistory
                  transactionsPool={transactionPool}
                  adapter={pulsarAdapter}
                  connectedWalletAddress={activeWallet!.address}
                  className="novacon:w-full"
                />
              </TransactionsHistoryWrapper>
            </ErrorBoundary>
          </Suspense>
        );
      }

      return <PulsarAdapterRequired labels={labels} customization={customization} />;
    }, [
      hasActiveWallet,
      hasValidAdapter,
      transactionPool,
      pulsarAdapter,
      activeWallet,
      noWalletComponent,
      loadingComponent,
      errorComponent,
      handlePackageLoadingFailure,
      TransactionsHistoryWrapper,
      labels,
      customization,
    ]);

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
          duration: customization?.animation?.container?.duration ?? 0.3,
          ease: customization?.animation?.container?.ease ?? 'easeOut',
          delay: customization?.animation?.container?.delay ?? 0,
        }}
      >
        {content}
      </motion.div>
    );
  },
);

ConnectedModalTxHistory.displayName = 'ConnectedModalTxHistory';
