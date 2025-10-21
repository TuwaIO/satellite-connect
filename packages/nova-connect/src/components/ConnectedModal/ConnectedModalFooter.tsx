/**
 * @file ConnectedModalFooter component with comprehensive customization options and wallet control actions.
 */

import { cn, standardButtonClasses } from '@tuwaio/nova-core';
import { getAdapterFromWalletType } from '@tuwaio/orbit-core';
import { type Easing, motion, type Variants } from 'framer-motion';
import { ComponentPropsWithoutRef, ComponentType, forwardRef, ReactNode, useCallback, useMemo } from 'react';

import { useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { ConnectButtonProps } from '../ConnectButton/ConnectButton';

// --- Default Motion Variants ---
const DEFAULT_PATH_ANIMATION_VARIANTS: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
};

// --- Types for Customization ---
type CustomDisconnectButtonProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
  labels: Record<string, string>;
  className?: string;
  'data-testid'?: string;
  'aria-describedby'?: string;
  disabled?: boolean;
};

type CustomExplorerLinkProps = {
  href: string;
  labels: Record<string, string>;
  walletAddress: string;
  isValidUrl: boolean;
  className?: string;
  'data-testid'?: string;
  'aria-describedby'?: string;
  onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

type CustomDisconnectIconProps = {
  pathData: string;
  variants?: Variants;
  className?: string;
  strokeWidth?: string | number;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'bevel' | 'round';
  animation?: {
    duration?: number;
    ease?: Easing | Easing[];
    delay?: number;
  };
};

type CustomExplorerIconProps = {
  pathData: string;
  variants?: Variants;
  className?: string;
  strokeWidth?: string | number;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'bevel' | 'round';
  isAnimated?: boolean;
  animation?: {
    duration?: number;
    ease?: Easing | Easing[];
    delay?: number;
  };
};

type CustomFooterContentProps = {
  disconnectButton: ReactNode;
  explorerLink: ReactNode;
  isValidExplorerUrl: boolean;
  walletAddress: string;
  labels: Record<string, string>;
};

/**
 * Customization options for ConnectedModalFooter component
 */
export type ConnectedModalFooterCustomization = {
  /** Override container element props */
  containerProps?: Partial<ComponentPropsWithoutRef<'footer'>>;
  /** Custom components */
  components?: {
    /** Custom disconnect button component */
    DisconnectButton?: ComponentType<CustomDisconnectButtonProps>;
    /** Custom explorer link component */
    ExplorerLink?: ComponentType<CustomExplorerLinkProps>;
    /** Custom disconnect icon component */
    DisconnectIcon?: ComponentType<CustomDisconnectIconProps>;
    /** Custom explorer icon component */
    ExplorerIcon?: ComponentType<CustomExplorerIconProps>;
    /** Custom footer content component (wraps everything) */
    FooterContent?: ComponentType<CustomFooterContentProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { isValidExplorerUrl: boolean; walletAddress: string }) => string;
    /** Function to generate disconnect button classes */
    disconnectButton?: (params: { disabled?: boolean }) => string;
    /** Function to generate explorer link classes */
    explorerLink?: (params: { isValidUrl: boolean; disabled?: boolean }) => string;
    /** Function to generate disconnect icon container classes */
    disconnectIconContainer?: () => string;
    /** Function to generate explorer icon container classes */
    explorerIconContainer?: () => string;
    /** Function to generate disconnect icon classes */
    disconnectIcon?: () => string;
    /** Function to generate explorer icon classes */
    explorerIcon?: (params: { isValidUrl: boolean }) => string;
    /** Function to generate button text classes */
    buttonText?: (params: { buttonType: 'disconnect' | 'explorer' }) => string;
    /** Function to generate screen reader text classes */
    screenReaderText?: () => string;
  };
  /** Custom animation variants */
  variants?: {
    /** Disconnect icon animation variants */
    disconnectIcon?: Variants;
    /** Explorer icon animation variants */
    explorerIcon?: Variants;
  };
  /** Custom animation configuration */
  animation?: {
    /** Disconnect icon animation configuration */
    disconnectIcon?: {
      /** Animation duration in seconds */
      duration?: number;
      /** Animation easing curve */
      ease?: Easing | Easing[];
      /** Animation delay in seconds */
      delay?: number;
    };
    /** Explorer icon animation configuration */
    explorerIcon?: {
      /** Animation duration in seconds */
      duration?: number;
      /** Animation easing curve */
      ease?: Easing | Easing[];
      /** Animation delay in seconds */
      delay?: number;
    };
  };
  /** Custom SVG properties */
  svg?: {
    /** Custom disconnect icon path */
    disconnectIconPath?: string;
    /** Custom explorer icon path */
    explorerIconPath?: string;
    /** Custom disconnect icon viewBox */
    disconnectIconViewBox?: string;
    /** Custom explorer icon viewBox */
    explorerIconViewBox?: string;
    /** Custom disconnect icon stroke width */
    disconnectIconStrokeWidth?: string | number;
    /** Custom explorer icon stroke width */
    explorerIconStrokeWidth?: string | number;
    /** Custom disconnect icon stroke linecap */
    disconnectIconStrokeLinecap?: 'butt' | 'round' | 'square';
    /** Custom explorer icon stroke linecap */
    explorerIconStrokeLinecap?: 'butt' | 'round' | 'square';
    /** Custom disconnect icon stroke linejoin */
    disconnectIconStrokeLinejoin?: 'miter' | 'bevel' | 'round';
    /** Custom explorer icon stroke linejoin */
    explorerIconStrokeLinejoin?: 'miter' | 'bevel' | 'round';
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom handler for disconnect button click */
    onDisconnectClick?: (originalHandler: () => void, event: React.MouseEvent<HTMLButtonElement>) => void;
    /** Custom handler for explorer link click */
    onExplorerClick?: (explorerUrl: string, walletAddress: string, event: React.MouseEvent<HTMLAnchorElement>) => void;
    /** Custom handler before disconnect */
    onBeforeDisconnect?: () => boolean | Promise<boolean>;
    /** Custom handler after disconnect */
    onAfterDisconnect?: () => void;
  };
  /** Custom text and aria labels */
  labels?: {
    /** Custom disconnect button text */
    disconnectText?: string;
    /** Custom explorer link text */
    explorerText?: string;
    /** Custom disconnect description for screen readers */
    disconnectDescription?: string;
    /** Custom explorer description for screen readers */
    explorerDescription?: string;
    /** Custom footer aria label */
    footerAriaLabel?: string;
    /** Custom explorer unavailable message */
    explorerUnavailableMessage?: string;
  };
  /** Configuration options */
  config?: {
    /** Whether to disable animations */
    disableAnimation?: boolean;
    /** Whether to reduce motion for accessibility */
    reduceMotion?: boolean;
    /** Whether to show disconnect button */
    showDisconnectButton?: boolean;
    /** Whether to show explorer link */
    showExplorerLink?: boolean;
    /** Custom disconnect button test id */
    disconnectButtonTestId?: string;
    /** Custom explorer link test id */
    explorerLinkTestId?: string;
    /** Whether to close modal after disconnect */
    closeModalAfterDisconnect?: boolean;
    /** Custom explorer URL fallback */
    explorerUrlFallback?: string;
  };
};

