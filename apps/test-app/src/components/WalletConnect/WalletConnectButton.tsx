import { cn } from '@tuwaio/nova-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { FC, useState } from 'react';

import { ConnectedButtonContent } from '@/components/WalletConnect/ConnectedButtonContent';
import { NotConnectedButtonContent } from '@/components/WalletConnect/NotConnectedButtonContent';

import { WalletConnectModal } from './WalletConnectModal';

interface WalletConnectButtonProps {
  /** CSS classes to apply to the button */
  className?: string;
}

export const WalletConnectButton: FC<WalletConnectButtonProps> = ({ className }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);
  const disconnect = useSatelliteConnectStore((state) => state.disconnect);

  const handleClick = () => {
    if (activeWallet?.isConnected) {
      disconnect();
    } else {
      setIsModalOpen(true);
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
        {activeWallet?.isConnected ? <ConnectedButtonContent /> : <NotConnectedButtonContent />}
      </button>

      <WalletConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
