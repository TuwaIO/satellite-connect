'use client';

import { cn, useCopyToClipboard } from '@tuwaio/nova-core';
import { ReactNode } from 'react';

import { CopyIconButton } from '@/components/CopyIconButton';

interface CodeBlockProps {
  /** The title displayed in the header of the code block. */
  title: string;
  /** An icon or other React node to display next to the title. */
  titleIcons: ReactNode;
  /** The code or content to display within the block. */
  children: ReactNode;
  /** The raw text content that will be copied to the clipboard. */
  textToCopy: string;
}

/**
 * A UI component that wraps content, typically code snippets, in a styled block
 * with a header containing a title, an icon, and a copy button.
 */
export function CodeBlock({ title, titleIcons, children, textToCopy }: CodeBlockProps) {
  const { isCopied, copy } = useCopyToClipboard(1500);

  return (
    <div
      className={cn(
        'group overflow-hidden rounded-lg border',
        'border-[var(--tuwa-border-secondary)] bg-[var(--tuwa-bg-primary)]',
      )}
    >
      <div
        className={cn(
          'flex items-center justify-between gap-4 px-4 py-2',
          'border-b border-[var(--tuwa-border-secondary)] bg-[var(--tuwa-bg-secondary)]',
        )}
      >
        <div className="flex items-center gap-2">
          <div className="h-[20px] w-[20px] text-[var(--tuwa-text-secondary)]">{titleIcons}</div>
          <p className="text-sm font-medium text-[var(--tuwa-text-primary)]">{title}</p>
        </div>
        <div className="transition md:opacity-0 group-hover:opacity-100">
          <CopyIconButton isCopied={isCopied} onCopy={() => copy(textToCopy)} />
        </div>
      </div>
      {children}
    </div>
  );
}
