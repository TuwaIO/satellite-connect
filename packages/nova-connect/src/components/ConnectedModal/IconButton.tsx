/**
 * @file IconButton component with comprehensive customization options for wallet and chain interactions.
 */

import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { ChevronArrowWithAnim, cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { type Easing, motion, type Variants } from 'framer-motion';
import { ComponentPropsWithoutRef, ComponentType, forwardRef, ReactNode, useCallback, useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { WalletIcon, type WalletIconCustomization } from '../WalletIcon';

// --- Default Motion Variants ---
const DEFAULT_BUTTON_ANIMATION_VARIANTS: Variants = {
  idle: { scale: 1, rotate: 0 },
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95, transition: { duration: 0.1 } },
  loading: { rotate: 360, transition: { duration: 2, repeat: Infinity, ease: 'linear' } },
};

// --- Types for Customization ---
type CustomWalletIconContainerProps = {
  walletName?: string;
  walletIcon?: string;
  showLoading: boolean;
  labels: Record<string, string>;
  className?: string;
};

type CustomChainIconContainerProps = {
  chainId: string | number;
  walletChainId?: string | number;
  className?: string;
};

type CustomChevronContainerProps = {
  isOpen: boolean;
  className?: string;
};

type CustomLoadingOverlayProps = {
  loading: boolean;
  className?: string;
};

type CustomButtonContentProps = {
  walletIconContainer: ReactNode;
  chainIconContainer: ReactNode;
  chevronContainer: ReactNode;
  loadingOverlay: ReactNode;
  hasWalletIcon: boolean;
  hasChainIcon: boolean;
  hasChevron: boolean;
  loading: boolean;
  disabled: boolean;
  isClickable: boolean;
};

/**
 * Customization options for IconButton component
 */
export type IconButtonCustomization = {
  /** Override button element props */
  buttonProps?: Partial<
    Omit<
      ComponentPropsWithoutRef<'button'>,
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
    /** Custom wallet icon container component */
    WalletIconContainer?: ComponentType<CustomWalletIconContainerProps>;
    /** Custom chain icon container component */
    ChainIconContainer?: ComponentType<CustomChainIconContainerProps>;
    /** Custom chevron container component */
    ChevronContainer?: ComponentType<CustomChevronContainerProps>;
    /** Custom loading overlay component */
    LoadingOverlay?: ComponentType<CustomLoadingOverlayProps>;
    /** Custom button content wrapper component */
    ButtonContent?: ComponentType<CustomButtonContentProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate button classes */
    button?: (params: {
      isClickable: boolean;
      disabled: boolean;
      loading: boolean;
      hasMultipleIcons: boolean;
    }) => string;
    /** Function to generate wallet icon container classes */
    walletIconContainer?: (params: { showLoading: boolean; hasWalletIcon: boolean }) => string;
    /** Function to generate chain icon container classes */
    chainIconContainer?: (params: { hasChainIcon: boolean }) => string;
    /** Function to generate chevron container classes */
    chevronContainer?: (params: { isOpen: boolean; isClickable: boolean }) => string;
    /** Function to generate loading overlay classes */
    loadingOverlay?: (params: { loading: boolean }) => string;
    /** Function to generate loading spinner classes */
    loadingSpinner?: () => string;
  };
  /** Customization options for child components */
  childCustomizations?: {
    /** WalletIcon customization */
    walletIcon?: WalletIconCustomization;
  };
  /** Custom animation variants */
  variants?: {
    /** Button animation variants */
    button?: Variants;
    /** Chevron animation variants */
    chevron?: Variants;
  };
  /** Custom animation configuration */
  animation?: {
    /** Button animation configuration */
    button?: {
      /** Animation duration in seconds */
      duration?: number;
      /** Animation easing curve */
      ease?: Easing | Easing[];
      /** Animation delay in seconds */
      delay?: number;
    };
    /** Chevron animation configuration */
    chevron?: {
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
    /** Custom handler for button click */
    onClick?: (originalHandler: () => void, event: React.MouseEvent<HTMLButtonElement>) => void;
    /** Custom handler for button hover */
    onHover?: (isHovering: boolean, event: React.MouseEvent<HTMLButtonElement>) => void;
    /** Custom handler for button focus */
    onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
    /** Custom handler for button blur */
    onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  };
  /** Custom aria labels and accessibility */
  accessibility?: {
    /** Custom aria-label generator */
    ariaLabel?: (params: {
      walletName?: string;
      walletChainId?: string | number;
      isClickable: boolean;
      loading: boolean;
      disabled: boolean;
    }) => string;
    /** Custom tooltip generator */
    tooltip?: (params: {
      walletName?: string;
      walletChainId?: string | number;
      isClickable: boolean;
      loading: boolean;
      disabled: boolean;
    }) => string;
    /** Custom role attribute */
    role?: string;
    /** Custom aria-describedby */
    ariaDescribedBy?: string;
  };
  /** Configuration options */
  config?: {
    /** Whether to disable animations */
    disableAnimation?: boolean;
    /** Whether to reduce motion for accessibility */
    reduceMotion?: boolean;
    /** Custom chain ID formatting */
    chainIdFormatter?: (chainId: string | number) => string | number;
    /** Whether to show wallet icon */
    showWalletIcon?: boolean;
    /** Whether to show chain icon */
    showChainIcon?: boolean;
    /** Whether to show chevron */
    showChevron?: boolean;
    /** Whether to show loading overlay */
    showLoadingOverlay?: boolean;
    /** Custom button test id */
    buttonTestId?: string;
  };
};

/**
 * Props for the IconButton component
 */
export interface IconButtonProps {
  /** Custom icon URL for the wallet */
  walletIcon?: string;
  /** Name of the wallet */
  walletName?: string;
  /** Chain ID for the network icon */
  walletChainId?: string | number;
  /** Number of available items/options (shows chevron if > 1) */
  items?: number;
  /** Click handler for the button */
  onClick?: () => void;
  /** Additional CSS classes for styling */
  className?: string;
  /** Whether the button is currently disabled */
  disabled?: boolean;
  /** Whether to show loading state */
  loading?: boolean;
  /** Custom aria-label for accessibility */
  'aria-label'?: string;
  /** Custom tooltip text */
  title?: string;
  /** Whether chevron should show as open */
  isOpen?: boolean;
  /** Custom button id */
  id?: string;
  /** Customization options */
  customization?: IconButtonCustomization;
}

// --- Default Sub-Components ---
const DefaultWalletIconContainer: React.FC<CustomWalletIconContainerProps> = ({
  walletName,
  walletIcon,
  showLoading,
  labels,
  className,
}) => {
  if (!walletName) return null;

  return (
    <div className={cn('novacon:flex-shrink-0 novacon:leading-[0]', className)}>
      <WalletIcon
        name={walletName}
        icon={walletIcon}
        altText={`${walletName} ${labels.walletIcon}`}
        showLoading={showLoading}
      />
    </div>
  );
};

const DefaultChainIconContainer: React.FC<CustomChainIconContainerProps> = ({ chainId, walletChainId, className }) => {
  return (
    <div className={cn('novacon:flex-shrink-0 novacon:leading-[0]', className)}>
      <Web3Icon chainId={chainId} title={`Network: ${walletChainId}`} className="novacon:w-6 novacon:h-6" />
    </div>
  );
};

const DefaultChevronContainer: React.FC<CustomChevronContainerProps> = ({ isOpen, className }) => {
  return (
    <div className={cn('novacon:flex-shrink-0 novacon:leading-[0]', className)}>
      <ChevronArrowWithAnim isOpen={isOpen} className="novacon:w-4 novacon:h-4" aria-hidden="true" />
    </div>
  );
};

const DefaultLoadingOverlay: React.FC<CustomLoadingOverlayProps> = ({ loading, className }) => {
  if (!loading) return null;

  return (
    <div
      className={cn(
        'novacon:absolute novacon:inset-0 novacon:bg-[var(--tuwa-bg-primary)]/50 novacon:rounded-full novacon:flex novacon:items-center novacon:justify-center',
        className,
      )}
      aria-hidden="true"
    >
      <div className="novacon:w-3 novacon:h-3 novacon:border-2 novacon:border-[var(--tuwa-text-accent)] novacon:border-t-transparent novacon:rounded-full novacon:animate-spin" />
    </div>
  );
};

const DefaultButtonContent: React.FC<CustomButtonContentProps> = ({
  walletIconContainer,
  chainIconContainer,
  chevronContainer,
  loadingOverlay,
}) => {
  return (
    <>
      {walletIconContainer}
      {chainIconContainer}
      {chevronContainer}
      {loadingOverlay}
    </>
  );
};

/**
 * Multi-purpose icon button component for wallets and chains with comprehensive customization.
 *
 * This component provides a unified interface for displaying wallet and chain information:
 * - Displays wallet icon with fallback to Web3Icon
 * - Shows chain/network icon when chain ID is provided
 * - Conditional chevron arrow for dropdown indicators
 * - Full WCAG accessibility support with proper ARIA labels
 * - Loading and disabled states with visual feedback
 * - Hover, active, and focus animations
 * - Comprehensive customization for all UI elements and behaviors
 * - Responsive design with consistent sizing
 * - Custom event handlers for enhanced interactivity
 * - Animation customization with reduced motion support
 * - Performance-optimized with memoized calculations
 *
 * The button automatically becomes interactive when onClick is provided and items > 1.
 * It supports both EVM chain IDs (numbers) and Solana network identifiers (strings).
 *
 * @example Basic usage
 * ```tsx
 * <IconButton
 *   walletName="MetaMask"
 *   walletIcon="https://example.com/metamask-icon.png"
 * />
 * ```
 *
 * @example Interactive chain selector with customization
 * ```tsx
 * <IconButton
 *   walletName="Phantom"
 *   walletChainId="mainnet-beta"
 *   items={3}
 *   onClick={handleChainSelect}
 *   isOpen={isDropdownOpen}
 *   customization={{
 *     classNames: {
 *       button: ({ isClickable }) =>
 *         `custom-button ${isClickable ? 'clickable' : 'static'}`,
 *       chevronContainer: ({ isOpen }) =>
 *         `custom-chevron ${isOpen ? 'open' : 'closed'}`,
 *     },
 *     handlers: {
 *       onClick: (originalHandler, event) => {
 *         console.log("Button clicked");
 *         originalHandler();
 *       },
 *       onHover: (isHovering) => {
 *         setTooltipVisible(isHovering);
 *       },
 *     },
 *     animation: {
 *       button: { duration: 0.3, ease: "easeOut" },
 *       chevron: { duration: 0.2 },
 *     },
 *     config: {
 *       showLoadingOverlay: true,
 *       reduceMotion: false,
 *     },
 *   }}
 * />
 * ```
 */
export const IconButton = forwardRef<Omit<HTMLButtonElement, 'style'>, IconButtonProps>(
  (
    {
      walletIcon,
      walletName,
      walletChainId,
      items = 0,
      onClick,
      className,
      disabled = false,
      loading = false,
      'aria-label': ariaLabel,
      title,
      isOpen = false,
      id,
      customization,
    },
    ref,
  ) => {
    const labels = useNovaConnectLabels();

    // Extract custom components and config
    const {
      WalletIconContainer = DefaultWalletIconContainer,
      ChainIconContainer = DefaultChainIconContainer,
      ChevronContainer = DefaultChevronContainer,
      LoadingOverlay = DefaultLoadingOverlay,
      ButtonContent = DefaultButtonContent,
    } = customization?.components ?? {};

    const {
      showWalletIcon = true,
      showChainIcon = true,
      showChevron = true,
      showLoadingOverlay = true,
      buttonTestId = 'icon-button',
      chainIdFormatter,
      disableAnimation = false,
      reduceMotion = false,
    } = customization?.config ?? {};

    /**
     * Determine if the button should be interactive
     */
    const isClickable = useMemo(
      () => Boolean(onClick && !disabled && !loading && items > 1),
      [onClick, disabled, loading, items],
    );

    /**
     * Generate chain ID for Web3Icon with custom formatting
     */
    const formattedChainId = useMemo(() => {
      if (!walletChainId) return undefined;

      if (chainIdFormatter) {
        return chainIdFormatter(walletChainId);
      }

      // If it's a string, assume it's a Solana network identifier
      if (typeof walletChainId === 'string') {
        return `${OrbitAdapter.SOLANA}:${walletChainId}`;
      }

      // If it's a number, use it directly as EVM chain ID
      return walletChainId;
    }, [walletChainId, chainIdFormatter]);

    /**
     * Check which icons are present
     */
    const hasWalletIcon = Boolean(walletName && showWalletIcon);
    const hasChainIcon = Boolean(formattedChainId && showChainIcon);
    const hasChevron = Boolean(isClickable && showChevron);
    const hasMultipleIcons = [hasWalletIcon, hasChainIcon, hasChevron].filter(Boolean).length > 1;

    /**
     * Generate accessible label with custom generator
     */
    const accessibleLabel = useMemo(() => {
      const customAriaLabel = customization?.accessibility?.ariaLabel;
      if (customAriaLabel) {
        return customAriaLabel({
          walletName,
          walletChainId,
          isClickable,
          loading,
          disabled,
        });
      }

      if (ariaLabel) return ariaLabel;

      const parts: string[] = [];

      if (walletName) parts.push(`${walletName} wallet`);
      if (walletChainId) parts.push('network selector');
      if (isClickable) parts.push('button');
      if (loading) parts.push('loading');
      if (disabled) parts.push('disabled');

      return parts.join(', ') || 'Wallet controls';
    }, [customization?.accessibility?.ariaLabel, ariaLabel, walletName, walletChainId, isClickable, loading, disabled]);

    /**
     * Generate tooltip text with custom generator
     */
    const tooltipText = useMemo(() => {
      const customTooltip = customization?.accessibility?.tooltip;
      if (customTooltip) {
        return customTooltip({
          walletName,
          walletChainId,
          isClickable,
          loading,
          disabled,
        });
      }

      if (title) return title;
      if (loading) return 'Loading...';
      if (disabled) return 'Button is disabled';
      if (isClickable) return `Click to select ${walletName ? walletName + ' ' : ''}options`;
      return walletName ? `${walletName} wallet` : 'Wallet information';
    }, [customization?.accessibility?.tooltip, title, loading, disabled, isClickable, walletName, walletChainId]);

    /**
     * Generate button classes with custom generator
     */
    const buttonClasses = useMemo(() => {
      const customButtonClasses = customization?.classNames?.button;
      if (customButtonClasses) {
        return customButtonClasses({
          isClickable,
          disabled,
          loading,
          hasMultipleIcons,
        });
      }

      return cn(
        // Base styles
        'novacon:flex novacon:items-center novacon:justify-center novacon:gap-1 novacon:rounded-full novacon:leading-[0]',
        'novacon:bg-[var(--tuwa-bg-primary)] novacon:border novacon:border-[var(--tuwa-border-primary)]',
        'novacon:p-1.5 novacon:transition-all novacon:duration-200 novacon:relative',

        // Icon sizing
        'novacon:[&_img]:w-6! novacon:[&_img]:h-6! novacon:[&_img]:transition-transform novacon:[&_img]:duration-200',

        // Interactive states
        {
          'novacon:cursor-pointer novacon:hover:[&_img]:scale-95 novacon:active:[&_img]:scale-85 novacon:hover:shadow-sm':
            isClickable,
          'novacon:cursor-not-allowed novacon:opacity-50': disabled && !loading,
          'novacon:cursor-wait novacon:opacity-75': loading,
          'novacon:cursor-default': !isClickable && !disabled && !loading,
        },

        // Focus states for accessibility
        'novacon:focus-visible:outline-none novacon:focus-visible:ring-2 novacon:focus-visible:ring-[var(--tuwa-border-accent)] novacon:focus-visible:ring-offset-2',

        className,
      );
    }, [customization?.classNames?.button, isClickable, disabled, loading, hasMultipleIcons, className]);

    /**
     * Event handlers with customization support
     */
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        if (isClickable && onClick) {
          const originalHandler = () => onClick();

          const customClickHandler = customization?.handlers?.onClick;
          if (customClickHandler) {
            customClickHandler(originalHandler, event);
          } else {
            originalHandler();
          }
        }
      },
      [isClickable, onClick, customization?.handlers?.onClick],
    );

    const handleMouseEnter = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        const customHoverHandler = customization?.handlers?.onHover;
        if (customHoverHandler) {
          customHoverHandler(true, event);
        }
      },
      [customization?.handlers?.onHover],
    );

    const handleMouseLeave = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        const customHoverHandler = customization?.handlers?.onHover;
        if (customHoverHandler) {
          customHoverHandler(false, event);
        }
      },
      [customization?.handlers?.onHover],
    );

    const handleFocus = useCallback(
      (event: React.FocusEvent<HTMLButtonElement>) => {
        const customFocusHandler = customization?.handlers?.onFocus;
        if (customFocusHandler) {
          customFocusHandler(event);
        }
      },
      [customization?.handlers?.onFocus],
    );

    const handleBlur = useCallback(
      (event: React.FocusEvent<HTMLButtonElement>) => {
        const customBlurHandler = customization?.handlers?.onBlur;
        if (customBlurHandler) {
          customBlurHandler(event);
        }
      },
      [customization?.handlers?.onBlur],
    );

    /**
     * Generate child components
     */
    const walletIconContainer = useMemo(() => {
      if (!hasWalletIcon) return null;

      const walletIconCustomClasses = customization?.classNames?.walletIconContainer;

      return (
        <WalletIconContainer
          walletName={walletName}
          walletIcon={walletIcon}
          showLoading={loading}
          labels={labels}
          className={walletIconCustomClasses?.({
            showLoading: loading,
            hasWalletIcon,
          })}
        />
      );
    }, [
      hasWalletIcon,
      WalletIconContainer,
      walletName,
      walletIcon,
      loading,
      labels,
      customization?.classNames?.walletIconContainer,
    ]);

    const chainIconContainer = useMemo(() => {
      if (!hasChainIcon || !formattedChainId) return null;

      const chainIconCustomClasses = customization?.classNames?.chainIconContainer;

      return (
        <ChainIconContainer
          chainId={formattedChainId}
          walletChainId={walletChainId}
          className={chainIconCustomClasses?.({ hasChainIcon })}
        />
      );
    }, [
      hasChainIcon,
      formattedChainId,
      ChainIconContainer,
      walletChainId,
      customization?.classNames?.chainIconContainer,
    ]);

    const chevronContainer = useMemo(() => {
      if (!hasChevron) return null;
      const chevronCustomClasses = customization?.classNames?.chevronContainer;
      return <ChevronContainer isOpen={isOpen} className={chevronCustomClasses?.({ isOpen, isClickable })} />;
    }, [hasChevron, ChevronContainer, isOpen, isClickable, customization?.classNames?.chevronContainer]);

    const loadingOverlay = useMemo(() => {
      if (!showLoadingOverlay) return null;
      const loadingCustomClasses = customization?.classNames?.loadingOverlay;
      return <LoadingOverlay loading={loading} className={loadingCustomClasses?.({ loading })} />;
    }, [showLoadingOverlay, LoadingOverlay, loading, customization?.classNames?.loadingOverlay]);

    /**
     * Animation variants
     */
    const buttonVariants = customization?.variants?.button || DEFAULT_BUTTON_ANIMATION_VARIANTS;

    /**
     * Base button props without motion-specific properties
     */
    const baseButtonProps = useMemo(
      () => ({
        type: 'button' as const,
        id,
        className: buttonClasses,
        onClick: handleClick,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleFocus,
        onBlur: handleBlur,
        disabled: disabled || loading,
        'aria-label': accessibleLabel,
        'aria-describedby': customization?.accessibility?.ariaDescribedBy,
        title: tooltipText,
        role: customization?.accessibility?.role || 'button',
        tabIndex: disabled || loading ? -1 : 0,
        'data-testid': buttonTestId,
        ...customization?.buttonProps,
      }),
      [
        id,
        buttonClasses,
        handleClick,
        handleMouseEnter,
        handleMouseLeave,
        handleFocus,
        handleBlur,
        disabled,
        loading,
        accessibleLabel,
        customization?.accessibility?.ariaDescribedBy,
        tooltipText,
        customization?.accessibility?.role,
        buttonTestId,
        customization?.buttonProps,
      ],
    );

    const buttonContent = (
      <ButtonContent
        walletIconContainer={walletIconContainer}
        chainIconContainer={chainIconContainer}
        chevronContainer={chevronContainer}
        loadingOverlay={loadingOverlay}
        hasWalletIcon={hasWalletIcon}
        hasChainIcon={hasChainIcon}
        hasChevron={hasChevron}
        loading={loading}
        disabled={disabled}
        isClickable={isClickable}
      />
    );

    if (disableAnimation || reduceMotion) {
      return (
        <button ref={ref as React.ForwardedRef<HTMLButtonElement>} {...baseButtonProps}>
          {buttonContent}
        </button>
      );
    }

    return (
      <motion.button
        ref={ref as React.ForwardedRef<HTMLButtonElement>}
        {...baseButtonProps}
        variants={buttonVariants}
        initial="idle"
        whileHover={isClickable ? 'hover' : 'idle'}
        whileTap={isClickable ? 'tap' : 'idle'}
        animate={loading ? 'loading' : 'idle'}
        transition={{
          duration: customization?.animation?.button?.duration ?? 0.2,
          ease: customization?.animation?.button?.ease ?? 'easeInOut',
          delay: customization?.animation?.button?.delay ?? 0,
        }}
      >
        {buttonContent}
      </motion.button>
    );
  },
);

IconButton.displayName = 'IconButton';
