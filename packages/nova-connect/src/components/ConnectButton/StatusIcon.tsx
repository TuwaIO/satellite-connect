/**
 * @file This file contains the `StatusIcon` component, a customizable animated status icon with comprehensive styling control.
 */

import { cn } from '@tuwaio/nova-core';
import { type Easing, type HTMLMotionProps, motion, type TargetAndTransition, type Variants } from 'framer-motion';
import { ComponentPropsWithoutRef, ComponentType, forwardRef, ReactNode, useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';

// --- Default Motion Variants ---
const DEFAULT_MOTION_PATH_VARIANTS: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { pathLength: 1, opacity: 1 },
};

const DEFAULT_CONTAINER_VARIANTS: Variants = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
};

// --- Types for Customization ---
type CustomSvgProps = {
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

type CustomContentProps = {
  txStatus: 'succeed' | 'failed' | 'replaced';
  colorVar: string;
  pathData: string;
  finalAriaLabel: string;
};

/**
 * Customization options for StatusIcon component
 */
export type StatusIconCustomization = {
  /** Override container element props */
  containerProps?: Partial<
    Omit<HTMLMotionProps<'div'>, 'initial' | 'animate' | 'exit' | 'variants' | 'transition' | 'style'>
  >;
  /** Custom components */
  components?: {
    /** Custom SVG component */
    Svg?: ComponentType<CustomSvgProps>;
    /** Custom path component */
    Path?: ComponentType<CustomPathProps>;
    /** Custom content component (wraps everything) */
    Content?: ComponentType<CustomContentProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { txStatus: 'succeed' | 'failed' | 'replaced'; colorVar: string }) => string;
    /** Function to generate SVG classes */
    svg?: (params: { txStatus: 'succeed' | 'failed' | 'replaced'; colorVar: string }) => string;
    /** Function to generate path classes */
    path?: (params: { txStatus: 'succeed' | 'failed' | 'replaced' }) => string;
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
  };
  /** Configuration options */
  config?: {
    /** Whether to disable animations */
    disableAnimation?: boolean;
    /** Whether to reduce motion for accessibility */
    reduceMotion?: boolean;
  };
};

export interface StatusIconProps
  extends Omit<
    HTMLMotionProps<'div'>,
    'children' | 'initial' | 'animate' | 'exit' | 'variants' | 'transition' | 'style'
  > {
  /** Transaction status type */
  txStatus: 'succeed' | 'failed' | 'replaced';
  /** Color variable name (without --tuwa- prefix) */
  colorVar: string;
  /** SVG path data */
  children: ReactNode;
  /** Custom aria-label for accessibility */
  'aria-label'?: string;
  /** Custom CSS classes for the container */
  className?: string;
  /** Customization options */
  customization?: StatusIconCustomization;
}

