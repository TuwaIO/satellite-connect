import { ChevronUpIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import { forwardRef } from 'react';

import { useNovaConnectLabels } from '../hooks/useNovaConnectLabels';

interface ToTopButtonProps {
  /** Custom CSS classes for the button */
  className?: string;
  /** Custom aria-label for the button */
  'aria-label'?: string;
  /** Callback fired when button is clicked */
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  /** Whether the button is disabled */
  disabled?: boolean;
}

export const ToTopButton = forwardRef<HTMLButtonElement, ToTopButtonProps>(
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
          'novacon:flex novacon:w-full novacon:h-6 novacon:items-center novacon:justify-center',
          'novacon:bg-[var(--tuwa-bg-secondary)] novacon:text-[var(--tuwa-text-primary)]',
          'novacon:transition-colors novacon:duration-200',
          'novacon:hover:bg-[var(--tuwa-bg-tertiary)] novacon:hover:text-[var(--tuwa-text-secondary)]',
          'novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-[var(--tuwa-text-accent)] novacon:focus:ring-inset',
          'novacon:active:bg-[var(--tuwa-bg-quaternary)]',
          'novacon:disabled:opacity-50 novacon:disabled:cursor-not-allowed novacon:disabled:hover:bg-[var(--tuwa-bg-secondary)]',
          onClick ? 'novacon:cursor-pointer' : 'novacon:cursor-default',
          className,
        )}
        aria-label={ariaLabel || labels.scrollToTop}
        title={ariaLabel || labels.scrollToTop}
        {...props}
      >
        <ChevronUpIcon
          className={cn(
            'novacon:w-4 novacon:h-4 novacon:transition-transform novacon:duration-200',
            disabled && 'novacon:opacity-50',
          )}
          aria-hidden="true"
        />
      </button>
    );
  },
);

ToTopButton.displayName = 'ToTopButton';