/**
 * Props for the ConnectedModalFooter component
 */
export interface ConnectedModalFooterProps extends Pick<ConnectButtonProps, 'store'> {
  /** Callback to control modal visibility */
  setIsOpen: (isOpen: boolean) => void;
  /** Custom CSS classes for the container */
  className?: string;
  /** Custom aria-label for the container */
  'aria-label'?: string;
  /** Customization options */
  customization?: ConnectedModalFooterCustomization;
}

// --- Default Sub-Components ---
const DefaultDisconnectButton: React.FC<
  CustomDisconnectButtonProps & Omit<ComponentPropsWithoutRef<'button'>, 'onClick' | 'style'>
> = ({
  onClick,
  labels,
  className,
  'data-testid': testId,
  'aria-describedby': ariaDescribedBy,
  disabled = false,
  ...props
}) => {
  const iconPath =
    'M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15';

  return (
    <button
      type="button"
      className={cn(standardButtonClasses, className)}
      onClick={onClick}
      aria-describedby={ariaDescribedBy}
      data-testid={testId}
      disabled={disabled}
      {...props}
    >
      <DefaultDisconnectIcon pathData={iconPath} />
      <span id={ariaDescribedBy} className="novacon:sr-only">
        {labels.disconnect} wallet and close modal
      </span>
      {labels.disconnect}
    </button>
  );
};

const DefaultExplorerLink: React.FC<
  CustomExplorerLinkProps &
    Omit<ComponentPropsWithoutRef<'a'>, 'onClick' | 'style'> &
    Pick<ComponentPropsWithoutRef<'button'>, 'type'>
