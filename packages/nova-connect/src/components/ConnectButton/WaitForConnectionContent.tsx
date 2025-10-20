/**
 * @file This file contains the `WaitForConnectionContent` component, a customizable connection prompt with comprehensive styling control and animation options.
 */

import { cn } from '@tuwaio/nova-core';
import { type Easing, type HTMLMotionProps, motion, type TargetAndTransition, type Variants } from 'framer-motion';
import { ComponentPropsWithoutRef, ComponentType, forwardRef, ReactNode, useMemo } from 'react';

import { useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';

// --- Default Motion Variants ---
const DEFAULT_PATH_ANIMATION_VARIANTS: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
};

const DEFAULT_CONTAINER_VARIANTS: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
};

// --- Types for Customization ---
type CustomIconProps = {
  pathData: string;
  className?: string;
  'aria-hidden'?: boolean;
  focusable?: boolean;
};

type CustomPathProps = {
  pathData: string;
  variants?: Variants;
  className?: string;
  strokeLinecap?: 'butt' | 'round' | 'square';
  strokeLinejoin?: 'miter' | 'bevel' | 'round';
  strokeWidth?: string | number;
};

type CustomTextProps = {
  text: string;
  className?: string;
  'aria-hidden'?: boolean;
  role?: string;
};

type CustomContentProps = {
  icon: ReactNode;
  text: ReactNode;
  isConnected: boolean;
  finalAriaLabel: string;
};

/**
 * Customization options for WaitForConnectionContent component
 */
export type WaitForConnectionContentCustomization = {
  /** Override container element props */
  containerProps?: Partial<Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit' | 'variants' | 'transition'>>;
  /** Custom components */
  components?: {
    /** Custom icon SVG component */
    Icon?: ComponentType<CustomIconProps>;
    /** Custom path component */
    Path?: ComponentType<CustomPathProps>;
    /** Custom text component */
    Text?: ComponentType<CustomTextProps>;
    /** Custom content component (wraps everything) */
    Content?: ComponentType<CustomContentProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { isConnected: boolean }) => string;
    /** Function to generate icon classes */
    icon?: (params: { isConnected: boolean }) => string;
    /** Function to generate path classes */
    path?: () => string;
    /** Function to generate text classes */
    text?: (params: { isConnected: boolean }) => string;
  };
  /** Custom animation variants */
  variants?: {
    /** Container motion variants */
    container?: Variants;
    /** Path motion variants */
    path?: Variants;
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
    /** Path animation configuration */
    path?: {
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
    /** Custom viewBox */
    viewBox?: string;
    /** Custom stroke width */
    strokeWidth?: string | number;
    /** Custom stroke linecap */
    strokeLinecap?: 'butt' | 'round' | 'square';
    /** Custom stroke linejoin */
    strokeLinejoin?: 'miter' | 'bevel' | 'round';
    /** Custom wallet icon path */
    pathData?: string;
  };
  /** Configuration options */
  config?: {
    /** Whether to disable animations */
    disableAnimation?: boolean;
    /** Whether to reduce motion for accessibility */
    reduceMotion?: boolean;
    /** Whether to hide the component when connected */
    hideWhenConnected?: boolean;
    /** Custom text to display */
    customText?: string;
  };
};

export interface WaitForConnectionContentProps
  extends Omit<
    HTMLMotionProps<'div'>,
    'children' | 'initial' | 'animate' | 'exit' | 'variants' | 'transition' | 'style'
  > {
  /** Custom CSS classes for the container */
  className?: string;
  /** Custom aria-label for the container */
  'aria-label'?: string;
  /** Customization options */
  customization?: WaitForConnectionContentCustomization;
}

// --- Default Sub-Components ---
const DefaultIcon = ({
  pathData,
  className,
  'aria-hidden': ariaHidden = true,
  focusable = false,
  ...props
}: CustomIconProps & Omit<ComponentPropsWithoutRef<'svg'>, 'style'>) => {
  return (
    <svg
      className={cn('novacon:w-5 novacon:h-5', className)}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden={ariaHidden}
      focusable={focusable ? 'true' : 'false'}
      {...props}
    >
      <DefaultPath pathData={pathData} />
    </svg>
  );
};

