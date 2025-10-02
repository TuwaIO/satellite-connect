import { cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { Connector } from '@tuwaio/satellite-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';

import { ConnectorIcon } from '@/components/ui/ConnectModal/ConnectorIcon';
import { formatWalletName } from '@/components/ui/utils/formatWalletName';

interface ConnectingProps {
  activeConnector: string | undefined;
  selectedAdapter: OrbitAdapter | undefined;
  connectors: Partial<Record<OrbitAdapter, Connector[]>>;
  isConnected: boolean;
}

export function Connecting({ activeConnector, selectedAdapter, connectors, isConnected }: ConnectingProps) {
  const walletConnectionError = useSatelliteConnectStore((store) => store.walletConnectionError);

  if (!selectedAdapter) return null;
  if (!activeConnector) return null;

  const connector = connectors[selectedAdapter]?.find(
    (connector) => formatWalletName(connector.name) === activeConnector,
  );

  if (!connector) return null;

  const ICON_SIZE_CLASSES = '[&>img]:w-[60px] [&>img]:h-[60px] md:[&>img]:w-[80px] md:[&>img]:h-[80px]';
  const PADDING_CLASSES = 'p-4 md:p-6';
  const BORDER_THICKNESS = 'border-[2px]';

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full">
      <div className="relative flex items-center justify-center">
        {!walletConnectionError && !isConnected && (
          <div
            className={cn(
              'absolute animate-spin rounded-full',
              'w-full h-full',
              BORDER_THICKNESS,
              'border-[var(--tuwa-pending-text)]',
              'border-t-transparent',
            )}
            role="status"
          >
            <span className="sr-only">Connecting...</span>
          </div>
        )}

        <div
          className={cn(
            'flex items-center justify-center',
            BORDER_THICKNESS,
            'border-[var(--tuwa-border-primary)] rounded-full',
            PADDING_CLASSES,
            ICON_SIZE_CLASSES,
            {
              'border-[var(--tuwa-error-text)]': walletConnectionError,
              'border-[var(--tuwa-success-text)]': isConnected,
            },
          )}
        >
          <ConnectorIcon icon={connector.icon} name={activeConnector} />
        </div>
      </div>

      <p className="text-lg font-semibold text-[var(--tuwa-text-primary)]">
        {walletConnectionError
          ? 'Connection error'
          : isConnected
            ? 'Connected successfully!'
            : `Connecting to ${activeConnector}...`}
      </p>

      {walletConnectionError && (
        <p className="text-sm text-[var(--tuwa-error-text)] text-center">
          Cannot connect to the wallet. Please try again or use another connector.
        </p>
      )}
    </div>
  );
}
