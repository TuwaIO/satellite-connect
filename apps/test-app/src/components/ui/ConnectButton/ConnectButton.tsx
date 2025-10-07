import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import { formatWalletChainId } from '@tuwaio/orbit-core';
import { getAdapterFromWalletType } from '@tuwaio/satellite-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { motion } from 'framer-motion';
import { FC, useState } from 'react';

import { ConnectedContent } from '@/components/ui/ConnectButton/ConnectedContent';
import { WaitForConnectionContent } from '@/components/ui/ConnectButton/WaitForConnectionContent';
import { ConnectedModal } from '@/components/ui/ConnectedModal/ConnectedModal';
import { ConnectModal } from '@/components/ui/ConnectModal/ConnectModal';
import { InitialChains } from '@/components/ui/types';
import { getChainsListByWalletType } from '@/components/ui/utils/getChainsListByWalletType';

export interface ConnectButtonProps extends InitialChains {
  /** CSS classes to apply to the button */
  className?: string;
  withBalance?: boolean;
  withChain?: boolean;
  onClick: () => void;
}

export const ConnectButton: FC<Omit<ConnectButtonProps, 'onClick'>> = ({
  className,
  solanaRPCUrls,
  appChains,
  withBalance,
  withChain,
}) => {
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);
  const switchNetwork = useSatelliteConnectStore((state) => state.switchNetwork);

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isConnectedModalOpen, setIsConnectedModalOpen] = useState(false);
  const [isChainsListOpen, setIsChainsListOpen] = useState(false);

  const handleClick = () => {
    if (activeWallet?.isConnected) {
      setIsConnectedModalOpen(true);
    } else {
      setIsConnectModalOpen(true);
    }
  };

  const chainsList = activeWallet
    ? getChainsListByWalletType({ walletType: activeWallet?.walletType, appChains, solanaRPCUrls })
    : [];

  return (
    <>
      {withChain && activeWallet?.isConnected && (
        <>
          <button
            type="button"
            onClick={() => setIsChainsListOpen(!isChainsListOpen)}
            className="[&>img]:w-[24px] [&>img]:h-[24px]"
          >
            <Web3Icon
              chainId={formatWalletChainId(activeWallet?.chainId, getAdapterFromWalletType(activeWallet?.walletType))}
            />
            <ChevronDownIcon className="w-3 h-3" />
          </button>
          {chainsList.map((chain) => {
            return (
              <button type="button" onClick={() => switchNetwork(chain)} key={chain}>
                <p>{chain}</p>
              </button>
            );
          })}
        </>
      )}

      <motion.div
        layout
        className="relative"
        transition={{
          layout: {
            duration: 0.2,
            ease: [0.1, 0.1, 0.2, 1],
          },
        }}
      >
        <button
          onClick={handleClick}
          className={cn(
            'cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2',
            'rounded-xl font-medium text-sm transition-all duration-200',
            'hover:scale-[1.02] active:scale-[0.98]',
            'focus:outline-none focus:ring-2 focus:ring-offset-2',
            'focus:ring-offset-[var(--tuwa-bg-primary)]',
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
          {activeWallet?.isConnected ? <ConnectedContent withBalance={withBalance} /> : <WaitForConnectionContent />}
        </button>
      </motion.div>

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
