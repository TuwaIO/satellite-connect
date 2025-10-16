import * as Select from '@radix-ui/react-select';
import { cn } from '@tuwaio/nova-core';
import { AnimatePresence, type Easing, motion } from 'framer-motion';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef, useMemo } from 'react';

import { useNovaConnectLabels } from '../hooks/useNovaConnectLabels';
import { ToBottomButton } from './ToBottomButton';
import { ToTopButton } from './ToTopButton';

interface SelectContentAnimatedProps extends ComponentPropsWithoutRef<typeof Select.Content> {
  /** Custom CSS classes to apply to the content container */
  className?: string;
  /** ARIA label for the select content */
  'aria-label'?: string;
  /** Whether the select content should have reduced motion for accessibility */
  reduceMotion?: boolean;
}

export const SelectContentAnimated = forwardRef<ElementRef<typeof Select.Content>, SelectContentAnimatedProps>(
  (
    { className, children, position = 'popper', 'aria-label': ariaLabel, reduceMotion = false, ...props },
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
          transition: { duration: 0.15 },
        };
      }

      return {
        initial: { opacity: 0, scaleY: 0.8, y: -5 },
        animate: { opacity: 1, scaleY: 1, y: 0 },
        exit: { opacity: 0, scaleY: 0.8, y: -5 },
        transition: {
          duration: 0.2,
          ease: 'easeOut',
        },
      };
    }, [reduceMotion]);

    // Memoize layout transition configuration
    const layoutTransition = useMemo(() => {
      if (reduceMotion) {
        return {};
      }
      return {
        duration: 0.15,
        ease: 'easeOut' as Easing,
      };
    }, [reduceMotion]);

    // Memoize content container classes
    const contentClasses = useMemo(
      () =>
        cn(
          'p-1 bg-[var(--tuwa-bg-secondary)] rounded-lg shadow-xl',
          'ring-1 ring-[var(--tuwa-border-primary)] overflow-hidden',
          className,
        ),
      [className],
    );

    // Memoize select content classes
    const selectContentClasses = useMemo(
      () =>
        cn(
          'max-h-[300px] w-[--radix-select-trigger-width] overflow-hidden',
          'data-[state=open]:animate-in data-[state=closed]:animate-out',
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
          'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
          'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
          'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        ),
      [],
    );

    return (
      <Select.Portal>
        <Select.Content
          className={selectContentClasses}
          ref={forwardedRef}
          position={position}
          role="listbox"
          aria-label={ariaLabel || labels.chainListContainer}
          {...props}
        >
          {/* Scroll to top button */}
          <Select.ScrollUpButton asChild>
            <ToTopButton />
          </Select.ScrollUpButton>

          {/* Main content viewport */}
          <Select.Viewport role="presentation">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                {...animationConfig}
                className={contentClasses}
                layout={!reduceMotion}
                transition={{
                  layout: layoutTransition,
                }}
                role="group"
                aria-live="polite"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </Select.Viewport>

          {/* Scroll to bottom button */}
          <Select.ScrollDownButton asChild>
            <ToBottomButton />
          </Select.ScrollDownButton>
        </Select.Content>
      </Select.Portal>
    );
  },
);

SelectContentAnimated.displayName = 'SelectContentAnimated';
