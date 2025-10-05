import { cn } from '@tuwaio/nova-core';
import { getWalletTypeFromConnectorName, OrbitAdapter } from '@tuwaio/orbit-core';
import { recentConnectedWalletHelpers, WalletType } from '@tuwaio/satellite-core';
import { Connector, useSatelliteConnectStore } from '@tuwaio/satellite-react';
import React, { useEffect, useState } from 'react';

import { ConnectCard } from '@/components/ui/ConnectModal/ConnectCard';
import { ConnectorIcon } from '@/components/ui/ConnectModal/ConnectorIcon';
import { ConnectorsSelectionsProps } from '@/components/ui/ConnectModal/ConnectorsSelections';
import { formatWalletName } from '@/components/ui/utils/formatWalletName';
import { getConnectChainId } from '@/components/ui/utils/getConnectedChainId';
import { isTouchDevice } from '@/components/ui/utils/isTouchDevice';
import { waitFor } from '@/components/ui/utils/waitFor';

interface ConnectorsBlockProps
  extends Pick<
    ConnectorsSelectionsProps,
    'waitForPredict' | 'setIsOpen' | 'setIsConnected' | 'onClick' | 'appChains' | 'solanaRPCUrls'
  > {
  selectedAdapter: OrbitAdapter;
  connectors: Connector[] | undefined;
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
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  const connect = useSatelliteConnectStore((store) => store.connect);
  const recentWallets = recentConnectedWalletHelpers.getRecentConnectedWallet();

  const touchCardContainerClasses = ['flex-row', 'gap-3'];
  const mouseCardContainerClasses = ['flex-col', 'gap-2'];

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
          connectors.map((connector) => {
            const name = formatWalletName(connector.name);
            const walletType = getWalletTypeFromConnectorName(selectedAdapter, name) as WalletType;

            return (
              <div key={name} className={cn(isTouch && 'flex-shrink-0')}>
                <ConnectCard
                  icon={<ConnectorIcon icon={connector.icon} name={name} />}
                  onClick={async () => {
                    onClick(name);
                    await connect({
                      walletType,
                      chainId: getConnectChainId({ appChains, selectedAdapter, solanaRPCUrls }),
                    });
                    try {
                      await waitFor(waitForPredict);
                      setIsConnected(true);
                      setTimeout(() => setIsOpen(false), 1000);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  title={connector.name}
                  isRecent={recentWallets?.wallets[selectedAdapter] === walletType}
                />
              </div>
            );
          })}
      </div>
    </div>
  );
}
