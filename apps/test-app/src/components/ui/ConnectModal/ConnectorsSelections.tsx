import { OrbitAdapter } from '@tuwaio/orbit-core';
import { Connector } from '@tuwaio/satellite-core';

import { ConnectCard } from '@/components/ui/ConnectModal/ConnectCard';
import { ConnectorIcon } from '@/components/ui/ConnectModal/ConnectorIcon';
import { ConnectorsBlock } from '@/components/ui/ConnectModal/ConnectorsBlock';
import { InitialChains } from '@/components/ui/types';
import { formatWalletName } from '@/components/ui/utils/formatWalletName';

export interface ConnectorsSelectionsProps extends InitialChains {
  selectedAdapter: OrbitAdapter | undefined;
  connectors: Partial<Record<OrbitAdapter, Connector[]>>;
  onClick: (connectorName: string) => void;
  setIsConnected: (value: boolean) => void;
  setIsOpen: (value: boolean) => void;
  waitForPredict: () => boolean | undefined;
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
}: ConnectorsSelectionsProps) {
  if (!selectedAdapter) return null;

  const connectorsForAdapter = connectors[selectedAdapter]?.filter(
    (connector) => formatWalletName(connector.name) !== 'injected',
  );

  const installedConnectors = connectorsForAdapter?.filter(
    (connector) =>
      formatWalletName(connector.name) !== 'impersonatedconnector' &&
      formatWalletName(connector.name) !== 'coinbasewallet' &&
      formatWalletName(connector.name) !== 'walletconnect',
  );

  const isImpersonatedConnectorInConnectors = connectorsForAdapter?.some(
    (connector) => formatWalletName(connector.name) === 'impersonatedconnector',
  );

  const popularConnectors = connectors[selectedAdapter]?.filter(
    (connector) =>
      formatWalletName(connector.name) === 'coinbasewallet' || formatWalletName(connector.name) === 'walletconnect',
  );

  return (
    <div>
      {connectorsForAdapter?.length ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[310px]">
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

          {isImpersonatedConnectorInConnectors && (
            <ConnectCard
              icon={<ConnectorIcon name="impersonatedwallet" />}
              onClick={() => onClick('impersonatedconnector')}
              title="Impersonate Wallet"
              subtitle="Read-only mode"
            />
          )}
        </div>
      ) : (
        <h1>Not found connectors for this network</h1>
      )}
    </div>
  );
}
