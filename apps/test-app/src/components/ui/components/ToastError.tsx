import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import { cn, useCopyToClipboard } from '@tuwaio/nova-core';
import * as React from 'react';

interface ToastErrorProps {
  title: string;
  rawError: string;
}

export function ToastError({ title, rawError }: ToastErrorProps) {
  const errorToCopy = rawError;
  const { isCopied, copy } = useCopyToClipboard();

  const handleCopy = React.useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      copy(errorToCopy);
    },
    [copy, errorToCopy],
  );

  return (
    <div className="bg-[var(--tuwa-bg-primary)] p-4 rounded-md w-full border border-[var(--tuwa-border-primary)]">
      <p className="text-sm font-semibold truncate text-[var(--tuwa-error-text)]">{title}</p>
      <p className="mt-1 text-xs break-words text-[var(--tuwa-error-text)] opacity-80">{rawError}</p>
      <button
        onClick={handleCopy}
        className={cn(
          'cursor-pointer mt-2 text-xs font-medium inline-flex items-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md transition-colors',
        )}
      >
        <DocumentDuplicateIcon className="w-4 h-4" />
        <span className="select-none">{isCopied ? 'Copied!' : 'Copy raw error'}</span>
      </button>
    </div>
  );
}
