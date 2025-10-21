/**
 * @file Animated select content component with comprehensive customization capabilities.
 * @module SelectContentAnimated
 */

import * as Select from '@radix-ui/react-select';
import { cn } from '@tuwaio/nova-core';
import { AnimatePresence, type Easing, motion } from 'framer-motion';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef, useMemo } from 'react';

import { useNovaConnectLabels } from '../hooks/useNovaConnectLabels';
import { ToBottomButton, type ToBottomButtonCustomization } from './ToBottomButton';
import { ToTopButton, type ToTopButtonCustomization } from './ToTopButton';

/**
 * Props for the SelectContentAnimated component
 */
export interface SelectContentAnimatedProps extends ComponentPropsWithoutRef<typeof Select.Content> {
  /** Custom CSS classes to apply to the select content container (added to defaults) */
  className?: string;
  /** Custom CSS classes to apply to the animated inner content (added to defaults) */
  contentClassName?: string;
  /** Custom CSS classes to apply to the viewport (added to defaults) */
  viewportClassName?: string;
  /** ARIA label for the select content */
  'aria-label'?: string;
  /** Whether the select content should have reduced motion for accessibility */
  reduceMotion?: boolean;
  /** Maximum height for the content in pixels */
  maxHeight?: number;
  /** Custom animation duration in seconds */
  animationDuration?: number;
  /** Whether to show scroll buttons */
  showScrollButtons?: boolean;
  /** Custom props for the ToTopButton */
  topButtonProps?: Omit<ComponentPropsWithoutRef<typeof ToTopButton>, 'ref'>;
  /** Custom props for the ToBottomButton */
  bottomButtonProps?: Omit<ComponentPropsWithoutRef<typeof ToBottomButton>, 'ref'>;
  /** Customization options for ToTopButton */
  topButtonCustomization?: ToTopButtonCustomization;
  /** Customization options for ToBottomButton */
  bottomButtonCustomization?: ToBottomButtonCustomization;
}

/**
 * Animated select content component with smooth enter/exit animations.
 *
 * This component provides animated dropdown content for select components
 * with accessibility support and extensive customization capabilities.
 *
 * Features:
 * - Smooth enter/exit animations with Framer Motion
 * - Accessibility-first design with ARIA support
 * - Fully customizable scroll buttons with ToTopButton/ToBottomButton
 * - Reduced motion support for accessibility
 * - Customizable max height and animation duration
 * - Full control over styling via className props (additive, not replacement)
 * - Separate styling for container, content, and viewport
 * - Custom button props and customization options
 *
 * @example Basic usage
 * ```tsx
 * <Select.Root>
 *   <Select.Trigger>Select an option</Select.Trigger>
 *   <SelectContentAnimated>
 *     <Select.Item value="option1">Option 1</Select.Item>
 *     <Select.Item value="option2">Option 2</Select.Item>
 *   </SelectContentAnimated>
 * </Select.Root>
 * ```
 *
 * @example With full customization
 * ```tsx
 * <SelectContentAnimated
 *   className="novacon:shadow-2xl novacon:border-2"
 *   contentClassName="novacon:p-4 novacon:bg-gradient-to-b"
 *   viewportClassName="novacon:scrollbar-thin"
 *   maxHeight={400}
 *   animationDuration={0.3}
 *   reduceMotion={false}
 *   showScrollButtons={true}
 *   topButtonProps={{
 *     className: "novacon:bg-blue-500",
 *     onClick: () => console.log("Top button clicked"),
 *   }}
 *   topButtonCustomization={{
 *     classNames: {
 *       button: () => "novacon:bg-red-500 novacon:hover:bg-red-600",
 *     },
 *   }}
 *   bottomButtonCustomization={{
 *     components: {
 *       Icon: ({ className }) => <div className={className}>⬇️</div>,
 *     },
 *   }}
 * >
 *   <Select.Item value="item1">Item 1</Select.Item>
 * </SelectContentAnimated>
 * ```
 */
export const SelectContentAnimated = forwardRef<
  Omit<ElementRef<typeof Select.Content>, 'style'>,
  SelectContentAnimatedProps
