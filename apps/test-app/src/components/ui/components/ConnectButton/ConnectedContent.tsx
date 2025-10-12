import { ChevronArrowWithAnim, cn } from '@tuwaio/nova-core';
import { Transaction, TransactionPool, TransactionStatus } from '@tuwaio/pulsar-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { useEffect, useMemo, useRef } from 'react';

import { ButtonTxStatus, useNovaConnect } from '../../hooks/useNovaConnect';
import { WalletAvatar } from '../WalletAvatar';
import { StatusIcon } from './StatusIcon';

export function ConnectedContent() {
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);

  const {
    withBalance,
    transactionPool,
    isConnectedModalOpen,
    setConnectedButtonStatus,
    formattedBalance,
    ensNameAbbreviated,
    ensAvatar,
    connectedButtonStatus,
  } = useNovaConnect();

  const prevTxPoolRef = useRef<TransactionPool<Transaction>>(transactionPool);

  useEffect(() => {
    if (!activeWallet) {
      setConnectedButtonStatus('idle');
      return;
    }

    const currentPool = transactionPool || {};
    const prevPool = prevTxPoolRef.current || {};
    let newStatus: ButtonTxStatus = 'idle';

    const transactions = Object.values(currentPool);

    const isAnyTxLoading = transactions.some((tx) => tx.pending);

    if (isAnyTxLoading) {
      newStatus = 'loading';
    } else {
      for (const currentTx of transactions) {
        const prevTx = prevPool[currentTx.txKey];

        if (currentTx.status && currentTx.status !== prevTx?.status) {
          switch (currentTx.status) {
            case TransactionStatus.Success:
              newStatus = 'succeed';
              break;
            case TransactionStatus.Replaced:
              newStatus = 'replaced';
              break;
            case TransactionStatus.Failed:
              newStatus = 'failed';
              break;
          }
        }
      }
    }

    if (newStatus === 'loading' || newStatus !== 'idle') {
      setConnectedButtonStatus(newStatus);
    }

    prevTxPoolRef.current = currentPool;
  }, [transactionPool, activeWallet, setConnectedButtonStatus]);

  useEffect(() => {
    if (['succeed', 'failed', 'replaced'].includes(connectedButtonStatus)) {
      const timer = setTimeout(() => {
        setConnectedButtonStatus('idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [connectedButtonStatus, setConnectedButtonStatus]);

  const statusDisplay = useMemo(() => {
    if (!activeWallet) return { displayName: null, avatarIcon: null };

    switch (connectedButtonStatus) {
      case 'succeed':
        return {
          displayName: <span className="text-[var(--tuwa-success-text)] font-medium">Success</span>,
          avatarIcon: (
            <StatusIcon txStatus="succeed" colorVar="success">
              m4.5 12.75 6 6 9-13.5
            </StatusIcon>
          ),
        };
      case 'failed':
        return {
          displayName: <span className="text-[var(--tuwa-error-text)] font-medium">Error</span>,
          avatarIcon: (
            <StatusIcon txStatus="failed" colorVar="error">
              M6 18 18 6M6 6l12 12
            </StatusIcon>
          ),
        };
      case 'replaced':
        return {
          displayName: <span className="text-[var(--tuwa-text-secondary)] font-medium">Replaced</span>,
          avatarIcon: (
            <StatusIcon txStatus="replaced" colorVar="text">
              M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0
              13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99
            </StatusIcon>
          ),
        };
      case 'loading':
      case 'idle':
      default:
        return {
          displayName: <span className="text-[var(--tuwa-text-primary)] font-medium">{ensNameAbbreviated}</span>,
          avatarIcon: <WalletAvatar address={activeWallet?.address} ensAvatar={ensAvatar} className="relative z-2" />,
        };
    }
  }, [connectedButtonStatus, ensNameAbbreviated, activeWallet, ensAvatar]);

  if (!activeWallet) return null;

  return (
    <>
      {withBalance && (
        <div className="relative hidden sm:flex items-center pr-2 gap-2 text-[var(--tuwa-text-secondary)]">
          <span className="font-semibold mr-1">{formattedBalance}</span>
          <div className="absolute top-1/2 right-0 transform -translate-y-1/2 h-4 w-[1px] bg-[var(--tuwa-border-primary)]" />
        </div>
      )}

      <div className={cn('flex items-center space-x-2', { 'sm:pl-2': withBalance })}>
        <div className="relative z-1 p-1 rounded-full">
          {status === 'loading' && (
            <div
              className={cn(
                "w-full h-full rounded-full absolute inset-0 before:content-[''] after:content-[''] before:rounded-full after:rounded-full before:absolute after:absolute before:inset-0 after:inset-0 before:u-shadow-inner-base after:u-shadow-inset-arc after:animate-rotate after:duration-2000 after:ease-linear after:infinite",
              )}
            />
          )}
          {statusDisplay.avatarIcon}
        </div>

        <span className="text-[var(--tuwa-text-primary)] font-medium hidden min-[480px]:block">
          {statusDisplay.displayName}
        </span>
        <ChevronArrowWithAnim isOpen={isConnectedModalOpen} className="xs:hidden" />
      </div>
    </>
  );
}
