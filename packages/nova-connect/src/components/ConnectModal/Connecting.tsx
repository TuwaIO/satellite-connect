/**
 * @file Connecting component with comprehensive customization options and connection status display.
 */

import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import { formatWalletName, OrbitAdapter } from '@tuwaio/orbit-core';
import React, { ComponentType, forwardRef, memo, useEffect, useMemo, useRef } from 'react';

import { useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { WalletIcon } from '../WalletIcon';
import { GroupedConnector } from './ConnectModal';

// --- Types ---

/**
 * Connection states
 */
export type ConnectionState = 'connecting' | 'success' | 'error';

/**
 * Connection status data
 */
export interface ConnectingStatusData {
  /** Connection state */
  state: ConnectionState;
  /** Display message */
  message: string;
  /** Error message if any */
  errorMessage: string | null;
  /** Currently active connector */
  activeConnector: string | undefined;
  /** Selected adapter */
  selectedAdapter: OrbitAdapter | undefined;
  /** Current connector configuration */
  currentConnector: GroupedConnector | null;
  /** Whether to show detailed error */
  showDetailedError: boolean;
  /** Raw error object */
  rawError: unknown;
}

// --- Component Props Types ---
type ContainerProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
  'aria-live'?: 'polite' | 'assertive' | 'off';
  'aria-atomic'?: boolean;
  statusData: ConnectingStatusData;
} & React.RefAttributes<HTMLElement>;

type StatusContainerProps = {
  className?: string;
  children: React.ReactNode;
  statusData: ConnectingStatusData;
} & React.RefAttributes<HTMLDivElement>;

type SpinnerProps = {
  className?: string;
  role?: string;
  'aria-label'?: string;
  'aria-describedby'?: string;
  statusData: ConnectingStatusData;
} & React.RefAttributes<HTMLDivElement>;

type StatusIconProps = {
  className?: string;
  role?: string;
  'aria-label'?: string;
  statusData: ConnectingStatusData;
} & React.RefAttributes<HTMLDivElement>;

type WalletIconContainerProps = {
  className?: string;
  children: React.ReactNode;
  statusData: ConnectingStatusData;
} & React.RefAttributes<HTMLDivElement>;

type MessageContainerProps = {
  className?: string;
  children: React.ReactNode;
  statusData: ConnectingStatusData;
} & React.RefAttributes<HTMLDivElement>;

type StatusMessageProps = {
  className?: string;
  children: React.ReactNode;
  id?: string;
  role?: string;
  'aria-level'?: number;
  statusData: ConnectingStatusData;
} & React.RefAttributes<HTMLHeadingElement>;

type ErrorMessageProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-describedby'?: string;
  statusData: ConnectingStatusData;
} & React.RefAttributes<HTMLParagraphElement>;

type ErrorDetailsProps = {
  className?: string;
  children: React.ReactNode;
  statusData: ConnectingStatusData;
} & React.RefAttributes<HTMLDetailsElement>;

type LoadingPlaceholderProps = {
  className?: string;
  role?: string;
  'aria-label'?: string;
  statusData: ConnectingStatusData;
} & React.RefAttributes<HTMLDivElement>;

/**
 * Customization options for Connecting component
 */