>(
  (
    {
      className,
      contentClassName,
      viewportClassName,
      children,
      position = 'popper',
      'aria-label': ariaLabel,
      reduceMotion = false,
      maxHeight = 300,
      animationDuration = 0.2,
      showScrollButtons = true,
      topButtonProps,
      bottomButtonProps,
      topButtonCustomization,
      bottomButtonCustomization,
      ...props
    },
    forwardedRef,
  ) => {
    const labels = useNovaConnectLabels();

    // Memoize animation configuration based on reduce motion preference
    const animationConfig = useMemo(() => {
      if (reduceMotion) {
        return {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          transition: { duration: 0.15, layout: { duration: 0 } },
        };
      }

      return {
        initial: { opacity: 0, scaleY: 0.8, y: -5 },
        animate: { opacity: 1, scaleY: 1, y: 0 },
        exit: { opacity: 0, scaleY: 0.8, y: -5 },
        transition: {
          duration: animationDuration,
          ease: 'easeOut' as Easing,
          layout: {
            duration: 0.15,
            ease: 'easeOut' as Easing,
          },
        },
      };
    }, [reduceMotion, animationDuration]);

    // Memoize content container classes (additive approach)
    const contentClasses = useMemo(
      () =>
        cn(
          // Default styles always applied
          'novacon:p-1 novacon:bg-[var(--tuwa-bg-secondary)] novacon:rounded-lg novacon:shadow-xl',
          'novacon:ring-1 novacon:ring-[var(--tuwa-border-primary)] novacon:overflow-hidden',
          // Custom classes added to defaults
          contentClassName,
        ),
      [contentClassName],
    );

    // Memoize select content classes (additive approach)
    const selectContentClasses = useMemo(
      () =>
        cn(
          // Default styles always applied
          'novacon:overflow-hidden',
          'novacon:w-[--radix-select-trigger-width]',
          'novacon:data-[state=open]:animate-in novacon:data-[state=closed]:animate-out',
          'novacon:data-[state=closed]:fade-out-0 novacon:data-[state=open]:fade-in-0',
          'novacon:data-[state=closed]:zoom-out-95 novacon:data-[state=open]:zoom-in-95',
          'novacon:data-[side=bottom]:slide-in-from-top-2 novacon:data-[side=left]:slide-in-from-right-2',
          'novacon:data-[side=right]:slide-in-from-left-2 novacon:data-[side=top]:slide-in-from-bottom-2',
          // Custom classes added to defaults
          className,
        ),
      [className],
    );

    // Memoize viewport classes (additive approach)
    const viewportClasses = useMemo(
      () =>
        cn(
          // Default viewport styles (minimal by default)
          '',
          // Custom classes added
          viewportClassName,
        ),
      [viewportClassName],
    );

    // Memoize inline styles for containers
    const selectContentStyles = useMemo(
      () => ({
        // Apply maxHeight as inline style (can be overridden by style prop)
        maxHeight: `${maxHeight}px`,
      }),
      [maxHeight],
    );

    // Generate ARIA label
    const finalAriaLabel = ariaLabel || labels.chainListContainer;

    return (
      <Select.Portal>
        <Select.Content
          className={selectContentClasses}
          style={selectContentStyles}
          // @ts-expect-error - type changed for better using
          ref={forwardedRef}
          position={position}
          role="listbox"
          aria-label={finalAriaLabel}
          {...props}
        >
          {/* Scroll to top button - only render if showScrollButtons is true */}
          {showScrollButtons && (
            <Select.ScrollUpButton asChild>
              <ToTopButton customization={topButtonCustomization} {...topButtonProps} />
            </Select.ScrollUpButton>
          )}

          {/* Main content viewport */}
          <Select.Viewport role="presentation" className={viewportClasses}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                initial={animationConfig.initial}
                animate={animationConfig.animate}
                exit={animationConfig.exit}
                transition={animationConfig.transition}
                className={contentClasses}
                layout={!reduceMotion}
                role="group"
                aria-live="polite"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </Select.Viewport>

          {/* Scroll to bottom button - only render if showScrollButtons is true */}
          {showScrollButtons && (
            <Select.ScrollDownButton asChild>
              <ToBottomButton customization={bottomButtonCustomization} {...bottomButtonProps} />
            </Select.ScrollDownButton>
          )}
        </Select.Content>
      </Select.Portal>
    );
  },
);

SelectContentAnimated.displayName = 'SelectContentAnimated';
