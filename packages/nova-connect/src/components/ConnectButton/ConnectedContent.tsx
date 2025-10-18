import { ChevronArrowWithAnim, cn } from '@tuwaio/nova-core';
import { Transaction, TransactionStatus } from '@tuwaio/pulsar-core';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import { useGetWalletNameAndAvatar, useWalletNativeBalance } from '../../hooks';
import { ButtonTxStatus, useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { WalletAvatar } from '../WalletAvatar';
import { ConnectButtonProps } from './ConnectButton';
import { StatusIcon } from './StatusIcon';

export function ConnectedContent({
  transactionPool,
  withBalance,
  store,
}: Pick<ConnectButtonProps, 'transactionPool' | 'store' | 'withBalance'>) {
  const labels = useNovaConnectLabels();

  const { isConnectedModalOpen, setConnectedButtonStatus, connectedButtonStatus, activeWallet } = useNovaConnect();

  const { ensAvatar, ensNameAbbreviated } = useGetWalletNameAndAvatar({
    store,
    abbreviateSymbols: 6,
    maxNameLength: 30,
    autoRetry: false,
    retryDelay: 3000,
  });

  const { balance } = useWalletNativeBalance({ store });

  const formattedBalance = balance?.value ? parseFloat(balance.value).toFixed(3) : '0.000';

  const prevTxPoolRef = useRef<Transaction[]>(
    Object.values(transactionPool ?? {}).filter((tx) => tx.from.toLowerCase() === activeWallet?.address.toLowerCase()),
  );

  // Reset status on mount and cleanup
  useEffect(() => {
    setConnectedButtonStatus('idle');
    return () => setConnectedButtonStatus('idle');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Monitor transaction pool changes
  useEffect(() => {
    if (!activeWallet || !activeWallet?.isConnected) {
      return;
    }

    const currentPool =
      Object.values(transactionPool ?? {}).filter(
        (tx) => tx.from.toLowerCase() === activeWallet?.address.toLowerCase(),
      ) || [];
    const prevPool = prevTxPoolRef.current || [];
    let newStatus: ButtonTxStatus = 'idle';

    const isAnyTxLoading = currentPool.some((tx) => tx.pending);

    if (isAnyTxLoading) {
      newStatus = 'loading';
    } else {
      for (const currentTx of currentPool) {
        const prevTx = prevPool.find((tx) => tx.txKey === currentTx.txKey);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionPool, activeWallet?.address, activeWallet?.isConnected]);

  // Auto-reset status after showing success/error states
  useEffect(() => {
    if (['succeed', 'failed', 'replaced'].includes(connectedButtonStatus)) {
      const timer = setTimeout(() => {
        setConnectedButtonStatus('idle');
      }, 2000);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectedButtonStatus]);

  // Get status-specific aria label
  const getStatusAriaLabel = useCallback(
    (status: ButtonTxStatus) => {
      switch (status) {
        case 'succeed':
          return labels.transactionSuccess;
        case 'failed':
          return labels.transactionError;
        case 'replaced':
          return labels.transactionReplaced;
        case 'loading':
          return labels.transactionLoading;
        default:
          return labels.walletAddress;
      }
    },
    [labels],
  );

  // Memoized status display configuration
  const statusDisplay = useMemo(() => {
    if (!activeWallet) return { displayName: null, avatarIcon: null, ariaLabel: '' };

    const baseAriaLabel = `${labels.transactionStatus}: ${getStatusAriaLabel(connectedButtonStatus)}`;

    switch (connectedButtonStatus) {
      case 'succeed':
        return {
          displayName: (
            <span className="novacon:text-[var(--tuwa-success-text)] novacon:font-medium" aria-label={labels.success}>
              {labels.success}
            </span>
          ),
          avatarIcon: (
            <StatusIcon txStatus="succeed" colorVar="success" aria-label={labels.transactionSuccess}>
              m4.5 12.75 6 6 9-13.5
            </StatusIcon>
          ),
          ariaLabel: baseAriaLabel,
        };
      case 'failed':
        return {
          displayName: (
            <span className="novacon:text-[var(--tuwa-error-text)] novacon:font-medium" aria-label={labels.error}>
              {labels.error}
            </span>
          ),
          avatarIcon: (
            <StatusIcon txStatus="failed" colorVar="error" aria-label={labels.transactionError}>
              M6 18 18 6M6 6l12 12
            </StatusIcon>
          ),
          ariaLabel: baseAriaLabel,
        };
      case 'replaced':
        return {
          displayName: (
            <span
              className="novacon:text-[var(--tuwa-text-secondary)] novacon:font-medium"
              aria-label={labels.replaced}
            >
              {labels.replaced}
            </span>
          ),
          avatarIcon: (
            <StatusIcon txStatus="replaced" colorVar="text" aria-label={labels.transactionReplaced}>
              M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0
              13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99
            </StatusIcon>
          ),
          ariaLabel: baseAriaLabel,
        };
      case 'loading':
        return {
          displayName: (
            <span
              className="novacon:text-[var(--tuwa-text-primary)] novacon:font-medium"
              aria-label={ensNameAbbreviated}
            >
              {ensNameAbbreviated}
            </span>
          ),
          avatarIcon: (
            <WalletAvatar
              address={activeWallet?.address}
              ensAvatar={ensAvatar}
              className="novacon:relative novacon:z-2"
              aria-label={`${labels.walletAvatar}: ${ensNameAbbreviated}`}
            />
          ),
          ariaLabel: `${labels.transactionLoading}. ${labels.walletAddress}: ${ensNameAbbreviated}`,
        };
      case 'idle':
      default:
        return {
          displayName: (
            <span
              className="novacon:text-[var(--tuwa-text-primary)] novacon:font-medium"
              aria-label={ensNameAbbreviated}
            >
              {ensNameAbbreviated}
            </span>
          ),
          avatarIcon: (
            <WalletAvatar
              address={activeWallet?.address}
              ensAvatar={ensAvatar}
              className="novacon:relative novacon:z-2"
              aria-label={`${labels.walletAvatar}: ${ensNameAbbreviated}`}
            />
          ),
          ariaLabel: `${labels.walletAddress}: ${ensNameAbbreviated}`,
        };
    }
  }, [connectedButtonStatus, ensNameAbbreviated, activeWallet, ensAvatar, labels, getStatusAriaLabel]);

  if (!activeWallet) return null;

  return (
    <div
      className="novacon:flex novacon:items-center novacon:gap-2 novacon:sm:gap-3"
      role="status"
      aria-live="polite"
      aria-label={statusDisplay.ariaLabel}
    >
      {/* Balance Display */}
      {withBalance && (
        <div
          className="novacon:relative novacon:hidden novacon:sm:flex novacon:items-center novacon:pr-2 novacon:gap-2 novacon:text-[var(--tuwa-text-secondary)]"
          role="text"
          aria-label={`${labels.walletBalance}: ${formattedBalance}`}
        >
          <span className="novacon:font-semibold novacon:mr-1" aria-hidden="true">
            {formattedBalance}
          </span>
          <div
            className="novacon:absolute novacon:top-1/2 novacon:right-0 novacon:transform novacon:-translate-y-1/2 novacon:h-4 novacon:w-[1px] novacon:bg-[var(--tuwa-border-primary)]"
            aria-hidden="true"
          />
        </div>
      )}

      {/* Main Content */}
      <div className={cn('novacon:flex novacon:items-center novacon:space-x-2', { 'novacon:sm:pl-2': withBalance })}>
        {/* Avatar/Status Icon Container */}
        <div
          className="novacon:relative novacon:z-1 novacon:p-1 novacon:rounded-full"
          role="img"
          aria-label={labels.transactionStatus}
        >
          {/* Loading Animation */}
          {connectedButtonStatus === 'loading' && (
            <div
              className={cn(
                "novacon:w-full novacon:h-full novacon:rounded-full novacon:absolute novacon:inset-0 novacon:before:content-[''] novacon:after:content-[''] novacon:before:rounded-full novacon:after:rounded-full novacon:before:absolute novacon:after:absolute novacon:before:inset-0 novacon:after:inset-0 novacon:before:u-shadow-inner-base novacon:after:u-shadow-inset-arc novacon:after:animate-rotate novacon:after:duration-2000 novacon:after:ease-linear novacon:after:infinite",
              )}
              aria-hidden="true"
            />
          )}
          {statusDisplay.avatarIcon}
        </div>

        {/* Status/Name Display */}
        <span
          className="novacon:text-[var(--tuwa-text-primary)] novacon:font-medium novacon:hidden novacon:min-[480px]:block"
          role="text"
        >
          {statusDisplay.displayName}
        </span>

        {/* Expand/Collapse Arrow */}
        <div aria-hidden="true">
          <ChevronArrowWithAnim isOpen={isConnectedModalOpen} className="novacon:xs:hidden" />
        </div>
      </div>
    </div>
  );
}
