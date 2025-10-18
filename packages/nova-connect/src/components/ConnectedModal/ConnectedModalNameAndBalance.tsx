import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/solid';
import { cn, useCopyToClipboard } from '@tuwaio/nova-core';
import { AnimatePresence, motion } from 'framer-motion';

import { useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { ConnectedModalMainContentProps } from './ConnectedModalMainContent';

/**
 * Component that displays wallet name/ENS and balance information with copy functionality
 *
 * This component provides a comprehensive display of wallet identification and balance:
 * - ENS name or abbreviated wallet address
 * - Animated copy button with visual feedback
 * - Loading states for balance information
 * - Proper accessibility support with ARIA labels
 * - Smooth animations for state transitions
 *
 * The component automatically handles wallet address copying with visual feedback
 * and provides screen reader friendly content throughout all interactions.
 *
 * @returns JSX element displaying wallet name and balance with copy functionality
 *
 * @example
 * ```tsx
 * <ConnectedModalNameAndBalance />
 * ```
 *
 * @public
 */
export function ConnectedModalNameAndBalance({
  ensNameAbbreviated,
  balanceLoading,
  balance,
}: Pick<ConnectedModalMainContentProps, 'balanceLoading' | 'ensNameAbbreviated' | 'balance'>) {
  const labels = useNovaConnectLabels();
  const { activeWallet } = useNovaConnect();

  const { copy, isCopied } = useCopyToClipboard();

  /**
   * Handle copying wallet address with proper error handling
   */
  const handleCopyAddress = async () => {
    if (!activeWallet?.address) {
      console.warn('No wallet address available to copy');
      return;
    }

    try {
      await copy(activeWallet.address);
    } catch (error) {
      console.error('Failed to copy wallet address:', error);
    }
  };

  /**
   * Handle keyboard interaction for copy button
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleCopyAddress();
    }
  };

  /**
   * Generate copy button classes based on current state
   */
  const getCopyButtonClasses = () => {
    return cn(
      'cursor-pointer flex items-center justify-center text-sm transition-all duration-200 absolute right-[-40px]',
      'rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--tuwa-text-accent)] focus:ring-opacity-50',
      'hover:scale-110 active:scale-95',
      isCopied
        ? [
            'text-[var(--tuwa-success-text)]',
            'hover:text-[var(--tuwa-success-text)]',
            'bg-[var(--tuwa-success-text)] bg-opacity-10',
          ]
        : [
            'text-[var(--tuwa-text-tertiary)]',
            'hover:text-[var(--tuwa-text-primary)]',
            'hover:bg-[var(--tuwa-bg-muted)]',
          ],
    );
  };

  /**
   * Generate aria label for copy button based on current state
   */
  const getCopyButtonAriaLabel = () => {
    const baseLabel = isCopied ? labels.copied : `Copy ${labels.walletAddress}`;
    const addressInfo = activeWallet?.address ? ` (${activeWallet.address})` : '';
    return `${baseLabel}${addressInfo}`;
  };

  /**
   * Format balance display text
   */
  const getBalanceDisplay = () => {
    if (!balance?.value || !balance?.symbol) return null;
    return `${balance.value} ${balance.symbol}`;
  };

  // Early return if no active wallet
  if (!activeWallet) return null;

  const balanceDisplay = getBalanceDisplay();

  return (
    <section
      className="flex w-full flex-col items-center justify-start gap-2 min-h-[60px]"
      role="region"
      aria-label={`${labels.walletBalance} and ${labels.walletAddress} information`}
    >
      {/* Wallet Name/ENS and Copy Button */}
      <div
        className="flex items-center gap-3 relative text-[var(--tuwa-text-primary)]"
        role="group"
        aria-label={`${labels.walletAddress}: ${ensNameAbbreviated || 'Loading...'}`}
      >
        {/* Wallet Name/ENS Display */}
        <h3
          className="text-xl font-bold"
          role="heading"
          aria-level={3}
          aria-label={`Wallet name: ${ensNameAbbreviated || 'Loading wallet name'}`}
        >
          {ensNameAbbreviated}
        </h3>

        {/* Copy Address Button */}
        <button
          type="button"
          onClick={handleCopyAddress}
          onKeyDown={handleKeyDown}
          className={getCopyButtonClasses()}
          aria-label={getCopyButtonAriaLabel()}
          aria-describedby="copy-feedback"
          disabled={!activeWallet?.address}
          data-testid="copy-address-button"
        >
          {/* Animated Icon Transition */}
          <AnimatePresence mode="wait" initial={false}>
            {isCopied ? (
              <motion.div
                key="check-icon"
                initial={{ scale: 0.6, opacity: 0, rotate: -90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.6, opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <CheckIcon className="w-5 h-5" aria-hidden="true" />
              </motion.div>
            ) : (
              <motion.div
                key="copy-icon"
                initial={{ scale: 0.6, opacity: 0, rotate: 90 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                exit={{ scale: 0.6, opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
              >
                <DocumentDuplicateIcon className="w-5 h-5" aria-hidden="true" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Screen Reader Only Feedback */}
          <span id="copy-feedback" className="sr-only" aria-live="polite" role="status">
            {isCopied ? `${labels.copied} ${activeWallet.address}` : ''}
          </span>
        </button>
      </div>

      {/* Balance Information */}
      <div className="flex items-center justify-center" role="group" aria-label={labels.walletBalance}>
        {balanceLoading ? (
          /* Balance Loading State */
          <div
            className="animate-pulse rounded-xl h-5 w-24 bg-[var(--tuwa-bg-muted)]"
            role="status"
            aria-label={labels.loading}
          >
            <span className="sr-only">
              {labels.loading} {labels.walletBalance}
            </span>
          </div>
        ) : balanceDisplay ? (
          /* Balance Display */
          <p
            className="flex items-center gap-1 text-sm text-[var(--tuwa-text-tertiary)]"
            role="text"
            aria-label={`${labels.walletBalance}: ${balanceDisplay}`}
          >
            <span aria-hidden="true">{balance?.value}</span>
            <span aria-hidden="true">{balance?.symbol}</span>

            {/* Screen reader friendly version */}
            <span className="sr-only">
              {labels.walletBalance}: {balanceDisplay}
            </span>
          </p>
        ) : (
          /* No Balance State */
          <p
            className="text-sm text-[var(--tuwa-text-tertiary)] opacity-75"
            role="text"
            aria-label="No balance information available"
          >
            <span aria-hidden="true">—</span>
            <span className="sr-only">No balance information available</span>
          </p>
        )}
      </div>

      {/* Hidden Live Region for Dynamic Updates */}
      <div className="sr-only" aria-live="polite" aria-atomic="true" role="status">
        {/* This will announce balance updates to screen readers */}
        {!balanceLoading && balanceDisplay && `Balance updated: ${balanceDisplay}`}
      </div>
    </section>
  );
}
