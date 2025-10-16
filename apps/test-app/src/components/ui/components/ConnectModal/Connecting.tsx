import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import { formatWalletName, OrbitAdapter } from '@tuwaio/orbit-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { WalletIcon } from '../WalletIcon';
import { GroupedConnector } from './ConnectModal';

/**
 * Connection status component props interface
 * Defines the required data for displaying wallet connection progress
 */
interface ConnectingProps {
  /** Currently active connector identifier */
  activeConnector: string | undefined;
  /** Selected orbit adapter for the connection */
  selectedAdapter: OrbitAdapter | undefined;
  /** Array of available wallet connectors */
  connectors: GroupedConnector[];
  /** Whether the wallet connection is successfully established */
  isConnected: boolean;
  /** Optional custom error message to display */
  customErrorMessage?: string;
  /** Whether to show detailed error information */
  showDetailedError?: boolean;
}

/**
 * Connection status display component for wallet connection flow
 *
 * This component provides comprehensive visual feedback during wallet connection:
 * - Animated loading spinner for connection in progress
 * - Success state with checkmark icon for completed connections
 * - Error state with warning icon and detailed error messages
 * - Fully internationalized text content with translation support
 * - WCAG compliant accessibility with proper ARIA labels and live regions
 * - Responsive design that adapts to different screen sizes
 * - Visual status indicators with semantic colors and icons
 * - Screen reader announcements for state changes
 *
 * The component automatically detects connection state and displays appropriate
 * visual feedback with proper semantic markup for accessibility tools.
 *
 * @param activeConnector - Identifier of the currently connecting wallet
 * @param selectedAdapter - Orbit adapter instance for the connection
 * @param connectors - Array of available wallet connector options
 * @param isConnected - Boolean flag indicating successful connection
 * @param customErrorMessage - Optional custom error message override
 * @param showDetailedError - Flag to show detailed error information
 * @returns JSX element displaying connection status with visual feedback
 *
 * @example
 * ```tsx
 * <Connecting
 *   activeConnector="metamask"
 *   selectedAdapter={ethereumAdapter}
 *   connectors={availableConnectors}
 *   isConnected={false}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom error handling
 * <Connecting
 *   activeConnector="walletconnect"
 *   selectedAdapter={polygonAdapter}
 *   connectors={connectors}
 *   isConnected={false}
 *   customErrorMessage="Custom connection error occurred"
 *   showDetailedError={true}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Successful connection state
 * <Connecting
 *   activeConnector="phantom"
 *   selectedAdapter={solanaAdapter}
 *   connectors={solanaConnectors}
 *   isConnected={true}
 * />
 * ```
 *
 * @public
 */