const DefaultPath = ({
  pathData,
  variants = DEFAULT_PATH_ANIMATION_VARIANTS,
  className,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  strokeWidth = 1.5,
  ...props
}: CustomPathProps & Omit<ComponentPropsWithoutRef<typeof motion.path>, 'style'>) => {
  return (
    <motion.path
      d={pathData}
      strokeLinecap={strokeLinecap}
      strokeLinejoin={strokeLinejoin}
      strokeWidth={strokeWidth}
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        duration: 0.5,
        ease: 'easeInOut',
        delay: 0.1,
      }}
      className={className}
      {...props}
    />
  );
};

const DefaultText = ({
  text,
  className,
  'aria-hidden': ariaHidden = true,
  role = 'text',
  ...props
}: CustomTextProps & Omit<ComponentPropsWithoutRef<'span'>, 'style'>) => {
  return (
    <span className={cn('novacon:font-medium', className)} role={role} aria-hidden={ariaHidden} {...props}>
      {text}
    </span>
  );
};

const DefaultContent = ({ icon, text }: Pick<CustomContentProps, 'icon' | 'text'>) => {
  return (
    <>
      {icon}
      {text}
    </>
  );
};

/**
 * A highly customizable connection prompt component with extensive styling options and accessibility features.
 * Displays an animated wallet icon and text prompting users to connect their wallet, with comprehensive customization support.
 *
 * Features:
 * - Animated container and wallet icon with Framer Motion
 * - Comprehensive customization for all visual elements and animations
 * - Full accessibility support with ARIA labels and proper roles
 * - Configurable animation timing and easing
 * - Reduced motion support for accessibility
 * - Custom SVG properties and path styling
 * - Conditional rendering based on connection status
 * - Performance-optimized with memoized calculations
 * - Custom text and icon support
 *
 * @example Basic usage
 * ```tsx
 * <WaitForConnectionContent />
 * ```
 *
 * @example With full customization
 * ```tsx
 * <WaitForConnectionContent
 *   customization={{
 *     classNames: {
 *       container: ({ isConnected }) =>
 *         `custom-container ${isConnected ? 'connected' : 'disconnected'}`,
 *       text: () => "custom-text-styling text-blue-500",
 *     },
 *     animation: {
 *       container: { duration: 0.8, ease: "easeOut" },
 *       path: { duration: 1.2, delay: 0.3 },
 *     },
 *     variants: {
 *       container: {
 *         initial: { scale: 0, rotate: -180 },
 *         animate: { scale: 1, rotate: 0 },
 *       },
 *     },
 *     svg: {
 *       strokeWidth: 2,
 *       strokeLinecap: "square",
 *       pathData: "M12 2L2 7v10l10 5 10-5V7L12 2z", // Custom wallet icon
 *     },
 *     config: {
 *       customText: "Please Connect Your Wallet",
 *       hideWhenConnected: true,
 *       reduceMotion: false,
 *     },
 *   }}
 * />
 * ```
 */