// --- Default Sub-Components ---
const DefaultSvg = ({
  pathData,
  className,
  'aria-hidden': ariaHidden = true,
  focusable = false,
  ...props
}: CustomSvgProps & Omit<ComponentPropsWithoutRef<'svg'>, 'style'>) => {
  return (
    <svg
      className={cn('novacon:w-4 novacon:h-4', className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="2"
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
  variants = DEFAULT_MOTION_PATH_VARIANTS,
  className,
  strokeLinecap = 'round',
  strokeLinejoin = 'round',
  strokeWidth = 2,
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

const DefaultContent = ({ pathData, finalAriaLabel }: Pick<CustomContentProps, 'pathData' | 'finalAriaLabel'>) => {
  return <DefaultSvg pathData={pathData} aria-label={finalAriaLabel} />;
};

/**
 * A highly customizable animated status icon component with comprehensive styling and animation options.
 * Provides visual feedback for transaction states with smooth animations and full accessibility support.
 *
 * Features:
 * - Animated container and path with Framer Motion
 * - Comprehensive customization for all visual elements and animations
 * - Full accessibility support with ARIA labels and proper roles
 * - Status-based styling with CSS custom properties
 * - Configurable animation timing and easing
 * - Reduced motion support for accessibility
 * - Custom SVG properties and path styling
 * - Performance-optimized with memoized calculations
 *
 * @example Basic usage
 * ```tsx
 * <StatusIcon txStatus="succeed" colorVar="success">
 *   m4.5 12.75 6 6 9-13.5
 * </StatusIcon>
 * ```
 *
 * @example With full customization
 * ```tsx
 * <StatusIcon
 *   txStatus="failed"
 *   colorVar="error"
 *   customization={{
 *     classNames: {
 *       container: ({ txStatus }) => `custom-status-${txStatus} novacon:shadow-lg`,
 *       svg: () => "custom-svg-styling",
 *     },
 *     animation: {
 *       container: { duration: 0.5, ease: "easeOut" },
 *       path: { duration: 1, delay: 0.2 },
 *     },
 *     variants: {
 *       container: {
 *         initial: { rotate: -180, scale: 0 },
 *         animate: { rotate: 0, scale: 1 },
 *       },
 *     },
 *     svg: {
 *       strokeWidth: 3,
 *       strokeLinecap: "square",
 *     },
 *     config: {
 *       reduceMotion: false,
 *     },
 *   }}
 * >
 *   M6 18 18 6M6 6l12 12
 * </StatusIcon>
 * ```
 */
export const StatusIcon = forwardRef<HTMLDivElement, StatusIconProps>(
  ({ txStatus, colorVar, children, 'aria-label': ariaLabel, className, customization, ...props }, ref) => {
    const labels = useNovaConnectLabels();

    // Extract path data from children
    const pathData = useMemo(() => {
      return typeof children === 'string' ? children : '';
    }, [children]);

    // Extract custom components
    const { Svg = DefaultSvg, Path = DefaultPath, Content = DefaultContent } = customization?.components ?? {};

    // Memoize the default aria-label based on status
    const defaultAriaLabel = useMemo(() => {
      switch (txStatus) {
        case 'succeed':
          return labels.successIcon;
        case 'failed':
          return labels.errorIcon;
        case 'replaced':
          return labels.replacedIcon;
        default:
          return labels.statusIcon;
      }
    }, [txStatus, labels]);

    // Memoize the final aria-label
    const finalAriaLabel = useMemo(() => {
      return ariaLabel || defaultAriaLabel;
    }, [ariaLabel, defaultAriaLabel]);

    // Generate container classes
    const containerClasses = useMemo(() => {
      if (customization?.classNames?.container) {
        return customization.classNames.container({ txStatus, colorVar });
      }
      return cn(
        'novacon:w-6 novacon:h-6 novacon:rounded-full novacon:flex novacon:items-center novacon:justify-center novacon:shadow-sm',
        `novacon:text-[var(--tuwa-${colorVar}-text)] novacon:bg-[var(--tuwa-bg-primary)]`,
        className,
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.container, txStatus, colorVar, className]);

    // Generate SVG classes
    const svgClasses = useMemo(() => {
      if (customization?.classNames?.svg) {
        return customization.classNames.svg({ txStatus, colorVar });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.svg, txStatus, colorVar]);

    // Generate path classes
    const pathClasses = useMemo(() => {
      if (customization?.classNames?.path) {
        return customization.classNames.path({ txStatus });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.path, txStatus]);

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

      return DEFAULT_MOTION_PATH_VARIANTS;
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

    // Check for reduced motion
    const shouldReduceMotion = customization?.config?.reduceMotion ?? false;
    const isAnimationDisabled = customization?.config?.disableAnimation ?? false;

    // Create SVG element with custom props
    const svgElement = useMemo(() => {
      if (customization?.components?.Svg) {
        return <Svg pathData={pathData} className={svgClasses} aria-hidden={true} focusable={false} />;
      }

      return (
        <svg
          className={cn('novacon:w-4 novacon:h-4', svgClasses)}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox={customization?.svg?.viewBox ?? '0 0 24 24'}
          strokeWidth={customization?.svg?.strokeWidth ?? '2'}
          stroke="currentColor"
          aria-hidden="true"
          focusable="false"
        >
          <Path
            pathData={pathData}
            variants={isAnimationDisabled || shouldReduceMotion ? {} : pathVariants}
            className={pathClasses}
            strokeLinecap={customization?.svg?.strokeLinecap ?? 'round'}
            strokeLinejoin={customization?.svg?.strokeLinejoin ?? 'round'}
            strokeWidth={customization?.svg?.strokeWidth ?? 2}
            {...(!isAnimationDisabled && !shouldReduceMotion
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
      customization?.components?.Svg,
      customization?.svg,
      Svg,
      Path,
      pathData,
      svgClasses,
      pathClasses,
      isAnimationDisabled,
      shouldReduceMotion,
      pathVariants,
      pathAnimation,
    ]);

    // Base props without animation properties
    const baseProps = useMemo(
      () => ({
        ...customization?.containerProps,
        ...props,
        ref,
        key: txStatus,
        className: containerClasses,

        role: 'img' as const,
        'aria-label': finalAriaLabel,
      }),
      [customization?.containerProps, props, ref, txStatus, containerClasses, finalAriaLabel],
    );

    // Conditional rendering with proper animation types
    if (isAnimationDisabled || shouldReduceMotion) {
      return (
        <motion.div {...baseProps}>
          {customization?.components?.Content ? (
            <Content txStatus={txStatus} colorVar={colorVar} pathData={pathData} finalAriaLabel={finalAriaLabel} />
          ) : (
            svgElement
          )}
        </motion.div>
      );
    }

    return (
      <motion.div
        {...baseProps}
        // eslint-disable-next-line
        key={baseProps?.key ?? "status"}
        initial={containerVariants.initial as TargetAndTransition}
        animate={containerVariants.animate as TargetAndTransition}
        exit={containerVariants.exit as TargetAndTransition}
        transition={containerAnimation}
      >
        {customization?.components?.Content ? (
          <Content txStatus={txStatus} colorVar={colorVar} pathData={pathData} finalAriaLabel={finalAriaLabel} />
        ) : (
          svgElement
        )}
      </motion.div>
    );
  },
);

StatusIcon.displayName = 'StatusIcon';