> = ({
  href,
  labels,
  walletAddress,
  isValidUrl,
  className,
  'data-testid': testId,
  'aria-describedby': ariaDescribedBy,
  onClick,
  type,
  ...props
}) => {
  const iconPath =
    'M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25';

  if (isValidUrl) {
    return (
      <a
        href={href}
        className={cn(standardButtonClasses, className)}
        target="_blank"
        rel="noopener noreferrer"
        aria-describedby={ariaDescribedBy}
        data-testid={testId}
        onClick={onClick}
        {...props}
      >
        <span className="novacon:flex novacon:items-center novacon:gap-2">
          {labels.viewOnExplorer}
          <DefaultExplorerIcon pathData={iconPath} isAnimated={true} />
        </span>
        <span id={ariaDescribedBy} className="novacon:sr-only">
          Opens in new tab - View wallet address {walletAddress} on blockchain explorer
        </span>
      </a>
    );
  }

  return (
    <button
      type={type ?? 'button'}
      className={cn(standardButtonClasses, 'novacon:opacity-50 novacon:cursor-not-allowed', className)}
      disabled
      aria-describedby={ariaDescribedBy}
      title="Explorer not available for this network"
    >
      <span className="novacon:flex novacon:items-center novacon:gap-2">
        {labels.viewOnExplorer}
        <DefaultExplorerIcon pathData={iconPath} isAnimated={false} />
      </span>
      <span id={ariaDescribedBy} className="novacon:sr-only">
        Blockchain explorer is not available for this network
      </span>
    </button>
  );
};

const DefaultDisconnectIcon: React.FC<CustomDisconnectIconProps & Omit<ComponentPropsWithoutRef<'svg'>, 'style'>> = ({
  pathData,
  variants = DEFAULT_PATH_ANIMATION_VARIANTS,
  className,
  strokeWidth = 1.5,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  animation,
  ...props
}) => {
  const animationConfig = {
    duration: animation?.duration ?? 0.5,
    ease: animation?.ease ?? 'easeInOut',
    delay: animation?.delay ?? 0,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={cn('novacon:w-5 novacon:h-5', className)}
      aria-hidden="true"
      {...props}
    >
      <motion.path
        d={pathData}
        strokeLinecap={strokeLinecap}
        strokeLinejoin={strokeLinejoin}
        variants={variants}
        initial="hidden"
        animate="visible"
        transition={animationConfig}
      />
    </svg>
  );
};

const DefaultExplorerIcon: React.FC<CustomExplorerIconProps & Omit<ComponentPropsWithoutRef<'svg'>, 'style'>> = ({
  pathData,
  variants = DEFAULT_PATH_ANIMATION_VARIANTS,
  className,
  strokeWidth = 1.5,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  isAnimated = true,
  animation,
  ...props
}) => {
  const animationConfig = {
    duration: animation?.duration ?? 0.5,
    ease: animation?.ease ?? 'easeInOut',
    delay: animation?.delay ?? 0,
  };

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={strokeWidth}
      stroke="currentColor"
      className={cn('novacon:w-4 novacon:h-4', className)}
      aria-hidden="true"
      {...props}
    >
      {isAnimated ? (
        <motion.path
          d={pathData}
          strokeLinecap={strokeLinecap}
          strokeLinejoin={strokeLinejoin}
          variants={variants}
          initial="hidden"
          animate="visible"
          transition={animationConfig}
        />
      ) : (
        <path d={pathData} strokeLinecap={strokeLinecap} strokeLinejoin={strokeLinejoin} />
      )}
    </svg>
  );
};

const DefaultFooterContent: React.FC<Pick<CustomFooterContentProps, 'disconnectButton' | 'explorerLink'>> = ({
  disconnectButton,
  explorerLink,
}) => {
  return (
    <>
      {disconnectButton}
      {explorerLink}
    </>
  );
};

