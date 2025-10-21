/**
 * @file RecentBadge component with comprehensive customization options and animated gradient border.
 */

import { cn, isTouchDevice } from '@tuwaio/nova-core';
import { motion } from 'framer-motion';
import React, { ComponentType, forwardRef, memo, useCallback, useMemo } from 'react';

// --- Types ---

/**
 * Animation configuration for the gradient border effect
 */
export interface BadgeAnimationConfig {
  /** Animation duration in seconds */
  duration: number;
  /** Animation easing function - using valid framer-motion easing values */
  ease:
    | 'linear'
    | 'easeIn'
    | 'easeOut'
    | 'easeInOut'
    | 'circIn'
    | 'circOut'
    | 'circInOut'
    | 'backIn'
    | 'backOut'
    | 'backInOut'
    | 'anticipate';
  /** Whether animation should repeat infinitely */
  repeat: boolean;
  /** Initial background position */
  initialPosition: string;
  /** Final background position */
  finalPosition: string;
}

/**
 * Gradient configuration for the border effect
 */
export interface BadgeGradientConfig {
  /** Direction of the gradient (e.g., '90deg', '45deg') */
  direction: string;
  /** Color stops for the gradient */
  stops: Array<{
    /** Position percentage (0-100) */
    position: number;
    /** Color value (CSS color, CSS variable, or rgba) */
    color: string;
  }>;
  /** Background size for animation effect */
  backgroundSize: string;
}

// --- Component Props Types ---
type ContainerProps = {
  className?: string;
  children: React.ReactNode;
  role?: string;
  'aria-label'?: string;
} & React.RefAttributes<HTMLSpanElement>;

type AnimatedGradientProps = {
  className?: string;
  animated: boolean;
  animationConfig: BadgeAnimationConfig;
  gradientConfig: BadgeGradientConfig;
};

type BackgroundOverlayProps = {
  className?: string;
};

type ContentProps = {
  className?: string;
  children: React.ReactNode;
};

/**
 * Customization options for RecentBadge component
 */
export type RecentBadgeCustomization = {
  /** Custom components */
  components?: {
    /** Custom container wrapper */
    Container?: ComponentType<ContainerProps>;
    /** Custom animated gradient component */
    AnimatedGradient?: ComponentType<AnimatedGradientProps>;
    /** Custom background overlay */
    BackgroundOverlay?: ComponentType<BackgroundOverlayProps>;
    /** Custom content wrapper */
    Content?: ComponentType<ContentProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { isTouch: boolean; animated: boolean }) => string;
    /** Function to generate animated gradient classes */
    animatedGradient?: () => string;
    /** Function to generate background overlay classes */
    backgroundOverlay?: () => string;
    /** Function to generate content classes */
    content?: () => string;
  };
  /** Custom event handlers */
  handlers?: {
    /** Custom handler for animation start */
    onAnimationStart?: () => void;
    /** Custom handler for animation complete */
    onAnimationComplete?: () => void;
    /** Custom handler for component mount */
    onMount?: () => void;
    /** Custom handler for component unmount */
    onUnmount?: () => void;
  };
  /** Configuration options */
  config?: {
    /** Custom animation configuration */
    animation?: Partial<BadgeAnimationConfig>;
    /** Custom gradient configuration */
    gradient?: Partial<BadgeGradientConfig>;
    /** Custom ARIA labels */
    ariaLabels?: {
      container?: string;
    };
    /** Touch device detection override */
    touchDevice?: boolean;
  };
};

/**
 * Props for the RecentBadge component
 */
export interface RecentBadgeProps {
  /** Custom CSS classes for styling the container */
  className?: string;
  /** Content to display inside the badge */
  children?: React.ReactNode;
  /** Whether the gradient animation should be enabled */
  animated?: boolean;
  /** Custom ARIA label for accessibility */
  'aria-label'?: string;
  /** Customization options */
  customization?: RecentBadgeCustomization;
}

/**
 * Default animation configuration
 */
const defaultAnimationConfig: BadgeAnimationConfig = {
  duration: 4,
  ease: 'linear',
  repeat: true,
  initialPosition: '100%',
  finalPosition: '-100%',
};

/**
 * Default gradient configuration
 */
