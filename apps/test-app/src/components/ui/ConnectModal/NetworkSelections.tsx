import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';

import { networksLinks } from '@/components/ui/utils/networksLinks';

interface NetworkSelectionsProps {
  networks: OrbitAdapter[];
  setSelectedAdapter: (adapter: OrbitAdapter | undefined) => void;
}

const getNetworkData = (adapter: OrbitAdapter) => {
  switch (adapter) {
    case OrbitAdapter.EVM:
      return {
        chainId: 1,
        name: 'Ethereum',
      };
    case OrbitAdapter.SOLANA:
      return {
        chainId: 'solana:mainnet',
        name: 'Solana',
      };
  }
};

export function NetworkSelections({ networks, setSelectedAdapter }: NetworkSelectionsProps) {
  return (
    <div className="flex flex-col gap-2 max-h-[310px] overflow-y-auto">
      <h2>Select one of available network</h2>
      {networks.map((network) => (
        <div
          className={cn(
            'cursor-pointer w-full p-4 rounded-xl transition-colors relative',
            'bg-[var(--tuwa-bg-secondary)] hover:bg-[var(--tuwa-bg-muted)]',
            'border border-[var(--tuwa-border-primary)]',
            'flex items-center justify-between',
            'disabled:opacity-50 disabled:cursor-not-allowed',
          )}
          onClick={() => setSelectedAdapter(network)}
          key={network}
        >
          <div className="flex items-center gap-3">
            <Web3Icon chainId={getNetworkData(network)?.chainId} />
            {getNetworkData(network)?.name}
          </div>
          <a
            className="absolute top-[2px] right-[2px]"
            onClick={(e) => e.stopPropagation()}
            href={networksLinks[network]?.aboutNetwork}
            target="_blank"
          >
            <InformationCircleIcon width={16} height={16} />
          </a>
        </div>
      ))}
    </div>
  );
}
