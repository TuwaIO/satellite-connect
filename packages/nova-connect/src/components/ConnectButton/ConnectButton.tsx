import { cn } from '@tuwaio/nova-core';
import { Transaction, TransactionPool, TxAdapter } from '@tuwaio/pulsar-core';
import { motion } from 'framer-motion';
import { FC, useMemo } from 'react';

import { NovaConnectProviderProps, useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { InitialChains } from '../../types';
import { ChainSelector } from '../Chains/ChainSelector';
import { ConnectedModal } from '../ConnectedModal/ConnectedModal';
import { ConnectModal } from '../ConnectModal/ConnectModal';
import { ConnectedContent } from './ConnectedContent';
import { WaitForConnectionContent } from './WaitForConnectionContent';

export type ConnectButtonProps = InitialChains &
  Pick<NovaConnectProviderProps, 'store'> & {
    /** CSS classes to apply to the button */
    className?: string;
    transactionPool?: TransactionPool<Transaction>;
    pulsarAdapter?: TxAdapter<Transaction> | TxAdapter<Transaction>[];
    withBalance?: boolean;
    withChain?: boolean;
    withImpersonated?: boolean;
  };

export const ConnectButton: FC<ConnectButtonProps> = ({
  solanaRPCUrls,
  appChains,
  transactionPool,
  pulsarAdapter,
  withImpersonated,
  withBalance,
  withChain,
  store,
  className,
}) => {
  const labels = useNovaConnectLabels();
  const { setIsConnectedModalOpen, setIsConnectModalOpen, activeWallet } = useNovaConnect();

  const isConnected = Boolean(activeWallet?.isConnected);

  const handleConnectButtonClick = () => {
    if (isConnected) {
      setIsConnectedModalOpen(true);
    } else {
      setIsConnectModalOpen(true);
    }
  };

  // Memoize button aria-label for better performance
  const buttonAriaLabel = useMemo(() => {
    if (isConnected) {
      return `${labels.walletConnected}. ${labels.openWalletModal}`;
    }
    return `${labels.walletNotConnected}. ${labels.connectWallet}`;
  }, [isConnected, labels]);

  // Memoize button class names for better performance
  const buttonClasses = useMemo(
    () =>
      cn(
        'cursor-pointer inline-flex items-center justify-center gap-2 px-3 min-h-[42px] py-1',
        'rounded-xl font-medium text-sm transition-all duration-200',
        'hover:scale-[1.02] active:scale-[0.98]',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        'focus:ring-offset-[var(--tuwa-bg-primary)]',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100',
        isConnected
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
      ),
    [isConnected, className],
  );

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleConnectButtonClick();
    }
  };

  return (
    <nav role="navigation" aria-label={labels.walletControls}>
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Chain Selector - only show when connected and withChain is enabled */}
        {withChain && isConnected && (
          <ChainSelector store={store} appChains={appChains} solanaRPCUrls={solanaRPCUrls} />
        )}

        {/* Main Connect Button */}
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
            type="button"
            onClick={handleConnectButtonClick}
            onKeyDown={handleKeyDown}
            className={buttonClasses}
            aria-label={buttonAriaLabel}
            aria-pressed={isConnected}
            role="button"
            tabIndex={0}
          >
            {isConnected ? (
              <ConnectedContent store={store} withBalance={withBalance} transactionPool={transactionPool} />
            ) : (
              <WaitForConnectionContent />
            )}
          </button>
        </motion.div>

        {/* Hidden modals - these will be shown based on application state */}
        <ConnectModal
          store={store}
          withImpersonated={withImpersonated}
          solanaRPCUrls={solanaRPCUrls}
          appChains={appChains}
        />
        <ConnectedModal
          solanaRPCUrls={solanaRPCUrls}
          appChains={appChains}
          transactionPool={transactionPool}
          pulsarAdapter={pulsarAdapter}
          store={store}
        />
      </div>
    </nav>
  );
};
