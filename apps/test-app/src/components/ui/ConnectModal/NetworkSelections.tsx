import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { OrbitAdapter } from '@tuwaio/orbit-core';

import { networksLinks } from '@/components/ui/utils/networksLinks';

interface NetworkSelectionsProps {
  networks: OrbitAdapter[];
  setSelectedAdapter: (adapter: OrbitAdapter | undefined) => void;
}

const getChainId = (adapter: OrbitAdapter) => {
  switch (adapter) {
    case OrbitAdapter.EVM:
      return 1;
    case OrbitAdapter.SOLANA:
      return 'solana:mainnet';
  }
};

export function NetworkSelections({ networks, setSelectedAdapter }: NetworkSelectionsProps) {
  return (
    <div>
      <h2>Select one of available network</h2>
      {networks.map((network) => (
        <div onClick={() => setSelectedAdapter(network)} key={network}>
          <Web3Icon chainId={getChainId(network)} />
          {network}
          <a onClick={(e) => e.stopPropagation()} href={networksLinks[network]?.aboutNetwork} target="_blank">
            Info
          </a>
        </div>
      ))}
    </div>
  );
}
