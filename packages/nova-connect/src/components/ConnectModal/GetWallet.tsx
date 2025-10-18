import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { cn, StarsBackground } from '@tuwaio/nova-core';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';

/**
 * Props for the GetWallet component
 */
interface GetWalletProps {
  /** Custom CSS classes for styling the container */
  className?: string;
  /** Optional custom ARIA label for enhanced accessibility */
  'aria-label'?: string;
  /** Custom test ID for testing purposes */
  'data-testid'?: string;
  /** Whether to show the component in compact mode */
  compact?: boolean;
  /** Whether animations should be enabled */
  enableAnimations?: boolean;
  /** Custom wallet icons to display instead of defaults */
  customWalletIcons?: WalletIconConfig[];
  /** Whether to show the background stars animation */
  showStarsBackground?: boolean;
}

/**
 * Configuration for wallet icons in the animation
 */
interface WalletIconConfig {
  /** Wallet key for Web3Icon component */
  walletKey: string;
  /** Position configuration using predefined position classes */
  position: {
    /** Top position class (e.g., 'top-[5%]', 'top-4') */
    top?: string;
    /** Bottom position class (e.g., 'bottom-[10%]', 'bottom-4') */
    bottom?: string;
    /** Left position class (e.g., 'left-[5%]', 'left-4') */
    left?: string;
    /** Right position class (e.g., 'right-[10%]', 'right-4') */
    right?: string;
    /** Transform classes for centering */
    transform?: string;
  };
  /** Size configuration using predefined size classes */
  size: {
    /** Width and height classes for mobile */
    mobile: {
      width: string;
      height: string;
    };
    /** Width and height classes for desktop */
    desktop: {
      width: string;
      height: string;
    };
  };
  /** Animation configuration */
  animation: {
    /** Animation duration in seconds */
    duration: string;
    /** Animation delay in seconds */
    delay: string;
    /** Whether to reverse animation direction */
    reverse?: boolean;
  };
  /** ARIA label for the wallet icon */
  ariaLabel?: string;
}

/**
 * Default wallet icons configuration with proper Tailwind classes
 */
const defaultWalletIcons: WalletIconConfig[] = [
  {
    walletKey: 'metamask',
    position: {
      top: 'novacon:top-[5%]',
      left: 'novacon:left-[5%]',
    },
    size: {
      mobile: { width: 'novacon:w-20', height: 'novacon:h-20' },
      desktop: { width: 'novacon:md:w-24', height: 'novacon:md:h-24' },
    },
    animation: {
      duration: '[800ms]',
      delay: '[200ms]',
    },
    ariaLabel: 'MetaMask wallet icon',
  },
  {
    walletKey: 'coinbasewallet',
    position: {
      top: 'novacon:top-[10%]',
      right: 'novacon:right-[10%]',
    },
    size: {
      mobile: { width: 'novacon:w-16', height: 'novacon:h-16' },
      desktop: { width: 'novacon:md:w-20', height: 'novacon:md:h-20' },
    },
    animation: {
      duration: '[3000ms]',
      delay: '[2000ms]',
      reverse: true,
    },
    ariaLabel: 'Coinbase Wallet icon',
  },
  {
    walletKey: 'trustwallet',
    position: {
      top: 'novacon:top-[25%]',
      left: 'novacon:left-1/2',
      transform: 'novacon:-translate-x-1/2',
    },
    size: {
      mobile: { width: 'novacon:w-20', height: 'novacon:h-20' },
      desktop: { width: 'novacon:md:w-24', height: 'novacon:md:h-24' },
    },
    animation: {
      duration: '[1000ms]',
      delay: '[2500ms]',
    },
    ariaLabel: 'Trust Wallet icon',
  },
  {
    walletKey: 'bravewallet',
    position: {
      bottom: 'novacon:bottom-[10%]',
      left: 'novacon:left-[10%]',
    },
    size: {
      mobile: { width: 'novacon:w-20', height: 'novacon:h-20' },
      desktop: { width: 'novacon:md:w-20', height: 'novacon:md:h-20' },
    },
    animation: {
      duration: '[5000ms]',
      delay: '[1500ms]',
      reverse: true,
    },
    ariaLabel: 'Brave Wallet icon',
  },
  {
    walletKey: 'phantomwallet',
    position: {
      bottom: 'novacon:bottom-[15%]',
      right: 'novacon:right-[15%]',
    },
    size: {
      mobile: { width: 'novacon:w-14', height: 'novacon:h-14' },
      desktop: { width: 'novacon:md:w-18', height: 'novacon:md:h-18' },
    },
    animation: {
      duration: '[6000ms]',
      delay: '[400ms]',
    },
    ariaLabel: 'Phantom Wallet icon',
  },
];

