import { cn } from '@tuwaio/nova-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { FC, useMemo, useState } from 'react';

import { WalletConnectModal } from './WalletConnectModal';

interface WalletConnectButtonProps {
  /** CSS classes to apply to the button */
  className?: string;
  /** Whether to show full address or truncated */
  showFullAddress?: boolean;
}

export const WalletConnectButton: FC<WalletConnectButtonProps> = ({ className = '', showFullAddress = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);
  const disconnect = useSatelliteConnectStore((state) => state.disconnect);

  // Format address for display
  const formattedAddress = useMemo(() => {
    if (!activeWallet?.address) return '';
    return showFullAddress
      ? activeWallet.address
      : `${activeWallet.address.slice(0, 6)}...${activeWallet.address.slice(-4)}`;
  }, [activeWallet?.address, showFullAddress]);

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
          'inline-flex items-center justify-center gap-2 px-4 py-2',
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
        {activeWallet?.isConnected ? (
          <>
            {/* Wallet Avatar/Icon with TUWA gradient */}
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)]" />

            {/* Address with monospace font */}
            <span className="font-mono text-[var(--tuwa-text-primary)]">{formattedAddress}</span>

            {/* Connected Status Indicator */}
            <div className="w-2 h-2 rounded-full bg-[var(--tuwa-success-icon)]" />
          </>
        ) : (
          <>
            {/* Wallet Icon */}
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2m2-4h.01M17 16h.01"
              />
            </svg>

            <span>Connect Wallet</span>
          </>
        )}
      </button>

      <WalletConnectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};
