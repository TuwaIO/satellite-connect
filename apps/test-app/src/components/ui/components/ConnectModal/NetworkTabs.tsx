import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import React from 'react';

import { getNetworkIcon } from '../../utils/getNetworIcon';

interface NetworkTabsProps {
  networks: OrbitAdapter[];
  selectedAdapter: OrbitAdapter | undefined;
  onSelect: (adapter: OrbitAdapter | undefined) => void;
}

export function NetworkTabs({ networks, selectedAdapter, onSelect }: NetworkTabsProps) {
  return (
    <div className="flex gap-2 p-2 mb-4 border-b border-[var(--tuwa-border-primary)]">
      <button
        onClick={() => onSelect(undefined)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
          'hover:bg-[var(--tuwa-bg-muted)]',
          selectedAdapter === undefined
            ? 'bg-[var(--tuwa-bg-muted)] text-[var(--tuwa-text-accent)]'
            : 'text-[var(--tuwa-text-secondary)]',
        )}
      >
        <span>All Networks</span>
      </button>
      {networks.map((network) => (
        <button
          key={network}
          onClick={() => onSelect(network)}
          className={cn(
            'flex items-center gap-2 px-4 py-2 rounded-lg transition-colors',
            'hover:bg-[var(--tuwa-bg-muted)]',
            selectedAdapter === network
              ? 'bg-[var(--tuwa-bg-muted)] text-[var(--tuwa-text-accent)]'
              : 'text-[var(--tuwa-text-secondary)]',
          )}
        >
          <Web3Icon chainId={getNetworkIcon(network)?.chainId} className="w-5 h-5" />
          <span>{getNetworkIcon(network)?.name}</span>
        </button>
      ))}
    </div>
  );
}
