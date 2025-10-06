import { DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import { useCopyToClipboard } from '@tuwaio/nova-core';
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
    <div className="flex items-start p-4 rounded-lg shadow-lg relative min-w-[300px] bg-[var(--tuwa-error-bg)] border border-[var(--tuwa-error-border)]">
      <div className="ml-3 flex-1 overflow-hidden">
        <p className="text-sm font-semibold truncate" style={{ color: 'var(--tuwa-error-text)' }}>
          {title}
        </p>
        <p className="mt-1 text-sm break-words" style={{ color: 'var(--tuwa-error-text)' }}>
          {rawError}
        </p>

        <button
          onClick={handleCopy}
          className="mt-2 text-xs font-medium inline-flex items-center space-x-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-md transition-colors text-[var(--tuwa-error-icon)]"
        >
          <DocumentDuplicateIcon className="w-4 h-4" />
          <span>{isCopied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
    </div>
  );
}
