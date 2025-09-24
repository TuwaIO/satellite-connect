import { cn } from '@tuwaio/nova-core';
import { ReactNode } from 'react';

export function StyledLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      className={cn('font-medium text-[var(--tuwa-text-accent)]', 'transition-all hover:underline underline-offset-4')}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  );
}