/**
 * Individual wallet icon component with animation
 */
interface WalletIconDisplayProps {
  config: WalletIconConfig;
  enableAnimations: boolean;
}

const WalletIconDisplay: React.FC<WalletIconDisplayProps> = ({ config, enableAnimations }) => {
  const { walletKey, position, size, animation, ariaLabel } = config;

  const positionClasses = useMemo(() => {
    const classes = ['novacon:absolute'];

    if (position.top) classes.push(position.top);
    if (position.bottom) classes.push(position.bottom);
    if (position.left) classes.push(position.left);
    if (position.right) classes.push(position.right);
    if (position.transform) classes.push(position.transform);

    return cn(classes);
  }, [position]);

  const animationClasses = useMemo(() => {
    if (!enableAnimations) return '';

    const baseClasses = ['animate-float'];

    if (animation.reverse) baseClasses.push('direction-reverse');

    return cn(baseClasses, `duration-${animation.duration}`, `delay-${animation.delay}`);
  }, [enableAnimations, animation]);

  const sizeClasses = useMemo(() => {
    return cn(
      size.mobile.width,
      size.mobile.height,
      size.desktop.width,
      size.desktop.height,
      // Icon styling
      'novacon:[&>img]:w-full!',
      'novacon:[&>img]:h-full!',
      'novacon:[&>svg]:w-full!',
      'novacon:[&>svg]:h-full!',
    );
  }, [size]);

  return (
    <div
      className={cn(positionClasses, animationClasses, sizeClasses)}
      role="img"
      aria-label={ariaLabel || `${walletKey} wallet icon`}
      data-testid={`wallet-icon-${walletKey}`}
    >
      <Web3Icon walletKey={walletKey} />
    </div>
  );
};

/**
 * GetWallet component - Educational wallet introduction with animated icons
 *
 * This component provides an engaging introduction to Web3 wallets featuring:
 * - Animated floating wallet icons with customizable configurations
 * - Educational content explaining Web3 wallet importance
 * - Responsive design with mobile-first approach
 * - Full accessibility support with proper ARIA labeling
 * - Internationalization support for all text content
 * - Performance optimizations with memoized calculations
 * - Customizable animations and icon configurations
 * - Semantic HTML structure for screen readers
 * - Proper focus management and keyboard navigation
 *
 * Visual features:
 * - Animated stars background for visual appeal
 * - Floating wallet icons with staggered animations
 * - Responsive sizing for different screen sizes
 * - Smooth fade-in animations for content appearance
 * - Customizable color scheme using CSS variables
 *
 * Accessibility features:
 * - Proper ARIA labels for all interactive elements
 * - Screen reader friendly content structure
 * - Keyboard navigation support
 * - High contrast compatible styling
 * - Motion reduction respect (prefers-reduced-motion)
 * - Semantic HTML with proper heading hierarchy
 *
 * @param className - Custom CSS classes for container styling
 * @param aria-label - Custom ARIA label for enhanced accessibility
 * @param data-testid - Test identifier for testing purposes
 * @param compact - Whether to show in compact mode with reduced spacing
 * @param enableAnimations - Whether to enable floating animations (default: true)
 * @param customWalletIcons - Custom wallet icons configuration to override defaults
 * @param showStarsBackground - Whether to show animated stars background (default: true)
 * @returns JSX element displaying the wallet introduction section
 *
 * @example
 * ```tsx
 * <GetWallet />
 * ```
 *
 * @example
 * ```tsx
 * // With custom configuration
 * <GetWallet
 *   compact
 *   className="custom-wallet-intro"
 *   enableAnimations={!prefersReducedMotion}
 *   showStarsBackground={!prefersReducedMotion}
 *   data-testid="wallet-introduction"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // With custom wallet icons
 * <GetWallet
 *   customWalletIcons={[
 *     {
 *       walletKey: 'custom-wallet',
 *       position: {
 *         top: 'top-1/2',
 *         left: 'left-1/2',
 *         transform: '-translate-x-1/2 -translate-y-1/2'
 *       },
 *       size: {
 *         mobile: { width: 'w-24', height: 'h-24' },
 *         desktop: { width: 'md:w-32', height: 'md:h-32' }
 *       },
 *       animation: {
 *         duration: '[2000ms]',
 *         delay: '[0ms]'
 *       },
 *       ariaLabel: 'Custom Wallet icon'
 *     }
 *   ]}
 * />
 * ```
 *
 * @public
 */
