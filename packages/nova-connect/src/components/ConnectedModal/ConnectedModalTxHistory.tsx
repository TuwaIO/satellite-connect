import { ExclamationTriangleIcon, PuzzlePieceIcon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { Component, lazy, Suspense, useMemo } from 'react';

import { useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { ConnectButtonProps } from '../ConnectButton';

/**
 * Props for the ConnectedModalTxHistory component
 */
interface ConnectedModalTxHistoryProps extends Pick<ConnectButtonProps, 'transactionPool' | 'pulsarAdapter'> {
  /** Additional CSS classes for the container */
  className?: string;
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

/**
 * Loading component for transaction history
 */
function TransactionHistoryLoading() {
  const labels = useNovaConnectLabels();

  return (
    <div className="flex flex-col items-center justify-center p-8 gap-4" role="status">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-[var(--tuwa-text-accent)] border-t-transparent" />
      <p className="text-sm text-[var(--tuwa-text-secondary)]">
        {labels.loading} {labels.transactionsInApp.toLowerCase()}...
      </p>
    </div>
  );
}

/**
 * Error fallback component when TransactionsHistory fails to load
 */
function TransactionHistoryError() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center text-center gap-4 p-6"
      role="alert"
    >
      <div className="w-12 h-12 p-2 rounded-full bg-[var(--tuwa-warning-bg)] text-[var(--tuwa-warning-text)]">
        <ExclamationTriangleIcon className="w-full h-full" />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[var(--tuwa-text-primary)]">Transaction History Not Available</h2>
        <p className="text-sm text-[var(--tuwa-text-secondary)] max-w-md">
          Transaction history is not supported by this application at the moment. The required package is not installed
          or configured.
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Pulsar adapter required fallback component
 */
function PulsarAdapterRequired() {
  const labels = useNovaConnectLabels();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center text-center gap-4 p-6"
      role="alert"
    >
      <div className="w-12 h-12 p-2 rounded-full bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)] text-[var(--tuwa-text-on-accent)]">
        <PuzzlePieceIcon className="w-full h-full" />
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-[var(--tuwa-text-primary)]">{labels.pulsarAdapterRequired}</h2>
        <p className="text-sm text-[var(--tuwa-text-secondary)] max-w-md leading-relaxed">
          {labels.pulsarAdapterDescription}
        </p>
      </div>
    </motion.div>
  );
}

/**
 * Component for displaying transaction history with conditional loading
 *
 * This component provides comprehensive transaction history functionality:
 * - Conditional loading of the @tuwaio/nova-transactions package
 * - Graceful fallback when the package is not available
 * - Loading states with proper accessibility support
 * - Error handling for missing configuration
 * - Full WCAG compliance with ARIA labels
 *
 * The component automatically detects if the required dependencies are available
 * and provides appropriate fallbacks for different scenarios.
 *
 * @param props - Component props including transaction pool and adapter configuration
 * @returns JSX element displaying transaction history or appropriate fallback
 *
 * @example
 * ```tsx
 * <ConnectedModalTxHistory
 *   transactionPool={txPool}
 *   pulsarAdapter={adapter}
 *   className="custom-styling"
 * />
 * ```
 *
 * @public
 */
export function ConnectedModalTxHistory({ transactionPool, pulsarAdapter, className }: ConnectedModalTxHistoryProps) {
  const labels = useNovaConnectLabels();
  const { activeWallet } = useNovaConnect();

  /**
   * Memoized container classes for better performance
   */
  const containerClasses = useMemo(
    () => `flex flex-col items-center justify-center p-4 ${className || ''}`.trim(),
    [className],
  );

  /**
   * Memoized check for adapter availability
   */
  const hasValidAdapter = useMemo(() => Boolean(transactionPool && pulsarAdapter), [transactionPool, pulsarAdapter]);

  // Early return if no active wallet
  if (!activeWallet) {
    return (
      <div className={containerClasses}>
        <p className="text-sm text-[var(--tuwa-text-secondary)]">No wallet connected</p>
      </div>
    );
  }

  return (
    <div className={containerClasses}>
      {hasValidAdapter ? (
        <Suspense fallback={<TransactionHistoryLoading />}>
          <ErrorBoundary fallback={<TransactionHistoryError />}>
            <TransactionsHistory
              transactionsPool={transactionPool!}
              adapter={pulsarAdapter!}
              connectedWalletAddress={activeWallet.address}
              className="w-full"
              aria-label={`${labels.transactionsInApp} for ${activeWallet.address}`}
            />
          </ErrorBoundary>
        </Suspense>
      ) : (
        <PulsarAdapterRequired />
      )}
    </div>
  );
}

/**
 * Simple Error Boundary component for handling TransactionsHistory loading errors
 */
interface ErrorBoundaryState {
  hasError: boolean;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback: React.ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('TransactionsHistory component failed to load:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}
