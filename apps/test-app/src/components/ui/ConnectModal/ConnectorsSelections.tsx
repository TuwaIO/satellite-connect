import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { formatWalletName, isSafeApp } from '@tuwaio/satellite-core';
import { Connector } from '@tuwaio/satellite-react';
import React, { useEffect, useState } from 'react';

import { ConnectButtonProps } from '@/components/ui/ConnectButton/ConnectButton';
import { ConnectCard } from '@/components/ui/ConnectModal/ConnectCard';
import { ContentType } from '@/components/ui/ConnectModal/ConnectModal';
import { ConnectorsBlock } from '@/components/ui/ConnectModal/ConnectorsBlock';
import { Disclaimer } from '@/components/ui/ConnectModal/Disclaimer';
import { isTouchDevice } from '@/components/ui/utils/isTouchDevice';
import { WalletIcon } from '@/components/ui/WalletIcon';

export interface ConnectorsSelectionsProps
  extends Pick<ConnectButtonProps, 'solanaRPCUrls' | 'appChains' | 'withImpersonated'> {
  selectedAdapter: OrbitAdapter | undefined;
  connectors: Partial<Record<OrbitAdapter, Connector[]>>;
  onClick: (connectorName: string) => void;
  setIsConnected: (value: boolean) => void;
  setIsOpen: (value: boolean) => void;
  waitForPredict: () => boolean | undefined;
  setContentType: (contentType: ContentType) => void;
}

export function ConnectorsSelections({
  setIsConnected,
  setIsOpen,
  selectedAdapter,
  connectors,
  onClick,
  appChains,
  solanaRPCUrls,
  waitForPredict,
  setContentType,
  withImpersonated,
}: ConnectorsSelectionsProps) {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(isTouchDevice());
  }, []);

  if (!selectedAdapter) return null;

  const connectorsForAdapter = connectors[selectedAdapter]?.filter(
    (connector) => formatWalletName(connector.name) !== 'injected',
  );

  const installedConnectorsInitial = connectorsForAdapter?.filter(
    (connector) =>
      formatWalletName(connector.name) !== 'impersonatedwallet' &&
      formatWalletName(connector.name) !== 'coinbasewallet' &&
      formatWalletName(connector.name) !== 'walletconnect',
  );

  const installedConnectors = isSafeApp
    ? installedConnectorsInitial
    : installedConnectorsInitial?.filter((connector) => formatWalletName(connector.name) !== 'safewallet');

  const isImpersonatedConnectorInConnectors = connectorsForAdapter?.some(
    (connector) => formatWalletName(connector.name) === 'impersonatedwallet',
  );

  const popularConnectors = connectors[selectedAdapter]?.filter(
    (connector) =>
      formatWalletName(connector.name) === 'coinbasewallet' || formatWalletName(connector.name) === 'walletconnect',
  );

  const touchListClasses = ['flex-row', 'overflow-x-auto', 'max-h-none', 'gap-3', 'pb-4', 'px-1'];
  const mouseListClasses = ['flex-col', 'overflow-y-auto', 'max-h-[310px]', 'gap-2'];

  if (!connectorsForAdapter?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center border border-[var(--tuwa-border-primary)] rounded-xl bg-[var(--tuwa-bg-secondary)] text-[var(--tuwa-text-secondary)]">
        <ExclamationTriangleIcon width={32} height={32} className="text-[var(--tuwa-text-accent)] mb-3" />
        <h2 className="text-lg font-semibold text-[var(--tuwa-text-primary)] mb-1">No Connectors Found</h2>
        <p className="text-sm">We couldn't find any wallets or connection methods for the selected network.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className={cn('flex flex-col gap-2', { 'flex-row': isTouch })}>
        <div className={cn('flex', isTouch ? touchListClasses : mouseListClasses)}>
          <ConnectorsBlock
            connectors={installedConnectors}
            title="Installed"
            selectedAdapter={selectedAdapter}
            onClick={onClick}
            waitForPredict={waitForPredict}
            solanaRPCUrls={solanaRPCUrls}
            setIsConnected={setIsConnected}
            setIsOpen={setIsOpen}
            appChains={appChains}
            isTitleBold
          />
          <ConnectorsBlock
            connectors={popularConnectors}
            title="Popular"
            selectedAdapter={selectedAdapter}
            onClick={onClick}
            waitForPredict={waitForPredict}
            solanaRPCUrls={solanaRPCUrls}
            setIsConnected={setIsConnected}
            setIsOpen={setIsOpen}
            appChains={appChains}
          />
        </div>

        {isImpersonatedConnectorInConnectors && withImpersonated && (
          <div className={cn({ 'flex flex-col gap-2': isTouch })}>
            <p className={cn('text-sm hidden', { 'block opacity-0': isTouch })}>Impersonate</p>
            <ConnectCard
              icon={<WalletIcon name="impersonatedwallet" />}
              onClick={() => onClick('impersonatedwallet')}
              title="Impersonate"
              subtitle="Read-only mode"
            />
          </div>
        )}
      </div>

      {isTouch && (
        <Disclaimer
          title="What is a wallet?"
          description="Wallets are essential for managing your crypto—they let you send, receive, and securely hold digital assets. Connecting your wallet grants you safe access and interaction with decentralized applications (dApps)."
          learnMoreAction={() => setContentType('about')}
        />
      )}
    </div>
  );
}