export function GetWallet({
  className,
  'aria-label': ariaLabel,
  'data-testid': testId,
  compact = false,
  enableAnimations = true,
  customWalletIcons,
  showStarsBackground = true,
}: GetWalletProps) {
  // Get localized labels for UI text
  const labels = useNovaConnectLabels();

  /**
   * Memoized wallet icons configuration
   */
  const walletIcons = useMemo(() => customWalletIcons || defaultWalletIcons, [customWalletIcons]);

  /**
   * Memoized container classes
   */
  const containerClasses = useMemo(() => cn('novacon:m-[-16px]', className), [className]);

  /**
   * Memoized animation container classes
   */
  const animationContainerClasses = useMemo(
    () =>
      cn(
        'novacon:relative novacon:w-full novacon:overflow-hidden novacon:p-4',
        compact ? 'novacon:h-48' : 'novacon:h-64',
      ),
    [compact],
  );

  /**
   * Memoized content spacing classes
   */
  const contentSpacingClasses = useMemo(
    () =>
      cn(
        'novacon:text-center',
        compact ? 'novacon:pb-3 novacon:px-2 novacon:md:px-3' : 'novacon:pb-4 novacon:px-2 novacon:md:px-4',
      ),
    [compact],
  );

  /**
   * Memoized title classes
   */
  const titleClasses = useMemo(
    () =>
      cn(
        'novacon:font-bold novacon:mb-2 novacon:text-[var(--tuwa-text-primary)]',
        compact ? 'novacon:text-lg' : 'novacon:text-xl',
      ),
    [compact],
  );

  /**
   * Memoized gradient overlay classes
   */
  const gradientOverlayClasses = useMemo(
    () =>
      cn(
        'novacon:absolute novacon:inset-0 novacon:z-1',
        'novacon:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]',
      ),
    [],
  );

  /**
   * Memoized animation wrapper classes
   */
  const animationWrapperClasses = useMemo(
    () => cn('novacon:relative novacon:z-2 novacon:w-full novacon:h-full', 'novacon:px-2 md:novacon:px-4'),
    [],
  );

  return (
    <section
      className={containerClasses}
      role="region"
      aria-label={ariaLabel || labels.startExploringWeb3}
      data-testid={testId}
    >
      {/* Animated Header Section */}
      <div className={animationContainerClasses} role="banner" aria-label="Wallet icons animation">
        {/* Stars Background */}
        {showStarsBackground && (
          <div aria-hidden="true">
            <StarsBackground />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className={gradientOverlayClasses} aria-hidden="true" />

        {/* Animated Wallet Icons */}
        <AnimatePresence>
          <motion.div
            animate={{ opacity: 1, scale: 1 }}
            initial={{ opacity: 0, scale: 0.1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={animationWrapperClasses}
            role="group"
            aria-label={`${labels.popular} wallet icons`}
          >
            {walletIcons.map((iconConfig) => (
              <WalletIconDisplay key={iconConfig.walletKey} config={iconConfig} enableAnimations={enableAnimations} />
            ))}

            {/* Screen reader content for animated icons */}
            <div className="novacon:sr-only">
              {labels.popular} wallets including {walletIcons.map((icon) => icon.walletKey).join(', ')} are displayed
              with floating animations to illustrate wallet variety.
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Content Section */}
      <div className={contentSpacingClasses} role="main">
        {/* Main Title */}
        <h2 className={titleClasses} role="heading" aria-level={2}>
          {labels.startExploringWeb3}
        </h2>

        {/* Description */}
        <p className="novacon:text-[var(--tuwa-text-secondary)]" role="text">
          {labels.walletKeyToDigitalWorld}
        </p>

        {/* Screen reader summary */}
        <div className="novacon:sr-only">
          Introduction to Web3 wallets. This section explains the importance of wallets for digital asset management and
          Web3 exploration. Various popular wallet options are visually represented above.
        </div>
      </div>
    </section>
  );
}
