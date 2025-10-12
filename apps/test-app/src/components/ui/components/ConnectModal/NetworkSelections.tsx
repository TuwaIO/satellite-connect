import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import React, { useMemo } from 'react';

import { isTouchDevice } from '../..//utils/isTouchDevice';
import { networksLinks } from '../../utils/networksLinks';
import { ConnectCard } from './ConnectCard';
import { Disclaimer } from './Disclaimer';

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
  const isTouch = useMemo(() => isTouchDevice(), []);

  const touchListClasses = ['flex-row', 'overflow-x-auto', 'max-h-none', 'gap-3', 'pb-4', 'px-1'];
  const mouseListClasses = ['flex-col', 'max-h-[310px]', 'overflow-y-auto', 'gap-2'];

  return (
    <div className="flex flex-col gap-4 text-[var(--tuwa-text-primary)]">
      <h2>Select one of available network</h2>

      <div className={cn('flex NovaCustomScroll', isTouch ? touchListClasses : mouseListClasses)}>
        {networks.map((network) => (
          <div key={network} className={cn(isTouch && 'flex-shrink-0')}>
            <ConnectCard
              icon={<Web3Icon chainId={getNetworkData(network)?.chainId} />}
              onClick={() => setSelectedAdapter(network)}
              title={getNetworkData(network)?.name ?? ''}
              infoLink={networksLinks[network]?.aboutNetwork}
            />
          </div>
        ))}
      </div>

      <Disclaimer
        title="What is a network?"
        description="A network (or blockchain) is a decentralized digital ledger that records transactions. Selecting a network lets you choose which blockchain you want to connect to."
        learnMoreAction="https://academy.binance.com/en/articles/what-is-blockchain-and-how-does-it-work"
        listAction="https://www.alchemy.com/dapps/top/blockchains"
      />
    </div>
  );
}
