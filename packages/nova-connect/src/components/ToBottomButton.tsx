import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import { forwardRef } from 'react';

import { useNovaConnectLabels } from '../hooks/useNovaConnectLabels';

interface ToBottomButtonProps {
  /** Custom CSS classes for the button */
  className?: string;
  /** Custom aria-label for the button */
  'aria-label'?: string;
  /** Callback fired when button is clicked */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Whether the button is disabled */
  disabled?: boolean;
}

export const ToBottomButton = forwardRef<HTMLButtonElement, ToBottomButtonProps>(
  ({ className, 'aria-label': ariaLabel, onClick, disabled = false, ...props }, ref) => {
    const labels = useNovaConnectLabels();

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      // Prevent default scroll behavior if custom handler provided
      if (onClick) {
        event.preventDefault();
        onClick(event);
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
      // Handle keyboard activation
      if ((event.key === 'Enter' || event.key === ' ') && onClick) {
        event.preventDefault();
        // eslint-disable-next-line
        onClick(event as any);
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className={cn(
          'flex w-full h-6 items-center justify-center',
          'bg-[var(--tuwa-bg-secondary)] text-[var(--tuwa-text-primary)]',
          'transition-colors duration-200',
          'hover:bg-[var(--tuwa-bg-tertiary)] hover:text-[var(--tuwa-text-secondary)]',
          'focus:outline-none focus:ring-2 focus:ring-[var(--tuwa-text-accent)] focus:ring-inset',
          'active:bg-[var(--tuwa-bg-quaternary)]',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[var(--tuwa-bg-secondary)]',
          onClick ? 'cursor-pointer' : 'cursor-default',
          className,
        )}
        aria-label={ariaLabel || labels.scrollToBottom}
        title={ariaLabel || labels.scrollToBottom}
        {...props}
      >
        <ChevronDownIcon
          className={cn('w-4 h-4 transition-transform duration-200', disabled && 'opacity-50')}
          aria-hidden="true"
        />
      </button>
    );
  },
);

ToBottomButton.displayName = 'ToBottomButton';
