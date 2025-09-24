'use client';

import { CheckCircleIcon, Square2StackIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';

interface CopyIconButtonProps {
  isCopied: boolean;
  onCopy: () => void;
}

export function CopyIconButton({ isCopied, onCopy }: CopyIconButtonProps) {
  return (
    <button
      onClick={onCopy}
      type="button"
      className={cn(
        'h-6 w-6 cursor-pointer transition-colors',
        isCopied
          ? 'text-[var(--tuwa-success-icon)]'
          : 'text-[var(--tuwa-text-secondary)] hover:text-[var(--tuwa-text-primary)]',
      )}
    >
      {isCopied ? <CheckCircleIcon /> : <Square2StackIcon />}
    </button>
  );
}