const defaultGradientConfig: BadgeGradientConfig = {
  direction: '90deg',
  stops: [
    { position: 0, color: 'rgba(255, 255, 255, 0)' },
    { position: 20, color: 'var(--tuwa-text-secondary)' },
    { position: 40, color: 'rgba(255, 255, 255, 0)' },
  ],
  backgroundSize: '200% 100%',
};

// --- Default Sub-Components ---
const DefaultContainer = forwardRef<HTMLSpanElement, ContainerProps>(({ children, className, ...props }, ref) => (
  <span ref={ref} className={className} {...props}>
    {children}
  </span>
));
DefaultContainer.displayName = 'DefaultContainer';

const DefaultAnimatedGradient: React.FC<AnimatedGradientProps> = ({
  className,
  animated,
  animationConfig,
  gradientConfig,
}) => {
  const gradientBackground = useMemo(() => {
    const stops = gradientConfig.stops.map((stop) => `${stop.color} ${stop.position}%`).join(', ');
    return `linear-gradient(${gradientConfig.direction}, ${stops})`;
  }, [gradientConfig.direction, gradientConfig.stops]);

  const animatedStyle = useMemo(
    () => ({
      background: gradientBackground,
      backgroundSize: gradientConfig.backgroundSize,
    }),
    [gradientBackground, gradientConfig.backgroundSize],
  );

  if (!animated) {
    return <span className={className} style={animatedStyle} />;
  }

  return (
    <motion.span
      className={className}
      style={animatedStyle}
      initial={{ backgroundPositionX: animationConfig.initialPosition }}
      animate={{ backgroundPositionX: animationConfig.finalPosition }}
      transition={{
        duration: animationConfig.duration,
        ease: animationConfig.ease,
        repeat: animationConfig.repeat ? Infinity : 0,
      }}
    />
  );
};

const DefaultBackgroundOverlay: React.FC<BackgroundOverlayProps> = ({ className }) => <span className={className} />;

const DefaultContent: React.FC<ContentProps> = ({ children, className }) => (
  <span className={className}>{children}</span>
);

/**
 * Badge component with animated gradient border effect and comprehensive customization
 *
 * This component provides a visually appealing badge with:
 * - Animated gradient border effect with customizable timing and colors
 * - Touch-device responsive sizing for optimal mobile experience
 * - Full accessibility support with proper ARIA labeling
 * - Performance optimizations with memoized calculations
 * - Customizable animations and gradient configurations
 * - Full customization of all child components
 * - Proper semantic HTML structure
 *
 * Visual features:
 * - Smooth animated gradient border effect
 * - Touch-responsive sizing (smaller on touch devices)
 * - Customizable gradient colors and direction
 * - Configurable animation timing and easing
 * - Proper z-index layering for visual effects
 *
 * Accessibility features:
 * - Proper ARIA role and labels
 * - Screen reader friendly content structure
 * - Semantic HTML with appropriate roles
 * - Motion reduction respect (can be controlled via customization)
 *
 * @example Basic usage
 * ```tsx
 * <RecentBadge>Recent</RecentBadge>
 * ```
 *
 * @example With custom animation
 * ```tsx
 * <RecentBadge
 *   animated={false}
 *   customization={{
 *     config: {
 *       animation: {
 *         duration: 2,
 *         ease: 'easeInOut'
 *       }
 *     }
 *   }}
 * >
 *   Custom
 * </RecentBadge>
 * ```
 *
 * @example With full customization
 * ```tsx
 * <RecentBadge
 *   customization={{
 *     components: {
 *       AnimatedGradient: CustomGradient,
 *       Content: CustomContent
 *     },
 *     config: {
 *       gradient: {
 *         direction: '45deg',
 *         stops: [
 *           { position: 0, color: 'transparent' },
 *           { position: 50, color: 'rgba(59, 130, 246, 0.8)' },
 *           { position: 100, color: 'transparent' }
 *         ]
 *       }
 *     }
 *   }}
 * >
 *   Premium
 * </RecentBadge>
 * ```
 */
