import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { FC } from 'react';

interface WalletCardProps {
  name: string;
  adapters: OrbitAdapter[];
  onSelect: () => void;
  isLoading?: boolean;
}

export const WalletCard: FC<WalletCardProps> = ({ name, adapters, onSelect, isLoading }) => {
  return (
    <button
      onClick={onSelect}
      disabled={isLoading}
      className={cn(
        'w-full p-4 rounded-xl transition-colors',
        'bg-[var(--tuwa-bg-secondary)] hover:bg-[var(--tuwa-bg-muted)]',
        'border border-[var(--tuwa-border-primary)]',
        'flex items-center justify-between',
        'disabled:opacity-50 disabled:cursor-not-allowed',
      )}
    >
      <div className="flex items-center gap-3">
        <Web3Icon walletKey={name.replace(/\s+/g, '').toLowerCase()} className="w-8 h-8" />

        <div className="text-left">
          <div className="font-medium text-[var(--tuwa-text-primary)]">
            {name}
            {isLoading && ' (Connecting...)'}
          </div>
          <div className="text-sm text-[var(--tuwa-text-secondary)]">
            {adapters.map((adapter) => adapter.toUpperCase()).join(' & ')}
          </div>
        </div>
      </div>

      {adapters.length > 1 && (
        <svg
          className="w-5 h-5 text-[var(--tuwa-text-secondary)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </button>
  );
};