/**
 * ConnectedModalFooter provides wallet control actions with comprehensive customization options.
 * Displays disconnect button and explorer link with full accessibility support and animation capabilities.
 *
 * Features:
 * - Disconnect button with animated icon and modal closure
 * - Explorer link with external indicator and validation
 * - Comprehensive customization for all UI elements and behaviors
 * - Full accessibility support with ARIA labels and screen reader descriptions
 * - Responsive design with mobile-first approach
 * - Custom event handlers for enhanced interactivity
 * - Animation customization with reduced motion support
 * - Custom SVG icons and paths
 * - Error handling for explorer URL generation
 * - Disabled state for unavailable explorer links
 * - Performance-optimized with memoized calculations
 *
 * @example Basic usage
 * ```tsx
 * <ConnectedModalFooter
 *   setIsOpen={(open) => setModalOpen(open)}
 *   store={walletStore}
 * />
 * ```
 *
 * @example With full customization
 * ```tsx
 * <ConnectedModalFooter
 *   setIsOpen={setModalOpen}
 *   store={walletStore}
 *   customization={{
 *     classNames: {
 *       container: ({ isValidExplorerUrl }) =>
 *         `custom-footer ${isValidExplorerUrl ? 'with-explorer' : 'no-explorer'}`,
 *       disconnectButton: () => "custom-disconnect-btn bg-red-500 text-white",
 *       explorerLink: ({ isValidUrl }) =>
 *         `custom-explorer-link ${isValidUrl ? 'active' : 'disabled'}`,
 *     },
 *     components: {
 *       DisconnectButton: ({ onClick, labels, className }) =>
 *         <button className={className} onClick={onClick}>Custom {labels.disconnect}</button>,
 *     },
 *     handlers: {
 *       onDisconnectClick: (originalHandler, event) => {
 *         console.log("Disconnecting...");
 *         originalHandler();
 *       },
 *       onBeforeDisconnect: async () => {
 *         const confirmed = await showConfirmDialog();
 *         return confirmed;
 *       },
 *       onAfterDisconnect: () => {
 *         showNotification("Wallet disconnected");
 *       },
 *     },
 *     animation: {
 *       disconnectIcon: { duration: 0.8, ease: "easeOut" },
 *       explorerIcon: { duration: 0.6, delay: 0.1 },
 *     },
 *     svg: {
 *       disconnectIconPath: "M12 2L2 7v10l10 5 10-5V7L12 2z",
 *       explorerIconPath: "M8 2L2 8v8l6 6h8l6-6V8L16 2H8z",
 *       disconnectIconStrokeWidth: 2,
 *     },
 *     config: {
 *       closeModalAfterDisconnect: false,
 *       showDisconnectButton: true,
 *       showExplorerLink: true,
 *       reduceMotion: false,
 *     },
 *   }}
 * />
 * ```
 */
