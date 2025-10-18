import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { CloseIcon, cn, Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@tuwaio/nova-core';
import { formatWalletChainId, getAdapterFromWalletType, OrbitAdapter } from '@tuwaio/orbit-core';
import { motion } from 'framer-motion';
import { useEffect, useMemo } from 'react';

import { useGetWalletNameAndAvatar, useWalletNativeBalance } from '../../hooks';
import { useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { getChainsListByWalletType, getWalletChains } from '../../utils';
import { ScrollableChainList } from '../Chains/ScrollableChainList';
import { ConnectButtonProps } from '../ConnectButton';
import { ConnectedModalFooter } from './ConnectedModalFooter';
import { ConnectedModalMainContent } from './ConnectedModalMainContent';
import { ConnectedModalTxHistory } from './ConnectedModalTxHistory';

/**
 * Props for the ConnectedModal component
 */
interface ConnectedModalProps extends Omit<ConnectButtonProps, 'className'> {
  className?: string;
}

/**
 * Modal component that displays wallet connection status and provides access to wallet controls
 *
 * This modal serves as the main interface for connected wallet management, offering:
 * - Wallet connection status and information
 * - Network switching capabilities
 * - Transaction history viewing
 * - Wallet disconnection controls
 *
 * The modal adapts its content based on the current view state and provides
 * full WCAG compliance with proper ARIA labels and keyboard navigation support.
 *
 * @param props - Component props including chain configurations and adapters
 * @returns JSX element representing the connected wallet modal
 *
 * @example
 * ```tsx
 * <ConnectedModal
 *   solanaRPCUrls={solanaConfig}
 *   transactionPool={txPool}
 *   pulsarAdapter={adapter}
 *   appChains={chainConfig}
 * />
 * ```
 *
 * @public
 */
export function ConnectedModal({
  solanaRPCUrls,
  transactionPool,
  pulsarAdapter,
  appChains,
  className,
  store,
}: ConnectedModalProps) {
  // Get localized labels for UI text
  const labels = useNovaConnectLabels();

  // Get modal state and controls from hook
  const {
    setConnectedModalContentType,
    isConnectedModalOpen,
    setIsConnectedModalOpen,
    connectedModalContentType,
    activeWallet,
  } = useNovaConnect();

  const {
    ensAvatar,
    ensNameAbbreviated,
    isLoading: avatarIsLoading,
  } = useGetWalletNameAndAvatar({
    store,
    abbreviateSymbols: 6,
    maxNameLength: 30,
    autoRetry: false,
    retryDelay: 3000,
  });

  const { balance, isLoading: balanceLoading } = useWalletNativeBalance({ store });

  const handleChainChange = (newChainId: string) => {
    store?.getState().switchNetwork(newChainId);
  };

  /**
   * Reset modal content to main view when modal opens
   * This ensures consistent initial state every time the modal is opened
   */
  useEffect(() => {
    if (isConnectedModalOpen) {
      setConnectedModalContentType('main');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnectedModalOpen]);

  /**
   * Memoized chains list to prevent unnecessary recalculations
   * Only recalculates when wallet type or configuration changes
   */
  const chainsList = useMemo(() => {
    // Safely extract wallet chains using shared utility
    const walletChains = getWalletChains(activeWallet);

    return getChainsListByWalletType({
      // @ts-expect-error - TODO: typing issue with activeWallet
      walletType: activeWallet?.walletType ?? `${OrbitAdapter.EVM}:not-connected`,
      appChains,
      solanaRPCUrls,
      chains: walletChains,
    });
    // @ts-expect-error - TODO: typing issue with activeWallet
  }, [activeWallet?.walletType, activeWallet, appChains, solanaRPCUrls]);

  // Early return if no active wallet - prevents rendering empty modal
  if (!activeWallet) return null;

  /**
   * Helper function to format chain data for display and selection
   * @param chain - Chain identifier (string or number)
   * @returns Object with formatted chain ID and original chain value
   */
  const getChainData = (chain: string | number) => ({
    // @ts-expect-error - TODO: typing issue with activeWallet
    formattedChainId: formatWalletChainId(chain, getAdapterFromWalletType(activeWallet.walletType)),
    chain,
  });

  /**
   * Get localized title based on current modal content type
   * @returns Appropriate title string from labels
   */
  const getTitle = (): string => {
    switch (connectedModalContentType) {
      case 'transactions':
        return labels.transactionsInApp;
      case 'chains':
        return labels.switchNetwork;
      default:
        return labels.connected;
    }
  };

  /**
   * Navigate back to main modal content
   * Used by back button in sub-views
   */
  const handleBackToMain = () => {
    setConnectedModalContentType('main');
  };

  /**
   * Close the entire modal
   * Resets state and closes modal dialog
   */
  const handleCloseModal = () => {
    setIsConnectedModalOpen(false);
  };

  /**
   * Render appropriate content based on current modal state
   * @returns JSX element for the current view
   */
  const renderMainContent = () => {
    switch (connectedModalContentType) {
      case 'main':
        return (
          <ConnectedModalMainContent
            balance={balance}
            ensNameAbbreviated={ensNameAbbreviated}
            avatarIsLoading={avatarIsLoading}
            balanceLoading={balanceLoading}
            store={store}
            ensAvatar={ensAvatar}
            chainsList={chainsList}
            transactionPool={transactionPool}
          />
        );
      case 'transactions':
        return <ConnectedModalTxHistory transactionPool={transactionPool} pulsarAdapter={pulsarAdapter} />;
      case 'chains':
        return (
          <ScrollableChainList
            chainsList={chainsList}
            selectValue={String(
              // @ts-expect-error - TODO: typing issue with activeWallet
              formatWalletChainId(activeWallet.chainId, getAdapterFromWalletType(activeWallet.walletType)),
            )}
            handleValueChange={handleChainChange}
            getChainData={getChainData}
            onClose={handleBackToMain}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isConnectedModalOpen} onOpenChange={(open) => setIsConnectedModalOpen(open)}>
      <DialogContent className={cn('w-full sm:max-w-md', className)} role="dialog" aria-modal="true">
        <motion.div
          layout
          transition={{
            layout: {
              duration: 0.0001,
            },
          }}
        >
          <div className={cn('relative flex w-full flex-col')}>
            {/* Modal header with navigation and close controls */}
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center justify-between gap-2">
                  {/* Back button - only visible in sub-views */}
                  {connectedModalContentType !== 'main' && (
                    <button
                      type="button"
                      onClick={handleBackToMain}
                      aria-label={labels.back}
                      className={cn(
                        'cursor-pointer rounded-full p-1',
                        'text-[var(--tuwa-text-tertiary)] transition-colors',
                        'hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-primary)]',
                        // Focus styles for keyboard navigation
                        'focus:outline-none focus:ring-2 focus:ring-[var(--tuwa-border-primary)]',
                      )}
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                  )}

                  {/* Dynamic title based on current view */}
                  <span className="flex-1 text-center font-semibold">{getTitle()}</span>
                </div>
              </DialogTitle>

              {/* Close button - always visible */}
              <DialogClose asChild>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  aria-label={labels.closeModal}
                  className={cn(
                    'cursor-pointer rounded-full p-1',
                    'text-[var(--tuwa-text-tertiary)] transition-colors',
                    'hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-primary)]',
                    // Focus styles for keyboard navigation
                    'focus:outline-none focus:ring-2 focus:ring-[var(--tuwa-border-primary)]',
                  )}
                >
                  <CloseIcon />
                </button>
              </DialogClose>
            </DialogHeader>

            {/* Main content area - changes based on current view */}
            <main className="relative" id="connected-modal-description" aria-live="polite" aria-atomic="true">
              {renderMainContent()}
            </main>

            {/* Footer with additional controls */}
            <ConnectedModalFooter store={store} setIsOpen={setIsConnectedModalOpen} />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
