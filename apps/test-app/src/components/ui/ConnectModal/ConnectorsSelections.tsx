import { cn } from '@tuwaio/nova-core';
import { getWalletTypeFromConnectorName, OrbitAdapter } from '@tuwaio/orbit-core';
import { Connector, WalletType } from '@tuwaio/satellite-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';

import { ConnectorIcon } from '@/components/ui/ConnectModal/ConnectorIcon';
import { InitialChains } from '@/components/ui/types';
import { formatWalletName } from '@/components/ui/utils/formatWalletName';
import { getConnectChainId } from '@/components/ui/utils/getConnectedChainId';
import { waitFor } from '@/components/ui/utils/waitFor';

interface ConnectorsSelectionsProps extends InitialChains {
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
  const connect = useSatelliteConnectStore((store) => store.connect);

  if (!selectedAdapter) return null;

  const connectorsForAdapter = connectors[selectedAdapter]?.filter(
    (connector) => formatWalletName(connector.name) !== 'injected',
  );

  const connectorsForAdapterWithoutImpersonated = connectorsForAdapter?.filter(
    (connector) => formatWalletName(connector.name) !== 'impersonatedconnector',
  );

  const isImpersonatedConnectorInConnectors = connectorsForAdapter?.some(
    (connector) => formatWalletName(connector.name) === 'impersonatedconnector',
  );

  return (
    <div>
      {connectorsForAdapter?.length ? (
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 overflow-y-auto max-h-[310px]">
            {connectorsForAdapterWithoutImpersonated?.map((connector) => {
              const name = formatWalletName(connector.name);

              return (
                <button
                  key={name}
                  onClick={async () => {
                    onClick(name);
                    await connect({
                      walletType: getWalletTypeFromConnectorName(selectedAdapter, name) as WalletType,
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
                  className={cn(
                    'cursor-pointer w-full p-4 rounded-xl transition-colors',
                    'bg-[var(--tuwa-bg-secondary)] hover:bg-[var(--tuwa-bg-muted)]',
                    'border border-[var(--tuwa-border-primary)]',
                    'flex items-center justify-between',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <ConnectorIcon icon={connector.icon} name={name} />
                    <div className="text-left">
                      <div className="font-medium text-[var(--tuwa-text-primary)]">{connector.name}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {isImpersonatedConnectorInConnectors && (
            <button
              onClick={() => onClick('impersonatedconnector')}
              className={cn(
                'cursor-pointer w-full p-4 rounded-xl transition-colors',
                'bg-[var(--tuwa-bg-secondary)] hover:bg-[var(--tuwa-bg-muted)]',
                'border border-[var(--tuwa-border-primary)]',
                'flex items-center justify-between',
              )}
            >
              <div className="flex items-center gap-3">
                <ConnectorIcon name="impersonatedwallet" />
                <div className="text-left">
                  <div className="font-medium text-[var(--tuwa-text-primary)]">Impersonate Wallet</div>
                  <div className="text-sm text-[var(--tuwa-text-secondary)]">Read-only mode</div>
                </div>
              </div>
            </button>
          )}
        </div>
      ) : (
        <h1>Not found connectors for this network</h1>
      )}
    </div>
  );
}
