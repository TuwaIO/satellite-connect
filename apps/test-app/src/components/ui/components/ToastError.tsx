import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import { cn, useCopyToClipboard } from '@tuwaio/nova-core';
import * as React from 'react';

import { useNovaConnectLabels } from '../hooks/useNovaConnectLabels';

interface ToastErrorProps {
  /** Error title to display */
  title: string;
  /** Raw error message to display and copy */
  rawError: string;
  /** Custom CSS classes for the container */
  className?: string;
  /** Custom ARIA label for the error container */
  'aria-label'?: string;
  /** Callback fired when copy operation completes */
  onCopyComplete?: (success: boolean) => void;
}

// Counter for unique IDs (outside component to avoid re-initialization)
let idCounter = 0;

export function ToastError({ title, rawError, className, 'aria-label': ariaLabel, onCopyComplete }: ToastErrorProps) {
  const labels = useNovaConnectLabels();
  const { isCopied, copy } = useCopyToClipboard();

  // Generate unique IDs only once per component instance
  const [uniqueId] = React.useState(() => {
    idCounter += 1;
    return `${idCounter}-${Date.now()}`;
  });

  const titleId = `error-title-${uniqueId}`;
  const descriptionId = `error-description-${uniqueId}`;

  // Memoize error text for copying
  const errorToCopy = React.useMemo(() => rawError, [rawError]);

  // Handle copy with error handling and callback
  const handleCopy = React.useCallback(
    async (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      try {
        await copy(errorToCopy);
        onCopyComplete?.(true);
      } catch (error) {
        console.error('Failed to copy error:', error);
        onCopyComplete?.(false);
      }
    },
    [copy, errorToCopy, onCopyComplete],
  );

  // Handle keyboard interaction for copy button
  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        // eslint-disable-next-line
        handleCopy(e as any);
      }
    },
    [handleCopy],
  );

  // Memoize container classes
  const containerClasses = React.useMemo(
    () =>
      cn('bg-[var(--tuwa-bg-primary)] p-4 rounded-md w-full', 'border border-[var(--tuwa-border-primary)]', className),
    [className],
  );

  // Memoize button classes
  const buttonClasses = React.useMemo(
    () =>
      cn(
        'cursor-pointer mt-2 text-xs font-medium inline-flex items-center space-x-1.5',
        'focus:outline-none focus:ring-2 focus:ring-[var(--tuwa-error-text)] focus:ring-opacity-50',
        'rounded-md px-2 py-1 transition-all duration-200',
        'hover:bg-[var(--tuwa-error-text)] hover:bg-opacity-10',
        'active:bg-[var(--tuwa-error-text)] active:bg-opacity-20',
        'text-[var(--tuwa-error-text)] hover:text-[var(--tuwa-error-text)]',
        isCopied && 'bg-[var(--tuwa-success-text)] bg-opacity-10 text-[var(--tuwa-success-text)]',
      ),
    [isCopied],
  );

  return (
    <div
      className={containerClasses}
      role="alert"
      aria-live="assertive"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      aria-label={ariaLabel}
    >
      {/* Error Title */}
      <p
        id={titleId}
        className="text-sm font-semibold truncate text-[var(--tuwa-error-text)]"
        role="heading"
        aria-level={3}
        title={title} // Show full title on hover if truncated
      >
        {title}
      </p>

      {/* Error Description */}
      <p id={descriptionId} className="mt-1 text-xs break-words text-[var(--tuwa-error-text)] opacity-80" role="text">
        {rawError}
      </p>

      {/* Copy Button */}
      <button
        onClick={handleCopy}
        onKeyDown={handleKeyDown}
        className={buttonClasses}
        type="button"
        aria-label={isCopied ? `${labels.copied} ${labels.copyRawError}` : labels.copyRawError}
        aria-describedby={`${titleId} ${descriptionId}`}
        disabled={!errorToCopy.trim()}
      >
        <DocumentDuplicateIcon
          className={cn('w-4 h-4 transition-colors', isCopied && 'text-[var(--tuwa-success-text)]')}
          aria-hidden="true"
        />
        <span className="select-none transition-colors" aria-live="polite" role="status">
          {isCopied ? labels.copied : labels.copyRawError}
        </span>
      </button>
    </div>
  );
}