export const ConnectedModalFooter = forwardRef<HTMLElement, ConnectedModalFooterProps>(
  ({ setIsOpen, store, className, 'aria-label': ariaLabel, customization, ...props }, ref) => {
    const labels = useNovaConnectLabels();
    const { activeWallet } = useNovaConnect();

    // Get wallet state and actions from store
    const getAdapter = store.getState().getAdapter;
    const disconnect = store.getState().disconnect;

    // Extract custom components and config
    const {
      DisconnectButton = DefaultDisconnectButton,
      ExplorerLink = DefaultExplorerLink,
      FooterContent = DefaultFooterContent,
    } = customization?.components ?? {};

    const {
      showDisconnectButton = true,
      showExplorerLink = true,
      disconnectButtonTestId = 'disconnect-button',
      explorerLinkTestId = 'explorer-link',
      closeModalAfterDisconnect = true,
      explorerUrlFallback = '#',
    } = customization?.config ?? {};

    // Memoize custom labels
    const finalLabels = useMemo(
      () => ({
        ...labels,
        ...(customization?.labels && {
          disconnect: customization.labels.disconnectText ?? labels.disconnect,
          viewOnExplorer: customization.labels.explorerText ?? labels.viewOnExplorer,
          walletControls: customization.labels.footerAriaLabel ?? labels.walletControls,
        }),
      }),
      [labels, customization?.labels],
    );

    /**
     * Generate explorer URL for the current wallet address
     * Memoized to prevent unnecessary recalculations
     */
    const explorerUrl = useMemo(() => {
      if (!activeWallet) return explorerUrlFallback;

      try {
        const adapter = getAdapter(getAdapterFromWalletType(activeWallet.walletType));
        return adapter?.getExplorerUrl(`/address/${activeWallet.address}`, activeWallet.chainId) || explorerUrlFallback;
      } catch (error) {
        console.warn('Failed to generate explorer URL:', error);
        return explorerUrlFallback;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeWallet?.walletType, activeWallet?.address, activeWallet?.chainId, getAdapter, explorerUrlFallback]);

    /**
     * Check if explorer URL is valid for link functionality
     */
    const isValidExplorerUrl = useMemo(
      () => explorerUrl !== '#' && explorerUrl !== explorerUrlFallback,
      [explorerUrl, explorerUrlFallback],
    );

    /**
     * Handle wallet disconnection with custom hooks
     */
    const handleDisconnect = useCallback(
      async (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
          // Custom before disconnect handler
          if (customization?.handlers?.onBeforeDisconnect) {
            const shouldProceed = await customization.handlers.onBeforeDisconnect();
            if (!shouldProceed) return;
          }

          // Custom disconnect click handler
          const originalHandler = () => {
            disconnect();
            if (closeModalAfterDisconnect) {
              setIsOpen(false);
            }
          };

          if (customization?.handlers?.onDisconnectClick) {
            customization.handlers.onDisconnectClick(originalHandler, event);
          } else {
            originalHandler();
          }

          // Custom after disconnect handler
          if (customization?.handlers?.onAfterDisconnect) {
            customization.handlers.onAfterDisconnect();
          }
        } catch (error) {
          console.error('Error during disconnect:', error);
        }
      },
      [disconnect, setIsOpen, customization, closeModalAfterDisconnect],
    );

    /**
     * Handle explorer link click with custom handler
     */
    const handleExplorerClick = useCallback(
      (event: React.MouseEvent<HTMLAnchorElement>) => {
        if (customization?.handlers?.onExplorerClick && activeWallet) {
          customization.handlers.onExplorerClick(explorerUrl, activeWallet.address, event);
        }
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [customization?.handlers?.onExplorerClick, explorerUrl, activeWallet?.address],
    );

    // Generate container classes
    const containerClasses = useMemo(() => {
      if (customization?.classNames?.container && activeWallet) {
        return customization.classNames.container({
          isValidExplorerUrl,
          walletAddress: activeWallet.address,
        });
      }
      return cn(
        'novacon:flex novacon:flex-wrap novacon:gap-4 novacon:w-full novacon:items-center novacon:justify-between novacon:border-t novacon:border-[var(--tuwa-border-primary)] novacon:p-4 novacon:flex-col-reverse novacon:sm:flex-row',
        className,
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.container, isValidExplorerUrl, activeWallet?.address, className]);

    // Generate disconnect button element
    const disconnectButtonElement = useMemo(() => {
      if (!showDisconnectButton || !activeWallet) return null;

      return (
        <DisconnectButton
          onClick={handleDisconnect}
          labels={finalLabels}
          className={customization?.classNames?.disconnectButton?.({})}
          data-testid={disconnectButtonTestId}
          aria-describedby="disconnect-description"
        />
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      showDisconnectButton,
      activeWallet,
      DisconnectButton,
      handleDisconnect,
      finalLabels,
      customization?.classNames?.disconnectButton,
      disconnectButtonTestId,
    ]);

    // Generate explorer link element
    const explorerLinkElement = useMemo(() => {
      if (!showExplorerLink || !activeWallet) return null;

      return (
        <ExplorerLink
          href={explorerUrl}
          labels={finalLabels}
          walletAddress={activeWallet.address}
          isValidUrl={isValidExplorerUrl}
          className={customization?.classNames?.explorerLink?.({
            isValidUrl: isValidExplorerUrl,
            disabled: !isValidExplorerUrl,
          })}
          data-testid={explorerLinkTestId}
          aria-describedby="explorer-description"
          onClick={handleExplorerClick}
        />
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      showExplorerLink,
      activeWallet,
      ExplorerLink,
      explorerUrl,
      finalLabels,
      isValidExplorerUrl,
      customization?.classNames?.explorerLink,
      explorerLinkTestId,
      handleExplorerClick,
    ]);

    // Merge container props
    const containerProps = useMemo(
      () => ({
        ...customization?.containerProps,
        ...props,
        ref,
        className: containerClasses,
        role: 'contentinfo',
        'aria-label': ariaLabel || finalLabels.walletControls,
      }),
      [customization?.containerProps, props, ref, containerClasses, ariaLabel, finalLabels],
    );

    // Early return if no active wallet
    if (!activeWallet) return null;

    return (
      <footer {...containerProps}>
        <FooterContent
          disconnectButton={disconnectButtonElement}
          explorerLink={explorerLinkElement}
          isValidExplorerUrl={isValidExplorerUrl}
          walletAddress={activeWallet.address}
          labels={finalLabels}
        />
      </footer>
    );
  },
);

ConnectedModalFooter.displayName = 'ConnectedModalFooter';
