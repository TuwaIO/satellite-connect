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
        'novacon:cursor-pointer novacon:inline-flex novacon:items-center novacon:justify-center novacon:gap-2 novacon:px-3 novacon:min-h-[42px] novacon:py-1',
        'novacon:rounded-xl novacon:font-medium novacon:text-sm novacon:transition-all novacon:duration-200',
        'novacon:hover:scale-[1.02] novacon:active:scale-[0.98]',
        'novacon:focus:outline-none novacon:focus:ring-2 novacon:focus:ring-offset-2',
        'novacon:focus:ring-offset-[var(--tuwa-bg-primary)]',
        'novacon:disabled:opacity-50 novacon:disabled:cursor-not-allowed novacon:disabled:hover:scale-100',
        isConnected
          ? [
              'novacon:bg-[var(--tuwa-bg-secondary)]',
              'novacon:text-[var(--tuwa-text-primary)]',
              'novacon:hover:bg-[var(--tuwa-bg-muted)]',
              'novacon:focus:ring-[var(--tuwa-text-secondary)]',
              'novacon:border novacon:border-[var(--tuwa-border-primary)]',
            ]
          : [
              'novacon:bg-gradient-to-r',
              'novacon:from-[var(--tuwa-button-gradient-from)]',
              'novacon:to-[var(--tuwa-button-gradient-to)]',
              'novacon:text-[var(--tuwa-text-on-accent)]',
              'novacon:hover:from-[var(--tuwa-button-gradient-from-hover)]',
              'novacon:hover:to-[var(--tuwa-button-gradient-to-hover)]',
              'novacon:focus:ring-[var(--tuwa-text-accent)]',
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
      <div className="novacon:flex novacon:items-center novacon:gap-2 novacon:sm:gap-3">
        {/* Chain Selector - only show when connected and withChain is enabled */}
        {withChain && isConnected && (
          <ChainSelector store={store} appChains={appChains} solanaRPCUrls={solanaRPCUrls} />
        )}

        {/* Main Connect Button */}
        <motion.div
          layout
          className="novacon:relative"
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
