import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { FC } from 'react';

interface NetworkSelectionProps {
  name: string;
  adapters: OrbitAdapter[];
  onConnect: (name: string, adapter: OrbitAdapter) => void;
  onBack: () => void;
  isLoading?: boolean;
}

export const NetworkSelection: FC<NetworkSelectionProps> = ({ name, adapters, onConnect, onBack, isLoading }) => (
  <>
    <Dialog.Title className="text-lg font-semibold text-[var(--tuwa-text-primary)]">Select Network</Dialog.Title>
    <Dialog.Description className="mt-2 text-sm text-[var(--tuwa-text-secondary)]">
      Choose which network to connect with {name}
    </Dialog.Description>

    <div className="mt-6 space-y-2">
      {adapters.map((adapter) => (
        <button
          key={adapter}
          onClick={() => onConnect(name, adapter)}
          disabled={isLoading}
          className={cn(
            'w-full p-4 rounded-xl transition-colors',
            'bg-[var(--tuwa-bg-secondary)] hover:bg-[var(--tuwa-bg-muted)]',
            'border border-[var(--tuwa-border-primary)]',
            'flex items-center justify-between',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
        >
          <span className="text-[var(--tuwa-text-primary)]">
            {adapter === OrbitAdapter.EVM ? 'Ethereum' : 'Solana'}
          </span>
        </button>
      ))}
    </div>

    <button
      onClick={onBack}
      className={cn(
        'mt-4 w-full p-3 rounded-xl',
        'text-[var(--tuwa-text-secondary)]',
        'hover:bg-[var(--tuwa-bg-secondary)]',
        'border border-[var(--tuwa-border-primary)]',
      )}
    >
      Back to Wallet Selection
    </button>
  </>
);
