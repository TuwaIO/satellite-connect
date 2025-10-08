import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import * as Select from '@radix-ui/react-select';
import { cn } from '@tuwaio/nova-core';
import { AnimatePresence, motion } from 'framer-motion';
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from 'react';

export const SelectContentAnimated = forwardRef<
  ElementRef<typeof Select.Content>,
  ComponentPropsWithoutRef<typeof Select.Content>
>(({ className, children, position = 'popper', ...props }, forwardedRef) => (
  <Select.Portal>
    <Select.Content
      className={cn('max-h-[300px] w-[--radix-select-trigger-width] overflow-hidden')}
      ref={forwardedRef}
      position={position}
      {...props}
    >
      <Select.ScrollUpButton className="flex h-6 cursor-default items-center justify-center bg-[var(--tuwa-bg-secondary)] text-[var(--tuwa-text-primary)]">
        <ChevronUpIcon className="w-4 h-4" />
      </Select.ScrollUpButton>

      <Select.Viewport>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scaleY: 0.8, y: -5 }}
            animate={{ opacity: 1, scaleY: 1, y: 0 }}
            exit={{ opacity: 0, scaleY: 0.8, y: -5 }}
            transition={{ duration: 0.2, ease: [0.1, 0.1, 0.2, 1] }}
            className={cn(
              'p-1 bg-[var(--tuwa-bg-secondary)] rounded-lg shadow-xl ring-1 ring-[var(--tuwa-border-primary)] overflow-hidden',
              className,
            )}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </Select.Viewport>

      <Select.ScrollDownButton className="flex h-6 cursor-default items-center justify-center bg-[var(--tuwa-bg-secondary)] text-[var(--tuwa-text-primary)]">
        <ChevronDownIcon className="w-4 h-4" />
      </Select.ScrollDownButton>
    </Select.Content>
  </Select.Portal>
));
SelectContentAnimated.displayName = Select.Content.displayName;
