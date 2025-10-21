/**
 * @file GetWallet component with comprehensive customization options and staggered animations.
 */

import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { cn, StarsBackground } from '@tuwaio/nova-core';
import { AnimatePresence, motion } from 'framer-motion';
import React, { ComponentType, forwardRef, useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';

// --- Types ---

/**
 * Configuration for wallet icons in the animation
 */
export interface WalletIconConfig {
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
    /** Animation duration in milliseconds */
    duration: number;
    /** Animation delay in milliseconds */
    delay: number;
    /** Whether to reverse animation direction */
    reverse?: boolean;
    /** Animation easing function */
    ease?: string;
  };
  /** ARIA label for the wallet icon */
  ariaLabel?: string;
}

// --- Component Props Types ---
type ContainerProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
  'data-testid'?: string;
} & React.RefAttributes<HTMLElement>;

type AnimationSectionProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
};

type StarsBackgroundProps = {
  className?: string;
  show: boolean;
  'aria-hidden'?: boolean;
};

type GradientOverlayProps = {
  className?: string;
  'aria-hidden'?: boolean;
};

type AnimationWrapperProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
  enableAnimations: boolean;
  animationDelay?: number;
  animationDuration?: number;
};

type WalletIconProps = {
  config: WalletIconConfig;
  enableAnimations: boolean;
  className?: string;
};

type ContentSectionProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
};

type TitleProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-level'?: number;
};

type DescriptionProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
};

type ScreenReaderProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Customization options for GetWallet component
 */
export type GetWalletCustomization = {
  /** Custom components */
  components?: {
    /** Custom container wrapper */
    Container?: ComponentType<ContainerProps>;
    /** Custom animation section */
    AnimationSection?: ComponentType<AnimationSectionProps>;
    /** Custom stars background */
    StarsBackground?: ComponentType<StarsBackgroundProps>;
    /** Custom gradient overlay */
    GradientOverlay?: ComponentType<GradientOverlayProps>;
    /** Custom animation wrapper */
    AnimationWrapper?: ComponentType<AnimationWrapperProps>;
    /** Custom wallet icon display */
    WalletIcon?: ComponentType<WalletIconProps>;
    /** Custom content section */
    ContentSection?: ComponentType<ContentSectionProps>;
    /** Custom title component */
    Title?: ComponentType<TitleProps>;
    /** Custom description component */
    Description?: ComponentType<DescriptionProps>;
    /** Custom screen reader component */
    ScreenReader?: ComponentType<ScreenReaderProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { compact: boolean }) => string;
    /** Function to generate animation section classes */
    animationSection?: (params: { compact: boolean }) => string;
    /** Function to generate stars background classes */
    starsBackground?: () => string;
    /** Function to generate gradient overlay classes */
    gradientOverlay?: () => string;
    /** Function to generate animation wrapper classes */
    animationWrapper?: () => string;
    /** Function to generate wallet icon classes */
    walletIcon?: (params: { config: WalletIconConfig; enableAnimations: boolean }) => string;
    /** Function to generate content section classes */
    contentSection?: (params: { compact: boolean }) => string;
    /** Function to generate title classes */
    title?: (params: { compact: boolean }) => string;
    /** Function to generate description classes */
    description?: () => string;
    /** Function to generate screen reader classes */
    screenReader?: () => string;
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom handler for component mount */
    onMount?: () => void;
    /** Custom handler for component unmount */
    onUnmount?: () => void;
    /** Custom handler for animation start */
    onAnimationStart?: () => void;
    /** Custom handler for animation complete */
    onAnimationComplete?: () => void;
  };
  /** Configuration options */
  config?: {
    /** Custom ARIA labels */
    ariaLabels?: {
      container?: string;
      animationSection?: string;
      animationWrapper?: string;
      contentSection?: string;
    };
    /** Animation configuration overrides */
    animation?: {
      /** Global animation duration multiplier */
      durationMultiplier?: number;
      /** Global animation delay multiplier */
      delayMultiplier?: number;
      /** Default easing function */
      defaultEase?: string;
    };
  };
};

/**
 * Props for the GetWallet component
 */
export interface GetWalletProps {
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
  /** Customization options */
  customization?: GetWalletCustomization;
}

