import { cn } from '@tuwaio/nova-core';
import { Transaction, TransactionPool, TxAdapter } from '@tuwaio/pulsar-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { motion } from 'framer-motion';
import { FC } from 'react';

import { useNovaConnect } from '../../hooks/useNovaConnect';
import { InitialChains } from '../../types';
import { ChainSelector } from '../Chains/ChainSelector';
import { ConnectedContent } from '../ConnectButton/ConnectedContent';
import { ConnectedModal } from '../ConnectedModal/ConnectedModal';
import { ConnectModal } from '../ConnectModal/ConnectModal';
import { WaitForConnectionContent } from './WaitForConnectionContent';

export type ConnectButtonProps = InitialChains & {
  /** CSS classes to apply to the button */
  className?: string;
  transactionPool?: TransactionPool<Transaction>;
  pulsarAdapter?: TxAdapter<Transaction> | TxAdapter<Transaction>[];
};

export const ConnectButton: FC<ConnectButtonProps> = ({
  solanaRPCUrls,
  appChains,
  transactionPool,
  pulsarAdapter,
  className,
}) => {
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);
  const { withChain, handleConnectButtonClick } = useNovaConnect();

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
          onClick={handleConnectButtonClick}
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
            <ConnectedContent transactionPool={transactionPool} />
          ) : (
            <WaitForConnectionContent />
          )}
        </button>
      </motion.div>

      <ConnectModal solanaRPCUrls={solanaRPCUrls} appChains={appChains} />
      <ConnectedModal
        solanaRPCUrls={solanaRPCUrls}
        appChains={appChains}
        transactionPool={transactionPool}
        pulsarAdapter={pulsarAdapter}
      />
    </div>
  );
};
