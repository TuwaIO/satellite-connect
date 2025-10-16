import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';
import { formatWalletName, getWalletTypeFromConnectorName, OrbitAdapter, WalletType } from '@tuwaio/orbit-core';
import React, { useMemo } from 'react';

import { isTouchDevice } from '../..//utils/isTouchDevice';
import { getNetworkIcon } from '../../utils/getNetworIcon';
import { networksLinks } from '../../utils/networksLinks';
import { ConnectCard } from './ConnectCard';
import { GroupedConnector } from './ConnectModal';
import { Disclaimer } from './Disclaimer';

interface NetworkSelectionsProps {
  activeConnector: string | undefined;
  connectors: GroupedConnector[];
  onClick: (adapter: OrbitAdapter, walletType: WalletType) => Promise<void>;
}

export function NetworkSelections({ connectors, onClick, activeConnector }: NetworkSelectionsProps) {
  const isTouch = useMemo(() => isTouchDevice(), []);

  const touchListClasses = ['flex-row', 'overflow-x-auto', 'max-h-none', 'gap-3', 'pb-4', 'px-1'];
  const mouseListClasses = ['flex-col', 'max-h-[310px]', 'overflow-y-auto', 'gap-2'];

  const activeConnectors = connectors.find((connector) => formatWalletName(connector.name) === activeConnector);

  if (!activeConnectors)
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-[var(--tuwa-border-primary)] rounded-xl bg-[var(--tuwa-bg-secondary)] text-[var(--tuwa-text-secondary)]">
        <ExclamationTriangleIcon width={32} height={32} className="text-[var(--tuwa-text-accent)] mb-3" />
        <h2 className="text-lg font-semibold text-[var(--tuwa-text-primary)] mb-1">Something went wrong</h2>
        <p className="text-sm">Something wrong with wallet networks picking. Please go back and try again.</p>
      </div>
    );

  return (
    <div className="flex flex-col gap-4 text-[var(--tuwa-text-primary)]">
      <h2>Select one of available network</h2>

      <div className={cn('flex NovaCustomScroll', isTouch ? touchListClasses : mouseListClasses)}>
        {activeConnectors.adapters.map((network) => (
          <div key={network} className={cn({ 'flex-shrink-0': isTouch })}>
            <ConnectCard
              icon={
                <div className="w-8 h-8">
                  <Web3Icon chainId={getNetworkIcon(network)?.chainId} />
                </div>
              }
              onClick={() => {
                return onClick(
                  network,
                  getWalletTypeFromConnectorName(
                    network,
                    formatWalletName(activeConnector ?? 'not-connected'),
                  ) as WalletType,
                );
              }}
              title={getNetworkIcon(network)?.name ?? ''}
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