/**
 * Default wallet icons configuration with staggered animations
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
      duration: 3500,
      delay: 200,
      ease: 'ease-in-out',
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
      duration: 5000,
      delay: 800,
      reverse: true,
      ease: 'ease-out',
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
      duration: 8000,
      delay: 4000,
      ease: 'ease-in-out',
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
      duration: 4500,
      delay: 2500,
      reverse: true,
      ease: 'ease-in',
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
      duration: 4000,
      delay: 500,
      ease: 'ease-out',
    },
    ariaLabel: 'Phantom Wallet icon',
  },
];

// --- Default Sub-Components ---
const DefaultContainer = forwardRef<HTMLElement, ContainerProps>(({ children, className, ...props }, ref) => (
  <section ref={ref} className={className} {...props}>
    {children}
  </section>
));
DefaultContainer.displayName = 'DefaultContainer';

const DefaultAnimationSection: React.FC<AnimationSectionProps> = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

const DefaultStarsBackground: React.FC<StarsBackgroundProps> = ({ className, show, ...props }) => (
  <>
    {show && (
      <div className={className} {...props}>
        <StarsBackground />
      </div>
    )}
  </>
);

const DefaultGradientOverlay: React.FC<GradientOverlayProps> = ({ className, ...props }) => (
  <div className={className} {...props} />
);

const DefaultAnimationWrapper: React.FC<AnimationWrapperProps> = ({
  children,
  className,
  enableAnimations,
  animationDelay = 0,
  animationDuration = 500,
  ...props
}) => {
  if (!enableAnimations) {
    return (
      <div className={className} {...props}>
        {children}
      </div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        animate={{ opacity: 1, scale: 1 }}
        initial={{ opacity: 0, scale: 0.1 }}
        transition={{
          duration: animationDuration / 1000,
          delay: animationDelay / 1000,
          ease: 'easeOut',
        }}
        className={className}
        {...props}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

const DefaultWalletIcon: React.FC<WalletIconProps> = ({ config, enableAnimations, className }) => {
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

  const animationClasses = useMemo(() => {
    if (!enableAnimations) return '';
    return 'novacon:animate-[float_var(--float-duration,3000ms)_var(--float-ease,ease-in-out)_var(--float-delay,0ms)_infinite_var(--float-direction,normal)]';
  }, [enableAnimations]);

  const animationStyle = useMemo(() => {
    if (!enableAnimations) return {};

    return {
      '--float-duration': `${animation.duration}ms`,
      '--float-delay': `${animation.delay}ms`,
      '--float-ease': animation.ease || 'ease-in-out',
      '--float-direction': animation.reverse ? 'reverse' : 'normal',
    } as React.CSSProperties;
  }, [enableAnimations, animation]);

  return (
    <div
      className={cn(positionClasses, sizeClasses, animationClasses, className)}
      style={{ ...animationStyle }}
      role="img"
      aria-label={ariaLabel || `${walletKey} wallet icon`}
      data-testid={`wallet-icon-${walletKey}`}
    >
      <Web3Icon walletKey={walletKey} />
    </div>
  );
};

const DefaultContentSection: React.FC<ContentSectionProps> = ({ children, className, ...props }) => (
  <div className={className} {...props}>
    {children}
  </div>
);

const DefaultTitle: React.FC<TitleProps> = ({ children, className, ...props }) => (
  <h2 className={className} {...props}>
    {children}
  </h2>
);

const DefaultDescription: React.FC<DescriptionProps> = ({ children, className, ...props }) => (
  <p className={className} {...props}>
    {children}
  </p>
);

const DefaultScreenReader: React.FC<ScreenReaderProps> = ({ children, className }) => (
  <div className={className}>{children}</div>
);

/**
 * Educational wallet introduction component with animated icons and comprehensive customization
 *
 * This component provides an engaging introduction to Web3 wallets featuring:
 * - Animated floating wallet icons with individual staggered animations and delays
 * - Educational content explaining Web3 wallet importance
 * - Responsive design with mobile-first approach
 * - Full accessibility support with proper ARIA labeling
 * - Internationalization support for all text content
 * - Performance optimizations with memoized calculations
 * - Customizable animations and icon configurations
 * - Semantic HTML structure for screen readers
 * - Proper focus management and keyboard navigation
 * - Full customization of all child components
 *
 * Animation features:
 * - Individual animation delays for each wallet icon using CSS custom properties
 * - Customizable duration, easing, and direction per icon
 * - Staggered floating animations for visual appeal
 * - Motion reduction respect (prefers-reduced-motion)
 * - Smooth entrance animations with framer-motion
 *
 * @example Basic usage
 * ```tsx
 * <GetWallet />
 * ```
 *
 * @example With customization
 * ```tsx
 * <GetWallet
 *   compact
 *   customization={{
 *     classNames: {
 *       container: ({ compact }) => compact ? 'custom-compact' : 'custom-full',
 *       title: () => 'custom-title-styling'
 *     },
 *     components: {
 *       WalletIcon: CustomWalletIcon
 *     },
 *     config: {
 *       animation: {
 *         durationMultiplier: 1.5,
 *         delayMultiplier: 0.8
 *       }
 *     }
 *   }}
 * />
 * ```
 */
