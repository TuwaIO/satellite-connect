import { cn } from '@tuwaio/nova-core';

import { ConnectButtonProps } from '@/components/ui/ConnectButton/ConnectButton';

export function WaitForConnectionContent({ className, onClick }: Pick<ConnectButtonProps, 'className' | 'onClick'>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2',
        'rounded-xl font-medium text-sm transition-all duration-200',
        'hover:scale-[1.02] active:scale-[0.98]',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'focus:ring-offset-[var(--tuwa-bg-primary)]',
        [
          'bg-gradient-to-r',
          'from-[var(--tuwa-button-gradient-from)]',
          'to-[var(--tuwa-button-gradient-to)]',
          'text-[var(--tuwa-text-on-accent)]',
          'hover:from-[var(--tuwa-button-gradient-from-hover)]',
          'hover:to-[var(--tuwa-button-gradient-to-hover)]',
          'focus:ring-[var(--tuwa-text-accent)]',
        ],
        className,
      )}
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m2-4h.01M17 16h.01"
        />
      </svg>

      <span>Connect Wallet</span>
    </button>
  );
}
