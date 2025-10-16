import { standardButtonClasses } from '@tuwaio/nova-core';
import { getAdapterFromWalletType } from '@tuwaio/orbit-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useMemo } from 'react';

import { ConnectButtonProps } from '@/components/ui/components/ConnectButton/ConnectButton';

import { useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { WalletAvatar } from '../WalletAvatar';
import { ConnectedModalNameAndBalance } from './ConnectedModalNameAndBalance';
import { IconButton } from './IconButton';

/**
 * Props for the ConnectedModalMainContent component
 */
interface ConnectedModalMainContentProps extends Pick<ConnectButtonProps, 'transactionPool'> {
  /** List of available chains for the current wallet */
  chainsList: (string | number)[];
}

/**
 * Main content component for the connected wallet modal
 *
 * This component displays the primary interface for connected wallet management:
 * - Large wallet avatar with ENS support
 * - Wallet and network switching controls via IconButton components
 * - Loading indicators for avatar and balance states
 * - Transaction history access when transactions are available
 * - Animated pending transaction indicator
 *
 * The component provides full WCAG compliance with proper ARIA labels,
 * semantic HTML structure, and keyboard navigation support.
 *
 * @param props - Component props containing transaction pool and chains list
 * @returns JSX element representing the main modal content with wallet controls
 *
 * @example
 * ```tsx
 * <ConnectedModalMainContent
 *   transactionPool={transactionPool}
 *   chainsList={availableChains}
 * />
 * ```
 *
 * @public
 */
export function ConnectedModalMainContent({ transactionPool, chainsList }: ConnectedModalMainContentProps) {
  // Get localized labels for UI text
  const labels = useNovaConnectLabels();

  // Get wallet state from store
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);
  const getConnectors = useSatelliteConnectStore((store) => store.getConnectors);

  // Get modal controls and state from hook
  const {
    ensAvatar,
    balanceLoading,
    avatarIsLoading,
    setConnectedModalContentType,
    setIsConnectedModalOpen,
    setIsConnectModalOpen,
  } = useNovaConnect();

  /**
   * Handle wallet switching by closing connected modal and opening connect modal
   * Provides seamless transition between modal views
   */
  const handleSwitchWallet = useCallback(() => {
    setIsConnectedModalOpen(false);
    setIsConnectModalOpen(true);
  }, [setIsConnectedModalOpen, setIsConnectModalOpen]);

  /**
   * Handle network switching by changing to chains view
   */
  const handleSwitchNetwork = useCallback(() => {
    setConnectedModalContentType('chains');
  }, [setConnectedModalContentType]);

  /**
   * Handle viewing transactions by changing to transactions view
   */
  const handleViewTransactions = useCallback(() => {
    setConnectedModalContentType('transactions');
  }, [setConnectedModalContentType]);

  /**
   * Memoized connectors to prevent unnecessary recalculations
   */
  const connectors = useMemo(() => getConnectors(), [getConnectors]);

  /**
   * Memoized wallet transactions filtered by current wallet address
   * Only includes transactions from the currently connected wallet
   */
  const walletTransactions = useMemo(() => {
    if (!activeWallet || !transactionPool) return [];

    return Object.values(transactionPool).filter((tx) => tx.from.toLowerCase() === activeWallet.address.toLowerCase());
  }, [activeWallet, transactionPool]);

  /**
   * Check if there are pending transactions for loading indicator
   */
  const hasPendingTransactions = useMemo(() => walletTransactions.some((tx) => tx.pending), [walletTransactions]);

  /**
   * Get number of available connectors for the current wallet type
   */
  const connectorsCount = useMemo(() => {
    if (!activeWallet) return 0;
    return connectors[getAdapterFromWalletType(activeWallet.walletType)]?.length || 0;
  }, [activeWallet, connectors]);

  /**
   * Get wallet name from wallet type for display
   */
  const walletName = useMemo(() => {
    return activeWallet?.walletType?.split(':')[1] || labels.unknownWallet;
  }, [activeWallet?.walletType, labels.unknownWallet]);

  // Early return if no active wallet
  if (!activeWallet) return null;

  return (
    <div
      className="flex flex-col items-center justify-center gap-2 p-4"
      role="main"
      aria-label={`${labels.walletConnected} - ${walletName}`}
    >
      {/* Loading Indicator */}
      <AnimatePresence>
        {(avatarIsLoading || balanceLoading) && (
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.6, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute right-5 top-2 w-5 h-5"
            role="status"
            aria-label={labels.loading}
          >
            <div className="Toastify__spinner" aria-hidden="true" />
            <span className="sr-only">{labels.loading}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wallet Avatar with Control Buttons */}
      <div className="mb-6 relative" role="group" aria-label={labels.walletControls}>
        {/* Wallet Switch Button */}
        <IconButton
          className="absolute z-11 bottom-[-10px] left-[-10px]"
          walletIcon={activeWallet.walletIcon}
          walletName={walletName}
          items={connectorsCount}
          onClick={handleSwitchWallet}
          aria-label={`${labels.connectWallet} - ${connectorsCount} ${labels.connectWallet.toLowerCase()} available`}
          data-testid="switch-wallet-button"
        />

        {/* Network Switch Button */}
        <IconButton
          className="absolute z-11 bottom-[-10px] right-[-10px]"
          walletChainId={activeWallet.chainId}
          items={chainsList.length}
          onClick={handleSwitchNetwork}
          aria-label={`${labels.switchNetwork} - ${chainsList.length} ${labels.listOfNetworks.toLowerCase()} available`}
          data-testid="switch-network-button"
        />

        {/* Main Wallet Avatar */}
        <WalletAvatar
          ensAvatar={ensAvatar}
          address={activeWallet.address}
          className="w-28 h-28 sm:w-32 sm:h-32"
          aria-describedby="wallet-info"
        />
      </div>

      {/* Wallet Name and Balance */}
      <div id="wallet-info" role="region" aria-label={labels.walletBalance}>
        <ConnectedModalNameAndBalance />
      </div>

      {/* Transactions Section */}
      {walletTransactions.length > 0 && (
        <div
          className="relative flex items-center justify-center gap-2"
          role="group"
          aria-label={`${labels.transactionsInApp} - ${walletTransactions.length} transactions`}
        >
          <button
            type="button"
            className={standardButtonClasses}
            onClick={handleViewTransactions}
            aria-describedby="transaction-count"
            data-testid="view-transactions-button"
          >
            {labels.viewTransactions}

            <span id="transaction-count" className="sr-only">
              {walletTransactions.length} transactions available
              {hasPendingTransactions && `, ${labels.transactionLoading}`}
            </span>
          </button>

          {/* Pending Transactions Indicator */}
          <AnimatePresence>
            {hasPendingTransactions && (
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="block absolute left-[110%] w-4 h-4"
                role="status"
                aria-label={labels.transactionLoading}
              >
                <span className="block Toastify__spinner" aria-hidden="true" />
                <span className="sr-only">{labels.transactionLoading}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* No Transactions State - Hidden but accessible for screen readers */}
      {walletTransactions.length === 0 && (
        <div className="sr-only" role="status" aria-live="polite">
          No transactions found for this wallet
        </div>
      )}
    </div>
  );
}