export const GetWallet = forwardRef<HTMLElement, GetWalletProps>(
  (
    {
      className,
      'aria-label': ariaLabel,
      'data-testid': testId,
      compact = false,
      enableAnimations = true,
      customWalletIcons,
      showStarsBackground = true,
      customization,
    },
    ref,
  ) => {
    // Get localized labels for UI text
    const labels = useNovaConnectLabels();

    // Extract customization options
    const {
      Container: CustomContainer = DefaultContainer,
      AnimationSection: CustomAnimationSection = DefaultAnimationSection,
      StarsBackground: CustomStarsBackground = DefaultStarsBackground,
      GradientOverlay: CustomGradientOverlay = DefaultGradientOverlay,
      AnimationWrapper: CustomAnimationWrapper = DefaultAnimationWrapper,
      WalletIcon: CustomWalletIcon = DefaultWalletIcon,
      ContentSection: CustomContentSection = DefaultContentSection,
      Title: CustomTitle = DefaultTitle,
      Description: CustomDescription = DefaultDescription,
      ScreenReader: CustomScreenReader = DefaultScreenReader,
    } = customization?.components ?? {};

    const customHandlers = customization?.handlers;
    const customConfig = customization?.config;

    /**
     * Memoized wallet icons configuration with applied multipliers
     */
    const walletIcons = useMemo(() => {
      const icons = customWalletIcons || defaultWalletIcons;
      const durationMultiplier = customConfig?.animation?.durationMultiplier ?? 1;
      const delayMultiplier = customConfig?.animation?.delayMultiplier ?? 1;

      return icons.map((icon) => ({
        ...icon,
        animation: {
          ...icon.animation,
          duration: Math.round(icon.animation.duration * durationMultiplier),
          delay: Math.round(icon.animation.delay * delayMultiplier),
          ease: icon.animation.ease || customConfig?.animation?.defaultEase || 'ease-in-out',
        },
      }));
    }, [customWalletIcons, customConfig?.animation]);

    /**
     * Memoized container classes
     */
    const containerClasses = useMemo(() => {
      const defaultClasses = cn('novacon:m-[-16px]', className);
      return customization?.classNames?.container?.({ compact }) ?? defaultClasses;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [compact, className, customization?.classNames?.container]);

    /**
     * Memoized animation section classes
     */
    const animationSectionClasses = useMemo(() => {
      const defaultClasses = cn(
        'novacon:relative novacon:w-full novacon:overflow-hidden novacon:p-4',
        compact ? 'novacon:h-48' : 'novacon:h-64',
      );
      return customization?.classNames?.animationSection?.({ compact }) ?? defaultClasses;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [compact, customization?.classNames?.animationSection]);

    /**
     * Memoized stars background classes
     */
    const starsBackgroundClasses = useMemo(
      () => customization?.classNames?.starsBackground?.() ?? '',
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [customization?.classNames?.starsBackground],
    );

    /**
     * Memoized gradient overlay classes
     */
    const gradientOverlayClasses = useMemo(() => {
      const defaultClasses = cn(
        'novacon:absolute novacon:inset-0 novacon:z-1',
        'novacon:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))]',
      );
      return customization?.classNames?.gradientOverlay?.() ?? defaultClasses;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.gradientOverlay]);

    /**
     * Memoized animation wrapper classes
     */
    const animationWrapperClasses = useMemo(() => {
      const defaultClasses = cn(
        'novacon:relative novacon:z-2 novacon:w-full novacon:h-full',
        'novacon:px-2 md:novacon:px-4',
      );
      return customization?.classNames?.animationWrapper?.() ?? defaultClasses;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.animationWrapper]);

    /**
     * Memoized content section classes
     */
    const contentSectionClasses = useMemo(() => {
      const defaultClasses = cn(
        'novacon:text-center',
        compact ? 'novacon:pb-3 novacon:px-2 novacon:md:px-3' : 'novacon:pb-4 novacon:px-2 novacon:md:px-4',
      );
      return customization?.classNames?.contentSection?.({ compact }) ?? defaultClasses;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [compact, customization?.classNames?.contentSection]);

    /**
     * Memoized title classes
     */
    const titleClasses = useMemo(() => {
      const defaultClasses = cn(
        'novacon:font-bold novacon:mb-2 novacon:text-[var(--tuwa-text-primary)]',
        compact ? 'novacon:text-lg' : 'novacon:text-xl',
      );
      return customization?.classNames?.title?.({ compact }) ?? defaultClasses;
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [compact, customization?.classNames?.title]);

    /**
     * Memoized description classes
     */
    const descriptionClasses = useMemo(
      () => customization?.classNames?.description?.() ?? 'novacon:text-[var(--tuwa-text-secondary)]',
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [customization?.classNames?.description],
    );

    /**
     * Memoized screen reader classes
     */
    const screenReaderClasses = useMemo(
      () => customization?.classNames?.screenReader?.() ?? 'novacon:sr-only',
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [customization?.classNames?.screenReader],
    );

    // Handle mount/unmount effects
    React.useEffect(() => {
      customHandlers?.onMount?.();
      return () => customHandlers?.onUnmount?.();
    }, [customHandlers]);

    return (
      <CustomContainer
        ref={ref}
        className={containerClasses}
        role="region"
        aria-label={customConfig?.ariaLabels?.container ?? ariaLabel ?? labels.startExploringWeb3}
        data-testid={testId}
      >
        {/* Animated Header Section */}
        <CustomAnimationSection
          className={animationSectionClasses}
          role="banner"
          aria-label={customConfig?.ariaLabels?.animationSection ?? 'Wallet icons animation'}
        >
          {/* Stars Background */}
          <CustomStarsBackground className={starsBackgroundClasses} show={showStarsBackground} aria-hidden />

          {/* Gradient Overlay */}
          <CustomGradientOverlay className={gradientOverlayClasses} aria-hidden />

          {/* Animated Wallet Icons */}
          <CustomAnimationWrapper
            className={animationWrapperClasses}
            role="group"
            aria-label={customConfig?.ariaLabels?.animationWrapper ?? `${labels.popular} wallet icons`}
            enableAnimations={enableAnimations}
            animationDelay={0}
            animationDuration={500}
          >
            {walletIcons.map((iconConfig) => (
              <CustomWalletIcon
                key={iconConfig.walletKey}
                config={iconConfig}
                enableAnimations={enableAnimations}
                className={customization?.classNames?.walletIcon?.({ config: iconConfig, enableAnimations })}
              />
            ))}

            {/* Screen reader content for animated icons */}
            <CustomScreenReader className={screenReaderClasses}>
              {labels.popular} wallets including {walletIcons.map((icon) => icon.walletKey).join(', ')} are displayed
              with floating animations to illustrate wallet variety.
            </CustomScreenReader>
          </CustomAnimationWrapper>
        </CustomAnimationSection>

        {/* Content Section */}
        <CustomContentSection className={contentSectionClasses} role="main">
          {/* Main Title */}
          <CustomTitle className={titleClasses} role="heading" aria-level={2}>
            {labels.startExploringWeb3}
          </CustomTitle>

          {/* Description */}
          <CustomDescription className={descriptionClasses} role="text">
            {labels.walletKeyToDigitalWorld}
          </CustomDescription>

          {/* Screen reader summary */}
          <CustomScreenReader className={screenReaderClasses}>
            Introduction to Web3 wallets. This section explains the importance of wallets for digital asset management
            and Web3 exploration. Various popular wallet options are visually represented above.
          </CustomScreenReader>
        </CustomContentSection>
      </CustomContainer>
    );
  },
);

GetWallet.displayName = 'GetWallet';