export const WaitForConnectionContent = forwardRef<HTMLDivElement, WaitForConnectionContentProps>(
  ({ className, 'aria-label': ariaLabel, customization, ...props }, ref) => {
    const labels = useNovaConnectLabels();
    const { activeWallet } = useNovaConnect();

    // Memoize connection status check for better performance
    const isConnected = useMemo(() => Boolean(activeWallet?.isConnected), [activeWallet?.isConnected]);

    // Extract custom components
    const {
      Icon = DefaultIcon,
      Path = DefaultPath,
      Text = DefaultText,
      Content = DefaultContent,
    } = customization?.components ?? {};

    // Configuration options
    const {
      hideWhenConnected = true,
      customText,
      disableAnimation = false,
      reduceMotion = false,
    } = customization?.config ?? {};

    // Memoize the text to display
    const displayText = useMemo(() => {
      return customText || labels.connectWallet;
    }, [customText, labels.connectWallet]);

    // Memoize the default aria-label
    const defaultAriaLabel = useMemo(() => {
      return labels.connectWallet;
    }, [labels.connectWallet]);

    // Memoize the final aria-label
    const finalAriaLabel = useMemo(() => {
      return ariaLabel || defaultAriaLabel;
    }, [ariaLabel, defaultAriaLabel]);

    // Default wallet icon path
    const defaultPathData =
      'M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3';

    // Get path data
    const pathData = useMemo(() => {
      return customization?.svg?.pathData || defaultPathData;
    }, [customization?.svg?.pathData, defaultPathData]);

    // Generate container classes
    const containerClasses = useMemo(() => {
      if (customization?.classNames?.container) {
        return customization.classNames.container({ isConnected });
      }
      return cn('novacon:flex novacon:items-center novacon:gap-2', className);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.container, isConnected, className]);

    // Generate icon classes
    const iconClasses = useMemo(() => {
      if (customization?.classNames?.icon) {
        return customization.classNames.icon({ isConnected });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.icon, isConnected]);

    // Generate text classes
    const textClasses = useMemo(() => {
      if (customization?.classNames?.text) {
        return customization.classNames.text({ isConnected });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.text, isConnected]);

    // Generate path classes
    const pathClasses = useMemo(() => {
      if (customization?.classNames?.path) {
        return customization.classNames.path();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.path]);

    // Resolve animation variants
    const containerVariants = useMemo(() => {
      if (customization?.variants?.container) {
        return customization.variants.container;
      }

      return DEFAULT_CONTAINER_VARIANTS;
    }, [customization?.variants?.container]);

    const pathVariants = useMemo(() => {
      if (customization?.variants?.path) {
        return customization.variants.path;
      }

      return DEFAULT_PATH_ANIMATION_VARIANTS;
    }, [customization?.variants?.path]);

    // Resolve animation configuration
    const containerAnimation = useMemo(() => {
      const config = customization?.animation?.container;

      return {
        duration: config?.duration ?? 0.3,
        ease: config?.ease ?? [0.4, 0, 0.2, 1],
        delay: config?.delay ?? 0,
      };
    }, [customization?.animation?.container]);

    const pathAnimation = useMemo(() => {
      const config = customization?.animation?.path;

      return {
        duration: config?.duration ?? 0.5,
        ease: config?.ease ?? 'easeInOut',
        delay: config?.delay ?? 0.1,
      };
    }, [customization?.animation?.path]);

    // Create icon element
    const iconElement = useMemo(() => {
      if (customization?.components?.Icon) {
        return <Icon pathData={pathData} className={iconClasses} aria-hidden={true} focusable={false} />;
      }

      return (
        <svg
          className={cn('novacon:w-5 novacon:h-5', iconClasses)}
          fill="none"
          viewBox={customization?.svg?.viewBox ?? '0 0 24 24'}
          stroke="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <Path
            pathData={pathData}
            variants={disableAnimation || reduceMotion ? {} : pathVariants}
            className={pathClasses}
            strokeLinecap={customization?.svg?.strokeLinecap ?? 'round'}
            strokeLinejoin={customization?.svg?.strokeLinejoin ?? 'round'}
            strokeWidth={customization?.svg?.strokeWidth ?? 1.5}
            {...(!disableAnimation && !reduceMotion
              ? {
                  initial: 'hidden',
                  animate: 'visible',
                  transition: pathAnimation,
                }
              : {})}
          />
        </svg>
      );
    }, [
      customization?.svg,
      customization?.components?.Icon,
      Icon,
      Path,
      pathData,
      iconClasses,
      pathClasses,
      disableAnimation,
      reduceMotion,
      pathVariants,
      pathAnimation,
    ]);

    // Create text element
    const textElement = useMemo(() => {
      return <Text text={displayText} className={textClasses} aria-hidden={true} role="text" />;
    }, [Text, displayText, textClasses]);

    // Base props without animation properties
    const baseProps = useMemo(
      () => ({
        ...customization?.containerProps,
        ...props,
        ref,
        className: containerClasses,
        role: 'img' as const,
        'aria-label': finalAriaLabel,
      }),
      [customization, props, ref, containerClasses, finalAriaLabel],
    );

    // Don't render if wallet is already connected and hideWhenConnected is true
    if (isConnected && hideWhenConnected) return null;

    // Conditional rendering with proper animation types
    if (disableAnimation || reduceMotion) {
      return (
        <motion.div {...baseProps}>
          {customization?.components?.Content ? (
            <Content icon={iconElement} text={textElement} isConnected={isConnected} finalAriaLabel={finalAriaLabel} />
          ) : (
            <DefaultContent icon={iconElement} text={textElement} />
          )}
        </motion.div>
      );
    }

    return (
      <motion.div
        {...baseProps}
        initial={containerVariants.initial as TargetAndTransition}
        animate={containerVariants.animate as TargetAndTransition}
        exit={containerVariants.exit as TargetAndTransition}
        transition={containerAnimation}
      >
        {customization?.components?.Content ? (
          <Content icon={iconElement} text={textElement} isConnected={isConnected} finalAriaLabel={finalAriaLabel} />
        ) : (
          <DefaultContent icon={iconElement} text={textElement} />
        )}
      </motion.div>
    );
  },
);

WaitForConnectionContent.displayName = 'WaitForConnectionContent';
