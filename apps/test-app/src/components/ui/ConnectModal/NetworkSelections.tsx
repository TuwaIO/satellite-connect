import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { OrbitAdapter } from '@tuwaio/orbit-core';

import { ConnectCard } from '@/components/ui/ConnectModal/ConnectCard';
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
    <div className="flex flex-col gap-2 max-h-[310px] overflow-y-auto text-[var(--tuwa-text-primary)]">
      <h2>Select one of available network</h2>
      {networks.map((network) => (
        <ConnectCard
          key={network}
          icon={<Web3Icon chainId={getNetworkData(network)?.chainId} />}
          onClick={() => setSelectedAdapter(network)}
          title={getNetworkData(network)?.name ?? ''}
          infoLink={networksLinks[network]?.aboutNetwork}
        />
      ))}
    </div>
  );
}
