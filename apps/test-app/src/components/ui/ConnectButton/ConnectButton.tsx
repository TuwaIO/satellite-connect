import { cn } from '@tuwaio/nova-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { FC, useState } from 'react';

import { ConnectedContent } from '@/components/ui/ConnectButton/ConnectedContent';
import { WaitForConnectionContent } from '@/components/ui/ConnectButton/WaitForConnectionContent';
import { ConnectedModal } from '@/components/ui/ConnectedModal/ConnectedModal';
import { ConnectModal } from '@/components/ui/ConnectModal/ConnectModal';
import { InitialChains } from '@/components/ui/types';

interface ConnectButtonProps extends InitialChains {
  /** CSS classes to apply to the button */
  className?: string;
}

export const ConnectButton: FC<ConnectButtonProps> = ({ className, solanaRPCUrls, appChains }) => {
  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isConnectedModalOpen, setIsConnectedModalOpen] = useState(false);
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);

  const handleClick = () => {
    if (activeWallet?.isConnected) {
      setIsConnectedModalOpen(true);
    } else {
      setIsConnectModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        className={cn(
          // Layout and positioning
          'cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2',
          'rounded-xl font-medium text-sm transition-all duration-200',

          // Interactive states
          'hover:scale-[1.02] active:scale-[0.98]',
          'focus:outline-none focus:ring-2 focus:ring-offset-2',
          'focus:ring-offset-[var(--tuwa-bg-primary)]',

          // Connected/Disconnected states
          activeWallet?.isConnected
            ? [
                'bg-[var(--tuwa-bg-secondary)]',
                'text-[var(--tuwa-text-primary)]',
                'hover:bg-[var(--tuwa-bg-muted)]',
                'focus:ring-[var(--tuwa-text-secondary)]',
                'border border-[var(--tuwa-border-primary)]',
              ]
            : [
                'bg-gradient-to-r',
                'from-[var(--tuwa-button-gradient-from)]',
                'to-[var(--tuwa-button-gradient-to)]',
                'text-[var(--tuwa-text-on-accent)]',
                'hover:from-[var(--tuwa-button-gradient-from-hover)]',
                'hover:to-[var(--tuwa-button-gradient-to-hover)]',
                'focus:ring-[var(--tuwa-text-accent)]',
              ],

          className,
        )}
      >
        {activeWallet?.isConnected ? <ConnectedContent /> : <WaitForConnectionContent />}
      </button>

      <ConnectModal
        isOpen={isConnectModalOpen}
        setIsOpen={setIsConnectModalOpen}
        appChains={appChains}
        solanaRPCUrls={solanaRPCUrls}
      />
      <ConnectedModal isOpen={isConnectedModalOpen} setIsOpen={setIsConnectedModalOpen} />
    </>
  );
};