export type ConnectingCustomization = {
  /** Custom components */
  components?: {
    /** Custom container wrapper */
    Container?: ComponentType<ContainerProps>;
    /** Custom status container */
    StatusContainer?: ComponentType<StatusContainerProps>;
    /** Custom loading spinner */
    Spinner?: ComponentType<SpinnerProps>;
    /** Custom status icon */
    StatusIcon?: ComponentType<StatusIconProps>;
    /** Custom wallet icon container */
    WalletIconContainer?: ComponentType<WalletIconContainerProps>;
    /** Custom message container */
    MessageContainer?: ComponentType<MessageContainerProps>;
    /** Custom status message */
    StatusMessage?: ComponentType<StatusMessageProps>;
    /** Custom error message */
    ErrorMessage?: ComponentType<ErrorMessageProps>;
    /** Custom error details */
    ErrorDetails?: ComponentType<ErrorDetailsProps>;
    /** Custom loading placeholder */
    LoadingPlaceholder?: ComponentType<LoadingPlaceholderProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { statusData: ConnectingStatusData }) => string;
    /** Function to generate status container classes */
    statusContainer?: (params: { statusData: ConnectingStatusData }) => string;
    /** Function to generate spinner classes */
    spinner?: (params: { statusData: ConnectingStatusData }) => string;
    /** Function to generate status icon classes */
    statusIcon?: (params: { statusData: ConnectingStatusData }) => string;
    /** Function to generate wallet icon container classes */
    walletIconContainer?: (params: { statusData: ConnectingStatusData }) => string;
    /** Function to generate message container classes */
    messageContainer?: (params: { statusData: ConnectingStatusData }) => string;
    /** Function to generate status message classes */
    statusMessage?: (params: { statusData: ConnectingStatusData }) => string;
    /** Function to generate error message classes */
    errorMessage?: (params: { statusData: ConnectingStatusData }) => string;
    /** Function to generate error details classes */
    errorDetails?: (params: { statusData: ConnectingStatusData }) => string;
    /** Function to generate loading placeholder classes */
    loadingPlaceholder?: (params: { statusData: ConnectingStatusData }) => string;
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom handler for state change */
    onStateChange?: (state: ConnectionState, statusData: ConnectingStatusData) => void;
    /** Custom handler for error occurrence */
    onError?: (error: unknown, statusData: ConnectingStatusData) => void;
    /** Custom handler for successful connection */
    onSuccess?: (statusData: ConnectingStatusData) => void;
    /** Custom handler for connection start */
    onConnectingStart?: (statusData: ConnectingStatusData) => void;
    /** Custom cleanup handler called on unmount */
    onCleanup?: (statusData: ConnectingStatusData) => void;
  };
  /** Configuration options */
  config?: {
    /** Custom ARIA labels */
    ariaLabels?: {
      container?: string;
      spinner?: string;
      successIcon?: string;
      errorIcon?: string;
      loading?: string;
    };
    /** Custom animation settings */
    animation?: {
      spinnerDuration?: string;
      transitionDuration?: string;
    };
    /** Custom icon settings */
    icons?: {
      showSuccessIcon?: boolean;
      showErrorIcon?: boolean;
      customSuccessIcon?: ComponentType<{ className?: string }>;
      customErrorIcon?: ComponentType<{ className?: string }>;
    };
  };
};

/**
 * Connection status component props interface
 */
export interface ConnectingProps {
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
  /** Custom CSS classes for styling the container */
  className?: string;
  /** Customization options */
  customization?: ConnectingCustomization;
}

// --- Default Sub-Components ---
const DefaultContainer = forwardRef<HTMLElement, ContainerProps>(({ children, className, ...props }, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { statusData: _statusData, ...restProps } = props;
  return (
    <section ref={ref} className={className} {...restProps}>
      {children}
    </section>
  );
});
DefaultContainer.displayName = 'DefaultContainer';

const DefaultStatusContainer = forwardRef<HTMLDivElement, StatusContainerProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ children, className, statusData: _statusData }, ref) => (
    <div ref={ref} className={className}>
      {children}
    </div>
  ),
);
DefaultStatusContainer.displayName = 'DefaultStatusContainer';

const DefaultSpinner = forwardRef<HTMLDivElement, SpinnerProps>(({ className, ...props }, ref) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { statusData: _statusData, ...restProps } = props;
  return (
    <div ref={ref} className={className} {...restProps}>
      <span className="novacon:sr-only">Loading...</span>
    </div>
  );
});
DefaultSpinner.displayName = 'DefaultSpinner';

const DefaultStatusIcon = forwardRef<HTMLDivElement, StatusIconProps>(({ className, statusData, ...props }, ref) => {
  const isSuccess = statusData.state === 'success';
  const IconComponent = isSuccess ? CheckCircleIcon : ExclamationCircleIcon;

  return (
    <div ref={ref} className={className} {...props}>
      <IconComponent className="novacon:w-6 novacon:h-6 novacon:text-white" aria-hidden="true" />
    </div>
  );
});
DefaultStatusIcon.displayName = 'DefaultStatusIcon';

const DefaultWalletIconContainer = forwardRef<HTMLDivElement, WalletIconContainerProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ children, className, statusData: _statusData }, ref) => (
    <div ref={ref} className={className}>
      {children}
    </div>
  ),
);
DefaultWalletIconContainer.displayName = 'DefaultWalletIconContainer';

const DefaultMessageContainer = forwardRef<HTMLDivElement, MessageContainerProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ children, className, statusData: _statusData }, ref) => (
    <div ref={ref} className={className}>
      {children}
    </div>
  ),
);
DefaultMessageContainer.displayName = 'DefaultMessageContainer';

