import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import { formatWalletName, OrbitAdapter } from '@tuwaio/orbit-core';
import { useMemo } from 'react';

import { useNovaConnect } from '../../hooks/useNovaConnect';
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
  const { walletConnectionError } = useNovaConnect();

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
      'novacon:relative novacon:flex novacon:items-center novacon:justify-center',
      'novacon:min-w-[110px] novacon:min-h-[110px] novacon:md:min-w-[150px] novacon:md:min-h-[150px]',
      'novacon:border-2 novacon:rounded-full',
      'novacon:p-4 novacon:md:p-6',
      'novacon:transition-all novacon:duration-300 novacon:ease-in-out',
    ];

    const stateClasses = {
      error: ['novacon:border-[var(--tuwa-error-text)]', 'novacon:bg-[var(--tuwa-error-text)] novacon:bg-opacity-5'],
      success: [
        'novacon:border-[var(--tuwa-success-text)]',
        'novacon:bg-[var(--tuwa-success-text)] novacon:bg-opacity-5',
      ],
      connecting: ['novacon:border-[var(--tuwa-border-primary)]', 'novacon:bg-[var(--tuwa-bg-primary)]'],
    };

    return cn(baseClasses, stateClasses[connectionState]);
  }, [connectionState]);

  /**
   * Generate icon size classes
   */
  const iconSizeClasses = 'novacon:[&_img]:w-[60px]! novacon:[&_img]:h-[auto]! novacon:md:[&_img]:w-[80px]!';

  // Early returns for missing required data
  if (!selectedAdapter || !activeConnector || !currentConnector) {
    return (
      <div
        className="novacon:flex novacon:flex-col novacon:gap-4 novacon:items-center novacon:justify-center novacon:w-full novacon:py-8"
        role="status"
        aria-label={labels.loading}
      >
        <div className="novacon:animate-pulse novacon:rounded-xl novacon:h-32 novacon:w-32 novacon:bg-[var(--tuwa-bg-muted)]" />
        <div className="novacon:animate-pulse novacon:rounded-xl novacon:h-6 novacon:w-48 novacon:bg-[var(--tuwa-bg-muted)]" />
      </div>
    );
  }

  return (
    <section
      className="novacon:flex novacon:flex-col novacon:gap-4 novacon:items-center novacon:justify-center novacon:w-full"
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
              'novacon:absolute novacon:animate-spin novacon:rounded-full novacon:-inset-[2px]',
              'novacon:w-[calc(100%_+_4px)] novacon:h-[calc(100%_+_4px)]',
              'novacon:border-2 novacon:border-[var(--tuwa-pending-text)]',
              'novacon:border-t-transparent',
            )}
            role="progressbar"
            aria-label={labels.connecting}
            aria-describedby="connecting-message"
          >
            <span className="novacon:sr-only">{labels.connecting}</span>
          </div>
        )}

        {/* Success Icon for Connected State */}
        {connectionState === 'success' && (
          <div
            className="novacon:absolute novacon:-top-2 novacon:-right-2 novacon:w-8 novacon:h-8 novacon:rounded-full novacon:bg-[var(--tuwa-success-text)] novacon:flex novacon:items-center novacon:justify-center"
            role="img"
            aria-label={labels.successIcon}
          >
            <CheckCircleIcon className="novacon:w-6 novacon:h-6 novacon:text-white" aria-hidden="true" />
          </div>
        )}

        {/* Error Icon for Error State */}
        {connectionState === 'error' && (
          <div
            className="novacon:absolute novacon:-top-2 novacon:-right-2 novacon:w-8 novacon:h-8 novacon:rounded-full novacon:bg-[var(--tuwa-error-text)] novacon:flex novacon:items-center novacon:justify-center"
            role="img"
            aria-label={labels.errorIcon}
          >
            <ExclamationCircleIcon className="novacon:w-6 novacon:h-6 novacon:text-white" aria-hidden="true" />
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
      <div className="novacon:text-center novacon:space-y-2 novacon:max-w-md">
        <h2
          id="connecting-message"
          className={cn('novacon:text-lg novacon:font-semibold novacon:transition-colors novacon:duration-300', {
            'novacon:text-[var(--tuwa-error-text)]': connectionState === 'error',
            'novacon:text-[var(--tuwa-success-text)]': connectionState === 'success',
            'novacon:text-[var(--tuwa-text-primary)]': connectionState === 'connecting',
          })}
          role="heading"
          aria-level={2}
        >
          {displayMessage}
        </h2>

        {/* Error Details */}
        {errorMessage && (
          <p
            className="novacon:text-sm novacon:text-[var(--tuwa-error-text)] novacon:text-center novacon:leading-relaxed"
            role="alert"
            aria-describedby="connecting-message"
          >
            {errorMessage}
          </p>
        )}

        {/* Additional Error Information */}
        {connectionState === 'error' && showDetailedError && walletConnectionError && (
          <details className="novacon:mt-3 novacon:text-left">
            <summary className="novacon:text-sm novacon:text-[var(--tuwa-text-secondary)] novacon:cursor-pointer novacon:hover:text-[var(--tuwa-text-primary)] novacon:transition-colors">
              {labels.copyRawError}
            </summary>
            <pre className="novacon:mt-2 novacon:p-3 novacon:bg-[var(--tuwa-bg-muted)] novacon:rounded-md novacon:text-xs novacon:font-mono novacon:text-[var(--tuwa-text-secondary)] novacon:overflow-auto novacon:max-h-32">
              {JSON.stringify(walletConnectionError, null, 2)}
            </pre>
          </details>
        )}
      </div>

      {/* Screen Reader Announcements */}
      <div className="novacon:sr-only" aria-live="assertive" role="status">
        {connectionState === 'connecting' && `${labels.connecting} ${activeConnector}`}
        {connectionState === 'success' && `${labels.connectedSuccessfully} ${activeConnector}`}
        {connectionState === 'error' && `${labels.connectionError} ${activeConnector}`}
      </div>

      {/* Hidden Content for Screen Readers */}
      <div className="novacon:sr-only">
        <p>
          Wallet: {activeConnector}, Network: {selectedAdapter}, Status: {connectionState}
        </p>
      </div>
    </section>
  );
}