export const RecentBadge = memo(
  forwardRef<HTMLSpanElement, RecentBadgeProps>(
    ({ className, children = 'Recent', animated = true, 'aria-label': ariaLabel, customization }, ref) => {
      // Extract customization options
      const {
        Container: CustomContainer = DefaultContainer,
        AnimatedGradient: CustomAnimatedGradient = DefaultAnimatedGradient,
        BackgroundOverlay: CustomBackgroundOverlay = DefaultBackgroundOverlay,
        Content: CustomContent = DefaultContent,
      } = customization?.components ?? {};

      const customHandlers = customization?.handlers;
      const customConfig = customization?.config;

      // Detect touch device with customization override
      const isTouch = useMemo(() => customConfig?.touchDevice ?? isTouchDevice(), [customConfig?.touchDevice]);

      /**
       * Memoized animation configuration with customization
       */
      const animationConfig = useMemo(
        (): BadgeAnimationConfig => ({
          ...defaultAnimationConfig,
          ...customConfig?.animation,
        }),
        [customConfig?.animation],
      );

      /**
       * Memoized gradient configuration with customization
       */
      const gradientConfig = useMemo(
        (): BadgeGradientConfig => ({
          ...defaultGradientConfig,
          ...customConfig?.gradient,
          stops: customConfig?.gradient?.stops ?? defaultGradientConfig.stops,
        }),
        [customConfig?.gradient],
      );

      /**
       * Generate container classes with proper memoization dependencies
       */
      const getContainerClasses = useCallback(() => {
        if (customization?.classNames?.container) {
          return customization.classNames.container({ isTouch, animated });
        }

        const sizeClasses = isTouch
          ? 'novacon:px-1.5 novacon:py-0 novacon:text-[10px]'
          : 'novacon:px-2.5 novacon:py-0.5 novacon:text-xs';

        return cn(
          'novacon:inline-flex novacon:items-center novacon:rounded-full novacon:font-medium novacon:relative novacon:overflow-hidden',
          'novacon:text-[var(--tuwa-text-secondary)] novacon:border novacon:border-[var(--tuwa-border-primary)]',
          sizeClasses,
          className,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [isTouch, animated, customization?.classNames?.container, className]);

      /**
       * Memoized container classes
       */
      const containerClasses = useMemo(getContainerClasses, [getContainerClasses]);

      /**
       * Memoized animated gradient classes
       */
      const animatedGradientClasses = useMemo(
        () =>
          customization?.classNames?.animatedGradient?.() ??
          'novacon:absolute novacon:inset-0 novacon:z-0 novacon:pointer-events-none novacon:rounded-full',
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [customization?.classNames?.animatedGradient],
      );

      /**
       * Memoized background overlay classes
       */
      const backgroundOverlayClasses = useMemo(
        () =>
          customization?.classNames?.backgroundOverlay?.() ??
          'novacon:absolute novacon:z-10 novacon:pointer-events-none novacon:rounded-full novacon:bg-[var(--tuwa-bg-primary)] novacon:inset-[1px]',
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [customization?.classNames?.backgroundOverlay],
      );

      /**
       * Memoized content classes
       */
      const contentClasses = useMemo(
        () => customization?.classNames?.content?.() ?? 'novacon:relative novacon:z-20 novacon:whitespace-nowrap',
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [customization?.classNames?.content],
      );

      /**
       * Generate ARIA label with proper memoization dependencies
       */
      const getAriaLabel = useCallback(() => {
        if (customConfig?.ariaLabels?.container) return customConfig.ariaLabels.container;
        if (ariaLabel) return ariaLabel;
        if (typeof children === 'string') return children;
        return 'Recent';
      }, [customConfig?.ariaLabels?.container, ariaLabel, children]);

      /**
       * Memoized ARIA label
       */
      const finalAriaLabel = useMemo(() => getAriaLabel(), [getAriaLabel]);

      // Handle mount/unmount effects
      React.useEffect(() => {
        customHandlers?.onMount?.();
        return () => customHandlers?.onUnmount?.();
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [customHandlers?.onMount, customHandlers?.onUnmount]);

      return (
        <CustomContainer ref={ref} className={containerClasses} role="status" aria-label={finalAriaLabel}>
          {/* Animated gradient border */}
          <CustomAnimatedGradient
            className={animatedGradientClasses}
            animated={animated}
            animationConfig={animationConfig}
            gradientConfig={gradientConfig}
          />

          {/* Background overlay */}
          <CustomBackgroundOverlay className={backgroundOverlayClasses} />

          {/* Content */}
          <CustomContent className={contentClasses}>{children}</CustomContent>
        </CustomContainer>
      );
    },
  ),
);

RecentBadge.displayName = 'RecentBadge';
