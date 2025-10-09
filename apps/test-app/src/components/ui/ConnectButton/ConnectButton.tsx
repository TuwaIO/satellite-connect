import { cn } from '@tuwaio/nova-core';
import { Transaction, TransactionPool, TxAdapter } from '@tuwaio/pulsar-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { motion } from 'framer-motion';
import { FC, useState } from 'react';

import { ChainSelector } from '@/components/ui/Chains/ChainSelector';
import { ConnectedContent } from '@/components/ui/ConnectButton/ConnectedContent';
import { WaitForConnectionContent } from '@/components/ui/ConnectButton/WaitForConnectionContent';
import { ConnectedModal } from '@/components/ui/ConnectedModal/ConnectedModal';
import { ConnectModal } from '@/components/ui/ConnectModal/ConnectModal';
import { InitialChains } from '@/components/ui/types';

export type ConnectButtonProps = InitialChains & {
  /** CSS classes to apply to the button */
  className?: string;
  withBalance?: boolean;
  withChain?: boolean;
  withImpersonated?: boolean;
  transactionPool?: TransactionPool<Transaction>;
  pulsarAdapter?: TxAdapter<Transaction> | TxAdapter<Transaction>[];
  onClick: () => void;
};

export const ConnectButton: FC<Omit<ConnectButtonProps, 'onClick'>> = ({
  className,
  solanaRPCUrls,
  appChains,
  withBalance,
  withChain,
  withImpersonated,
  transactionPool,
  pulsarAdapter,
}) => {
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);

  const [isConnectModalOpen, setIsConnectModalOpen] = useState(false);
  const [isConnectedModalOpen, setIsConnectedModalOpen] = useState(false);

  const handleClick = () => {
    if (activeWallet?.isConnected) {
      setIsConnectedModalOpen(true);
    } else {
      setIsConnectModalOpen(true);
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      {withChain && activeWallet?.isConnected && <ChainSelector appChains={appChains} solanaRPCUrls={solanaRPCUrls} />}

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
            'cursor-pointer inline-flex items-center justify-center gap-2 px-3 min-h-[42px] py-1',
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
          {activeWallet?.isConnected ? (
            <ConnectedContent
              withBalance={withBalance}
              transactionPool={transactionPool}
              isConnectedModalOpen={isConnectedModalOpen}
            />
          ) : (
            <WaitForConnectionContent />
          )}
        </button>
      </motion.div>

      <ConnectModal
        isOpen={isConnectModalOpen}
        setIsOpen={setIsConnectModalOpen}
        appChains={appChains}
        solanaRPCUrls={solanaRPCUrls}
        withImpersonated={withImpersonated}
      />
      <ConnectedModal
        isOpen={isConnectedModalOpen}
        setIsOpen={setIsConnectedModalOpen}
        appChains={appChains}
        solanaRPCUrls={solanaRPCUrls}
        transactionPool={transactionPool}
        pulsarAdapter={pulsarAdapter}
        onChangeWalletClick={() => {
          setIsConnectedModalOpen(false);
          setIsConnectModalOpen(true);
        }}
      />
    </div>
  );
};