const DefaultStatusMessage = forwardRef<HTMLHeadingElement, StatusMessageProps>(
  ({ children, className, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { statusData: _statusData, ...restProps } = props;
    return (
      <h2 ref={ref} className={className} {...restProps}>
        {children}
      </h2>
    );
  },
);
DefaultStatusMessage.displayName = 'DefaultStatusMessage';

const DefaultErrorMessage = forwardRef<HTMLParagraphElement, ErrorMessageProps>(
  ({ children, className, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { statusData: _statusData, ...restProps } = props;
    return (
      <p ref={ref} className={className} {...restProps}>
        {children}
      </p>
    );
  },
);
DefaultErrorMessage.displayName = 'DefaultErrorMessage';

const DefaultErrorDetails = forwardRef<HTMLDetailsElement, ErrorDetailsProps>(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ children, className, statusData: _statusData }, ref) => (
    <details ref={ref} className={className}>
      {children}
    </details>
  ),
);
DefaultErrorDetails.displayName = 'DefaultErrorDetails';

const DefaultLoadingPlaceholder = forwardRef<HTMLDivElement, LoadingPlaceholderProps>(
  ({ className, ...props }, ref) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { statusData: _statusData, ...restProps } = props;
    return (
      <div ref={ref} className={className} {...restProps}>
        <div className="novacon:animate-pulse novacon:rounded-xl novacon:h-32 novacon:w-32 novacon:bg-[var(--tuwa-bg-muted)]" />
        <div className="novacon:animate-pulse novacon:rounded-xl novacon:h-6 novacon:w-48 novacon:bg-[var(--tuwa-bg-muted)]" />
      </div>
    );
  },
);
DefaultLoadingPlaceholder.displayName = 'DefaultLoadingPlaceholder';

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
export const Connecting = memo(
  forwardRef<HTMLDivElement, ConnectingProps>(
    (
      {
        activeConnector,
        selectedAdapter,
        connectors,
        isConnected,
        customErrorMessage,
        showDetailedError = false,
        className,
        customization,
      },
      ref,
    ) => {
      const labels = useNovaConnectLabels();
      const { walletConnectionError } = useNovaConnect();

      const isMountedRef = useRef(true);
      const prevStateRef = useRef<ConnectionState | null>(null);
      const prevStatusDataRef = useRef<ConnectingStatusData | null>(null);
      const cleanupCalled = useRef(false);

      // Extract customization options
      const {
        Container: CustomContainer = DefaultContainer,
        StatusContainer: CustomStatusContainer = DefaultStatusContainer,
        Spinner: CustomSpinner = DefaultSpinner,
        StatusIcon: CustomStatusIcon = DefaultStatusIcon,
        WalletIconContainer: CustomWalletIconContainer = DefaultWalletIconContainer,
        MessageContainer: CustomMessageContainer = DefaultMessageContainer,
        StatusMessage: CustomStatusMessage = DefaultStatusMessage,
        ErrorMessage: CustomErrorMessage = DefaultErrorMessage,
        ErrorDetails: CustomErrorDetails = DefaultErrorDetails,
        LoadingPlaceholder: CustomLoadingPlaceholder = DefaultLoadingPlaceholder,
      } = customization?.components ?? {};

      const customHandlers = customization?.handlers;
      const customConfig = customization?.config;

      /**
       * Find the current connector configuration
       */
      const currentConnector = useMemo(() => {
        if (!activeConnector) {
          performDefaultCleanup();
          return null;
        }
        return connectors.find((connector) => formatWalletName(connector.name) === activeConnector) || null;
      }, [connectors, activeConnector]);

      /**
       * Determine current connection state
       */
      const connectionState = useMemo((): ConnectionState => {
        if (walletConnectionError || customErrorMessage) return 'error';
        if (isConnected) return 'success';
        return 'connecting';
      }, [walletConnectionError, customErrorMessage, isConnected]);

      /**
       * Memoized display message
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
       * Memoized error message
       */
      const errorMessage = useMemo(() => {
        if (connectionState !== 'error') return null;

        if (customErrorMessage && showDetailedError) {
          return customErrorMessage;
        }

        return labels.cannotConnectWallet;
      }, [connectionState, customErrorMessage, showDetailedError, labels]);

      /**
       * Memoized status data
       */
      const statusData = useMemo(
        (): ConnectingStatusData => ({
          state: connectionState,
          message: displayMessage,
          errorMessage,
          activeConnector,
          selectedAdapter,
          currentConnector,
          showDetailedError,
          rawError: walletConnectionError,
        }),
        [
          connectionState,
          displayMessage,
          errorMessage,
          activeConnector,
          selectedAdapter,
          currentConnector,
          showDetailedError,
          walletConnectionError,
        ],
      );

      /**
       * Memoized container classes
       */
      const containerClasses = useMemo(
        () =>
          customization?.classNames?.container?.({ statusData }) ??
          cn(
            'novacon:flex novacon:flex-col novacon:gap-4 novacon:items-center novacon:justify-center novacon:w-full',
            className,
          ),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [customization?.classNames?.container, statusData, className],
      );

      /**
       * Memoized status container classes based on connection state
       */
      const statusContainerClasses = useMemo(() => {
        if (customization?.classNames?.statusContainer) {
          return customization.classNames.statusContainer({ statusData });
        }

        const baseClasses = [
          'novacon:relative novacon:flex novacon:items-center novacon:justify-center',
          'novacon:min-w-[110px] novacon:min-h-[110px] novacon:md:min-w-[150px] novacon:md:min-h-[150px]',
          'novacon:border-2 novacon:rounded-full',
          'novacon:p-4 novacon:md:p-6',
          'novacon:transition-all novacon:duration-300 novacon:ease-in-out',
        ];

        const stateClasses = {
          error: [
            'novacon:border-[var(--tuwa-error-text)]',
            'novacon:bg-[var(--tuwa-error-text)] novacon:bg-opacity-5',
          ],
          success: [
            'novacon:border-[var(--tuwa-success-text)]',
            'novacon:bg-[var(--tuwa-success-text)] novacon:bg-opacity-5',
          ],
          connecting: ['novacon:border-[var(--tuwa-border-primary)]', 'novacon:bg-[var(--tuwa-bg-primary)]'],
        };

        return cn(baseClasses, stateClasses[statusData.state]);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [customization?.classNames?.statusContainer, statusData]);

      const performDefaultCleanup = () => {
        if (cleanupCalled.current) return;

        cleanupCalled.current = true;

        isMountedRef.current = false;
        prevStateRef.current = null;
        prevStatusDataRef.current = null;

        if (typeof window !== 'undefined') {
          const element = document.querySelector('[data-connecting-component]');
          if (element) {
            element.getAnimations?.().forEach((animation) => animation.cancel());
          }
        }
      };

      useEffect(() => {
        if (!isMountedRef.current) return;

        if (prevStateRef.current !== connectionState) {
          customHandlers?.onStateChange?.(connectionState, statusData);

          if (connectionState === 'error') {
            customHandlers?.onError?.(walletConnectionError, statusData);
          } else if (connectionState === 'success') {
            customHandlers?.onSuccess?.(statusData);
          } else if (connectionState === 'connecting') {
            customHandlers?.onConnectingStart?.(statusData);
          }

          prevStateRef.current = connectionState;
        }

        prevStatusDataRef.current = statusData;
      }, [connectionState, statusData, customHandlers, walletConnectionError]);

      useEffect(() => {
        isMountedRef.current = true;
        cleanupCalled.current = false;

        // Cleanup function
        return () => {
          if (customHandlers?.onCleanup && prevStatusDataRef.current) {
            try {
              customHandlers.onCleanup(prevStatusDataRef.current);
            } catch (error) {
              console.warn('Error in custom cleanup handler:', error);
            }
          }
          performDefaultCleanup();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [customHandlers?.onCleanup]);

      useEffect(() => {
        return () => {
          if (!cleanupCalled.current && customHandlers?.onCleanup && prevStatusDataRef.current) {
            try {
              customHandlers.onCleanup(prevStatusDataRef.current);
            } catch (error) {
              console.warn('Error in custom cleanup handler on dependency change:', error);
            }
          }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [customHandlers?.onCleanup]);

      // Early return for missing required data
      if (!selectedAdapter || !activeConnector || !currentConnector) {
        return (
          <CustomLoadingPlaceholder
            ref={ref}
            className={
              customization?.classNames?.loadingPlaceholder?.({ statusData }) ??
              cn(
                'novacon:flex novacon:flex-col novacon:gap-4 novacon:items-center novacon:justify-center novacon:w-full novacon:py-8',
              )
            }
            role="status"
            aria-label={customConfig?.ariaLabels?.loading ?? labels.loading}
            statusData={statusData}
            data-connecting-component="true"
          />
        );
      }

      const containerAriaLabel = customConfig?.ariaLabels?.container ?? `Connection status: ${displayMessage}`;

      return (
        <CustomContainer
          ref={ref as React.ForwardedRef<HTMLElement>}
          className={containerClasses}
          role="status"
          aria-label={containerAriaLabel}
          aria-live="polite"
          aria-atomic={true}
          statusData={statusData}
          data-connecting-component="true"
        >
          {/* Connection Status Container */}
          <CustomStatusContainer className={statusContainerClasses} statusData={statusData}>
            {/* Loading Spinner for Connecting State */}
            {connectionState === 'connecting' && (
              <CustomSpinner
                className={
                  customization?.classNames?.spinner?.({ statusData }) ??
                  cn(
                    'novacon:absolute novacon:animate-spin novacon:rounded-full novacon:-inset-[2px]',
                    'novacon:w-[calc(100%_+_4px)] novacon:h-[calc(100%_+_4px)]',
                    'novacon:border-2 novacon:border-[var(--tuwa-pending-text)]',
                    'novacon:border-t-transparent',
                  )
                }
                role="progressbar"
                aria-label={customConfig?.ariaLabels?.spinner ?? labels.connecting}
                aria-describedby="connecting-message"
                statusData={statusData}
              />
            )}

            {/* Success/Error Icons */}
            {(connectionState === 'success' || connectionState === 'error') && (
              <CustomStatusIcon
                className={
                  customization?.classNames?.statusIcon?.({ statusData }) ??
                  cn(
                    'novacon:absolute novacon:-top-2 novacon:-right-2 novacon:w-8 novacon:h-8 novacon:rounded-full novacon:flex novacon:items-center novacon:justify-center novacon:bg-[var(--tuwa-error-text)]',
                    {
                      'novacon:bg-[var(--tuwa-success-text)]': connectionState === 'success',
                    },
                  )
                }
                role="img"
                aria-label={
                  connectionState === 'success'
                    ? (customConfig?.ariaLabels?.successIcon ?? labels.successIcon)
                    : (customConfig?.ariaLabels?.errorIcon ?? labels.errorIcon)
                }
                statusData={statusData}
              />
            )}

            {/* Wallet Icon */}
            <CustomWalletIconContainer
              className={
                customization?.classNames?.walletIconContainer?.({ statusData }) ??
                cn('novacon:[&_img]:w-[60px]! novacon:[&_img]:h-[auto]! novacon:md:[&_img]:w-[80px]!')
              }
              statusData={statusData}
            >
              <WalletIcon
                icon={currentConnector.icon}
                name={activeConnector}
                altText={`${activeConnector} ${labels.walletIcon}`}
                showLoading={connectionState === 'connecting'}
              />
            </CustomWalletIconContainer>
          </CustomStatusContainer>

          {/* Status Message */}
          <CustomMessageContainer
            className={
              customization?.classNames?.messageContainer?.({ statusData }) ??
              cn('novacon:text-center novacon:space-y-2 novacon:max-w-md')
            }
            statusData={statusData}
          >
            <CustomStatusMessage
              id="connecting-message"
              className={
                customization?.classNames?.statusMessage?.({ statusData }) ??
                cn('novacon:text-lg novacon:font-semibold novacon:transition-colors novacon:duration-300', {
                  'novacon:text-[var(--tuwa-error-text)]': connectionState === 'error',
                  'novacon:text-[var(--tuwa-success-text)]': connectionState === 'success',
                  'novacon:text-[var(--tuwa-text-primary)]': connectionState === 'connecting',
                })
              }
              role="heading"
              aria-level={2}
              statusData={statusData}
            >
              {displayMessage}
            </CustomStatusMessage>

            {/* Error Details */}
            {errorMessage && (
              <CustomErrorMessage
                className={
                  customization?.classNames?.errorMessage?.({ statusData }) ??
                  cn(
                    'novacon:text-sm novacon:text-[var(--tuwa-error-text)] novacon:text-center novacon:leading-relaxed',
                  )
                }
                role="alert"
                aria-describedby="connecting-message"
                statusData={statusData}
              >
                {errorMessage}
              </CustomErrorMessage>
            )}

            {/* Additional Error Information */}
            {connectionState === 'error' && showDetailedError && walletConnectionError && (
              <CustomErrorDetails
                className={
                  customization?.classNames?.errorDetails?.({ statusData }) ?? cn('novacon:mt-3 novacon:text-left')
                }
                statusData={statusData}
              >
                <summary className="novacon:text-sm novacon:text-[var(--tuwa-text-secondary)] novacon:cursor-pointer novacon:hover:text-[var(--tuwa-text-primary)] novacon:transition-colors">
                  {labels.copyRawError}
                </summary>
                <pre className="novacon:mt-2 novacon:p-3 novacon:bg-[var(--tuwa-bg-muted)] novacon:rounded-md novacon:text-xs novacon:font-mono novacon:text-[var(--tuwa-text-secondary)] novacon:overflow-auto novacon:max-h-32">
                  {JSON.stringify(walletConnectionError, null, 2)}
                </pre>
              </CustomErrorDetails>
            )}
          </CustomMessageContainer>

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
        </CustomContainer>
      );
    },
  ),
);

Connecting.displayName = 'Connecting';
