import { cn } from '@tuwaio/nova-core';
import {
  formatWalletName,
  getWalletTypeFromConnectorName,
  OrbitAdapter,
  recentConnectedWalletHelpers,
  waitFor,
  WalletType,
} from '@tuwaio/orbit-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import React, { useMemo } from 'react';

import { getConnectChainId } from '../../utils/getConnectedChainId';
import { isTouchDevice } from '../../utils/isTouchDevice';
import { ConnectCard } from '../ConnectModal/ConnectCard';
import { WalletIcon } from '../WalletIcon';
import { GroupedConnector } from './ConnectModal';
import { ConnectorsSelectionsProps } from './ConnectorsSelections';

interface ConnectorsBlockProps
  extends Pick<
    ConnectorsSelectionsProps,
    'waitForPredict' | 'setIsOpen' | 'setIsConnected' | 'onClick' | 'appChains' | 'solanaRPCUrls'
  > {
  selectedAdapter: OrbitAdapter | undefined;
  connectors: GroupedConnector[];
  title: string;
  isTitleBold?: boolean;
}

export function ConnectorsBlock({
  selectedAdapter,
  connectors,
  solanaRPCUrls,
  appChains,
  waitForPredict,
  setIsConnected,
  setIsOpen,
  onClick,
  title,
  isTitleBold,
}: ConnectorsBlockProps) {
  const isTouch = useMemo(() => isTouchDevice(), []);

  const connect = useSatelliteConnectStore((store) => store.connect);
  const recentWallets = recentConnectedWalletHelpers.getRecentConnectedWallet();

  const touchCardContainerClasses = ['flex-row', 'gap-3'];
  const mouseCardContainerClasses = ['flex-col', 'gap-2'];

  const handleConnectorClick = async (group: GroupedConnector) => {
    const name = formatWalletName(group.name);

    // If multiple adapters available and no specific adapter selected, show network selection
    if (group.adapters.length > 1 && !selectedAdapter) {
      // Here you could trigger a network selection modal or dropdown
      onClick(group); // This should handle the network selection logic
      return;
    }

    // Use the selected adapter or the first available adapter
    const targetAdapter = selectedAdapter || group.adapters[0];
    const walletType = getWalletTypeFromConnectorName(targetAdapter, name) as WalletType;

    onClick(group);

    await connect({
      walletType,
      chainId: getConnectChainId({ appChains, selectedAdapter: targetAdapter, solanaRPCUrls }),
    });

    try {
      await waitFor(waitForPredict);
      setIsConnected(true);
      setTimeout(() => setIsOpen(false), 1000);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {!!connectors?.length && (
        <p
          className={cn('text-sm text-[var(--tuwa-text-secondary)]', {
            'font-bold text-[var(--tuwa-text-accent)]': isTitleBold,
          })}
        >
          {title}
        </p>
      )}
      <div className={cn('flex', isTouch ? touchCardContainerClasses : mouseCardContainerClasses)}>
        {!!connectors?.length &&
          connectors.map((group) => {
            const name = formatWalletName(group.name);

            return (
              <div key={`${name}-${group.adapters.join('-')}`} className={cn(isTouch && 'flex-shrink-0')}>
                <ConnectCard
                  icon={<WalletIcon icon={group.icon} name={name} />}
                  adapters={!selectedAdapter ? group.adapters : undefined}
                  onClick={() => handleConnectorClick(group)}
                  title={group.name}
                  isRecent={
                    recentWallets
                      ? recentWallets[group.adapters[0]]
                        ? recentWallets[group.adapters[0]][name]
                        : false
                      : false
                  }
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