export function Connecting({
  activeConnector,
  selectedAdapter,
  connectors,
  isConnected,
  customErrorMessage,
  showDetailedError = false,
}: ConnectingProps) {
  const labels = useNovaConnectLabels();
  const walletConnectionError = useSatelliteConnectStore((store) => store.walletConnectionError);

  /**
   * Find the current connector configuration
   * Memoized for performance optimization
   */
  const currentConnector = useMemo(() => {
    if (!activeConnector) return null;
    return connectors.find((connector) => formatWalletName(connector.name) === activeConnector);
  }, [connectors, activeConnector]);

  /**
   * Determine current connection state
   * Memoized to prevent unnecessary re-renders
   */
  const connectionState = useMemo(() => {
    if (walletConnectionError || customErrorMessage) return 'error';
    if (isConnected) return 'success';
    return 'connecting';
  }, [walletConnectionError, customErrorMessage, isConnected]);

  /**
   * Generate display message based on current state
   */
  const displayMessage = useMemo(() => {
    switch (connectionState) {
      case 'error':
        return customErrorMessage || labels.connectionError;
      case 'success':
        return labels.connectedSuccessfully;
      case 'connecting':
      default:
        return activeConnector ? `${labels.connectingTo} ${activeConnector}...` : labels.connectingEllipsis;
    }
  }, [connectionState, customErrorMessage, labels, activeConnector]);

  /**
   * Generate error message for display
   */
  const errorMessage = useMemo(() => {
    if (connectionState !== 'error') return null;

    if (customErrorMessage && showDetailedError) {
      return customErrorMessage;
    }

    return labels.cannotConnectWallet;
  }, [connectionState, customErrorMessage, showDetailedError, labels]);

  /**
   * Generate container classes based on connection state
   */
  const containerClasses = useMemo(() => {
    const baseClasses = [
      'relative flex items-center justify-center',
      'min-w-[110px] min-h-[110px] md:min-w-[150px] md:min-h-[150px]',
      'border-2 rounded-full',
      'p-4 md:p-6',
      'transition-all duration-300 ease-in-out',
    ];

    const stateClasses = {
      error: ['border-[var(--tuwa-error-text)]', 'bg-[var(--tuwa-error-text)] bg-opacity-5'],
      success: ['border-[var(--tuwa-success-text)]', 'bg-[var(--tuwa-success-text)] bg-opacity-5'],
      connecting: ['border-[var(--tuwa-border-primary)]', 'bg-[var(--tuwa-bg-primary)]'],
    };

    return cn(baseClasses, stateClasses[connectionState]);
  }, [connectionState]);

  /**
   * Generate icon size classes
   */
  const iconSizeClasses = '[&_img]:!w-[60px] [&_img]:h-[auto] md:[&_img]:!w-[80px]';

  // Early returns for missing required data
  if (!selectedAdapter || !activeConnector || !currentConnector) {
    return (
      <div
        className="flex flex-col gap-4 items-center justify-center w-full py-8"
        role="status"
        aria-label={labels.loading}
      >
        <div className="animate-pulse rounded-xl h-32 w-32 bg-[var(--tuwa-bg-muted)]" />
        <div className="animate-pulse rounded-xl h-6 w-48 bg-[var(--tuwa-bg-muted)]" />
      </div>
    );
  }

  return (
    <section
      className="flex flex-col gap-4 items-center justify-center w-full"
      role="status"
      aria-label={`Connection status: ${displayMessage}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Connection Status Container */}
      <div className={containerClasses}>
        {/* Loading Spinner for Connecting State */}
        {connectionState === 'connecting' && (
          <div
            className={cn(
              'absolute animate-spin rounded-full -inset-[2px]',
              'w-[calc(100%_+_4px)] h-[calc(100%_+_4px)]',
              'border-2 border-[var(--tuwa-pending-text)]',
              'border-t-transparent',
            )}
            role="progressbar"
            aria-label={labels.connecting}
            aria-describedby="connecting-message"
          >
            <span className="sr-only">{labels.connecting}</span>
          </div>
        )}

        {/* Success Icon for Connected State */}
        {connectionState === 'success' && (
          <div
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--tuwa-success-text)] flex items-center justify-center"
            role="img"
            aria-label={labels.successIcon}
          >
            <CheckCircleIcon className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
        )}

        {/* Error Icon for Error State */}
        {connectionState === 'error' && (
          <div
            className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-[var(--tuwa-error-text)] flex items-center justify-center"
            role="img"
            aria-label={labels.errorIcon}
          >
            <ExclamationCircleIcon className="w-6 h-6 text-white" aria-hidden="true" />
          </div>
        )}

        {/* Wallet Icon */}
        <div className={iconSizeClasses}>
          <WalletIcon
            icon={currentConnector.icon}
            name={activeConnector}
            altText={`${activeConnector} ${labels.walletIcon}`}
            showLoading={connectionState === 'connecting'}
          />
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center space-y-2 max-w-md">
        <h2
          id="connecting-message"
          className={cn('text-lg font-semibold transition-colors duration-300', {
            'text-[var(--tuwa-error-text)]': connectionState === 'error',
            'text-[var(--tuwa-success-text)]': connectionState === 'success',
            'text-[var(--tuwa-text-primary)]': connectionState === 'connecting',
          })}
          role="heading"
          aria-level={2}
        >
          {displayMessage}
        </h2>

        {/* Error Details */}
        {errorMessage && (
          <p
            className="text-sm text-[var(--tuwa-error-text)] text-center leading-relaxed"
            role="alert"
            aria-describedby="connecting-message"
          >
            {errorMessage}
          </p>
        )}

        {/* Additional Error Information */}
        {connectionState === 'error' && showDetailedError && walletConnectionError && (
          <details className="mt-3 text-left">
            <summary className="text-sm text-[var(--tuwa-text-secondary)] cursor-pointer hover:text-[var(--tuwa-text-primary)] transition-colors">
              {labels.copyRawError}
            </summary>
            <pre className="mt-2 p-3 bg-[var(--tuwa-bg-muted)] rounded-md text-xs font-mono text-[var(--tuwa-text-secondary)] overflow-auto max-h-32">
              {JSON.stringify(walletConnectionError, null, 2)}
            </pre>
          </details>
        )}
      </div>

      {/* Screen Reader Announcements */}
      <div className="sr-only" aria-live="assertive" role="status">
        {connectionState === 'connecting' && `${labels.connecting} ${activeConnector}`}
        {connectionState === 'success' && `${labels.connectedSuccessfully} ${activeConnector}`}
        {connectionState === 'error' && `${labels.connectionError} ${activeConnector}`}
      </div>

      {/* Hidden Content for Screen Readers */}
      <div className="sr-only">
        <p>
          Wallet: {activeConnector}, Network: {selectedAdapter}, Status: {connectionState}
        </p>
      </div>
    </section>
  );
}
