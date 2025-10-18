import { standardButtonClasses } from '@tuwaio/nova-core';
import { getAdapterFromWalletType } from '@tuwaio/orbit-core';
import { motion } from 'framer-motion';
import { useCallback, useMemo } from 'react';

import { useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { ConnectButtonProps } from '../ConnectButton';

/**
 * Props for the ConnectedModalFooter component
 */
interface ConnectedModalFooterProps extends Pick<ConnectButtonProps, 'store'> {
  /** Callback to control modal visibility */
  setIsOpen: (isOpen: boolean) => void;
}

/**
 * Footer component for the ConnectedModal that provides wallet control actions
 *
 * This component displays the main action buttons for wallet management:
 * - Disconnect button with animated icon
 * - View on explorer link with external indicator
 *
 * The footer provides full WCAG compliance with proper ARIA labels,
 * keyboard navigation support, and semantic HTML structure.
 *
 * @param props - Component props containing modal control functions
 * @returns JSX element representing the modal footer with action buttons
 *
 * @example
 * ```tsx
 * <ConnectedModalFooter
 *   setIsOpen={(open) => setModalOpen(open)}
 * />
 * ```
 *
 * @public
 */
export function ConnectedModalFooter({ setIsOpen, store }: ConnectedModalFooterProps) {
  // Get localized labels for UI text
  const labels = useNovaConnectLabels();
  const { activeWallet } = useNovaConnect();

  // Get wallet state and actions from store
  const getAdapter = store.getState().getAdapter;
  const disconnect = store.getState().disconnect;

  /**
   * Handle wallet disconnection
   * Disconnects the wallet and closes the modal
   */
  const handleDisconnect = useCallback(() => {
    disconnect();
    setIsOpen(false);
  }, [disconnect, setIsOpen]);

  /**
   * Generate explorer URL for the current wallet address
   * Memoized to prevent unnecessary recalculations
   */
  const explorerUrl = useMemo(() => {
    if (!activeWallet) return '#';

    try {
      const adapter = getAdapter(getAdapterFromWalletType(activeWallet.walletType));
      return adapter?.getExplorerUrl(`/address/${activeWallet.address}`, activeWallet.chainId) || '#';
    } catch (error) {
      console.warn('Failed to generate explorer URL:', error);
      return '#';
    }
  }, [activeWallet, getAdapter]);

  /**
   * Check if explorer URL is valid for link functionality
   */
  const isValidExplorerUrl = useMemo(() => explorerUrl !== '#', [explorerUrl]);

  // Early return if no active wallet
  if (!activeWallet) return null;

  return (
    <footer
      className="flex flex-wrap gap-4 w-full items-center justify-between border-t border-[var(--tuwa-border-primary)] p-4 flex-col-reverse sm:flex-row"
      role="contentinfo"
      aria-label={labels.walletControls}
    >
      {/* Disconnect Button */}
      <button
        type="button"
        className={standardButtonClasses}
        onClick={handleDisconnect}
        aria-describedby="disconnect-description"
        data-testid="disconnect-button"
      >
        {/* Animated disconnect icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5"
          aria-hidden="true"
        >
          <motion.path
            d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
            strokeLinecap="round"
            strokeLinejoin="round"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 1 },
            }}
            initial="hidden"
            animate="visible"
            transition={{
              duration: 0.5,
              ease: 'easeInOut',
            }}
          />
        </svg>

        {/* Button text with screen reader description */}
        <span id="disconnect-description" className="sr-only">
          {labels.disconnect} wallet and close modal
        </span>
        {labels.disconnect}
      </button>

      {/* View on Explorer Link */}
      {isValidExplorerUrl ? (
        <a
          href={explorerUrl}
          className={standardButtonClasses}
          target="_blank"
          rel="noopener noreferrer"
          aria-describedby="explorer-description"
          data-testid="explorer-link"
        >
          <span className="flex items-center gap-2">
            {labels.viewOnExplorer}

            {/* External link icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <motion.path
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                strokeLinecap="round"
                strokeLinejoin="round"
                variants={{
                  hidden: { pathLength: 0, opacity: 0 },
                  visible: { pathLength: 1, opacity: 1 },
                }}
                initial="hidden"
                animate="visible"
                transition={{
                  duration: 0.5,
                  ease: 'easeInOut',
                }}
              />
            </svg>
          </span>

          {/* Screen reader description for external link */}
          <span id="explorer-description" className="sr-only">
            Opens in new tab - View wallet address {activeWallet.address} on blockchain explorer
          </span>
        </a>
      ) : (
        /* Disabled state when explorer URL is not available */
        <button
          type="button"
          className={`${standardButtonClasses} opacity-50 cursor-not-allowed`}
          disabled
          aria-describedby="explorer-unavailable"
          title="Explorer not available for this network"
        >
          <span className="flex items-center gap-2">
            {labels.viewOnExplorer}

            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4"
              aria-hidden="true"
            >
              <path
                d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span id="explorer-unavailable" className="sr-only">
            Blockchain explorer is not available for this network
          </span>
        </button>
      )}
    </footer>
  );
}
