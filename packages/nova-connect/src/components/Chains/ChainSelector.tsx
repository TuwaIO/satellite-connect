import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { getChainName } from '@bgd-labs/react-web3-icons/dist/utils';
import * as Select from '@radix-ui/react-select';
import {
  ChevronArrowWithAnim,
  CloseIcon,
  cn,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@tuwaio/nova-core';
import { formatWalletChainId } from '@tuwaio/orbit-core';
import { getAdapterFromWalletType } from '@tuwaio/orbit-core';
import { motion } from 'framer-motion';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { InitialChains } from '../../types';
import { getChainsListByWalletType, getChainsListByWalletTypeAsync, getWalletChains } from '../../utils';
import { ConnectButtonProps } from '../ConnectButton';
import { SelectContentAnimated } from '../SelectContentAnimated';
import { ChainListRenderer } from './ChainListRenderer';
import { ScrollableChainList } from './ScrollableChainList';

/**
 * Props for the ChainTriggerButton component
 *
 * @interface ChainTriggerButtonProps
 * @since 1.0.0
 */
interface ChainTriggerButtonProps {
  /** The currently formatted chain identifier */
  currentFormattedChainId: string | number;
  /** The select component value */
  selectValue: string;
  /** Whether the chains list is currently open */
  isChainsListOpen: boolean;
  /** Function to toggle the chains list visibility */
  onToggle: () => void;
  /** Whether this is being rendered on mobile */
  isMobile: boolean;
}

/**
 * ChainTriggerButton - Interactive button that triggers chain selection
 *
 * This component renders the main trigger button for the chain selector,
 * adapting its behavior for mobile and desktop interfaces. It provides
 * proper accessibility support and visual feedback.
 *
 * Features:
 * - Responsive design for mobile/desktop
 * - Keyboard navigation support
 * - Accessibility labels and ARIA attributes
 * - Visual state indicators (open/closed)
 * - Smooth animations and transitions
 *
 * @param currentFormattedChainId - Current chain identifier to display
 * @param isChainsListOpen - Whether the selector is currently open
 * @param onToggle - Function to handle open/close toggle
 * @param isMobile - Whether to render mobile-optimized version
 * @returns JSX element representing the trigger button
 *
 * @since 1.0.0
 */
const ChainTriggerButton: React.FC<ChainTriggerButtonProps> = ({
  currentFormattedChainId,
  isChainsListOpen,
  onToggle,
  isMobile,
}) => {
  const labels = useNovaConnectLabels();
  const chainName = getChainName(currentFormattedChainId);

  /**
   * Handles keyboard navigation for the trigger button
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onToggle();
      }
      if (event.key === 'Escape' && isChainsListOpen) {
        event.preventDefault();
        onToggle();
      }
    },
    [onToggle, isChainsListOpen],
  );

  /**
   * Inner content shared between mobile and desktop versions
   */
  const innerContent = useMemo(
    () => (
      <motion.div
        layout
        className="inline-flex items-center justify-center gap-2 px-2 sm:px-4 min-w-[60px] min-h-[42px] py-1"
        transition={{ layout: { duration: 0.0001 } }}
      >
        <div className="flex items-center sm:space-x-2 [&_img]:w-6 [&_img]:h-6">
          <div aria-hidden="true">
            <Web3Icon chainId={currentFormattedChainId} />
          </div>
          {isMobile ? (
            <span className="hidden sm:inline-block sr-only sm:not-sr-only">{chainName}</span>
          ) : (
            <Select.Value asChild>
              <span className="hidden sm:inline-block sr-only sm:not-sr-only">{chainName}</span>
            </Select.Value>
          )}
        </div>

        {isMobile ? (
          <div aria-hidden="true">
            <ChevronArrowWithAnim isOpen={isChainsListOpen} />
          </div>
        ) : (
          <Select.Icon asChild>
            <div aria-hidden="true">
              <ChevronArrowWithAnim isOpen={isChainsListOpen} />
            </div>
          </Select.Icon>
        )}
      </motion.div>
    ),
    [currentFormattedChainId, chainName, isChainsListOpen, isMobile],
  );

  /**
   * Button styling classes with conditional states
   */
  const buttonClasses = cn(
    'cursor-pointer inline-flex items-center justify-center',
    'rounded-xl font-medium text-sm transition-all duration-200',
    'hover:scale-[1.02] active:scale-[0.98]',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--tuwa-bg-primary)] focus:ring-[var(--tuwa-border-primary)]',
    'bg-[var(--tuwa-bg-secondary)] text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-bg-muted)]',
    {
      'ring-2 ring-[var(--tuwa-text-accent)] border border-transparent': isChainsListOpen,
      'border border-[var(--tuwa-border-primary)]': !isChainsListOpen,
    },
    '[&_img]:w-4 [&_img]:h-4',
  );

  /**
   * Accessibility attributes for screen readers
   */
  const ariaLabel = `${labels.chainSelector}: ${labels.currentChain} ${chainName}. ${labels.openChainSelector}`;
  const ariaExpanded = isChainsListOpen;
  const ariaHaspopup = 'listbox' as const;

  return (
    <motion.div layout className="relative" transition={{ layout: { duration: 0.2, ease: [0.4, 1, 0.4, 1] } }}>
      {isMobile ? (
        <button
          type="button"
          aria-label={ariaLabel}
          aria-expanded={ariaExpanded}
          aria-haspopup={ariaHaspopup}
          className={buttonClasses}
          onClick={onToggle}
          onKeyDown={handleKeyDown}
        >
          {innerContent}
        </button>
      ) : (
        <Select.Trigger aria-label={ariaLabel} className={buttonClasses} onKeyDown={handleKeyDown}>
          {innerContent}
        </Select.Trigger>
      )}
    </motion.div>
  );
};

/**
 * ChainSelector - Main component for blockchain network selection
 *
 * This component provides a comprehensive interface for users to select between
 * different blockchain networks. It automatically detects available chains from
 * wallet configuration and renders an appropriate selector interface.
 *
 * Key features:
 * - Automatic chain detection from wallet type and configuration
 * - Responsive design with separate mobile/desktop interfaces
 * - Asynchronous chain loading with fallback to synchronous operation
 * - Single chain optimization (no selector needed for one chain)
 * - Full accessibility support with screen reader compatibility
 * - Integration with wallet switching functionality
 * - Error handling and loading states
 *
 * Architecture:
 * - Uses dynamic imports for better performance
 * - Supports both sync and async chain resolution
 * - Provides fallback behavior when adapters fail
 * - Integrates with existing store and state management
 *
 * Visual behavior:
 * - Desktop: Dropdown select with animated content
 * - Mobile: Modal dialog with scrollable list
 * - Single chain: Simple display with icon and name
 * - Multiple chains: Full selector with network switching
 *
 * @param appChains - Configuration for supported blockchain networks
 * @param solanaRPCUrls - RPC URLs configuration for Solana network
 * @param store - State management store for wallet operations
 * @returns JSX element representing the chain selector or null if no wallet
 *
 * @example
 * ```tsx
 * <ChainSelector
 *   appChains={[
 *     { id: 1, name: 'Ethereum' },
 *     { id: 137, name: 'Polygon' }
 *   ]}
 *   solanaRPCUrls={{
 *     'mainnet-beta': 'https://api.mainnet-beta.solana.com'
 *   }}
 *   store={walletStore}
 * />
 * ```
 *
 * @public
 * @since 1.0.0
 */
export function ChainSelector({ appChains, solanaRPCUrls, store }: InitialChains & Pick<ConnectButtonProps, 'store'>) {
  const labels = useNovaConnectLabels();
  const { activeWallet } = useNovaConnect();
  const { isChainsListOpen, setIsChainsListOpen, isChainsListOpenMobile, setIsChainsListOpenMobile } = useNovaConnect();

  // State for managing dynamic chain loading
  const [chainsList, setChainsList] = useState<(string | number)[]>([]);
  const [isLoadingChains, setIsLoadingChains] = useState(false);

  // Use ref to track loading state and prevent concurrent loads
  const loadingRef = useRef(false);
  const walletTypeRef = useRef<string | null>(null);

  /**
   * Handles network switching when user selects a different chain
   */
  const handleChainChange = useCallback(
    (newChainId: string) => {
      store?.getState().switchNetwork(newChainId);
    },
    [store],
  );

  /**
   * Gets chain formatting data for display purposes
   */
  const getChainData = useCallback(
    (chain: string | number) => {
      if (!activeWallet) return { formattedChainId: chain, chain };

      return {
        formattedChainId: formatWalletChainId(chain, getAdapterFromWalletType(activeWallet.walletType)),
        chain,
      };
    },
    [activeWallet],
  );

  /**
   * Load chains list dynamically with async support and fallback
   * Fixed to prevent infinite re-renders by using refs and proper dependency management
   */
  useEffect(() => {
    // Reset state when wallet changes
    if (!activeWallet) {
      setChainsList([]);
      setIsLoadingChains(false);
      loadingRef.current = false;
      walletTypeRef.current = null;
      return;
    }

    // Don't load if same wallet type and already loading/loaded
    if (walletTypeRef.current === activeWallet.walletType && (loadingRef.current || chainsList.length > 0)) {
      return;
    }

    // Set up loading state
    if (loadingRef.current) return;
    loadingRef.current = true;
    walletTypeRef.current = activeWallet.walletType;
    setIsLoadingChains(true);

    // Safely extract wallet chains using shared utility
    const walletChains = getWalletChains(activeWallet);

    const loadChains = async () => {
      try {
        // Try async version first for better functionality
        const asyncChains = await getChainsListByWalletTypeAsync({
          walletType: activeWallet.walletType,
          appChains,
          solanaRPCUrls,
          chains: walletChains,
        });

        if (asyncChains.length > 0) {
          setChainsList(asyncChains);
          return;
        }
      } catch (asyncError) {
        console.warn('Async chain loading failed, falling back to sync method:', asyncError);
      }

      // Fallback to synchronous version
      try {
        const syncChains = getChainsListByWalletType({
          walletType: activeWallet.walletType,
          appChains,
          solanaRPCUrls,
          chains: walletChains,
        });

        setChainsList(syncChains);
      } catch (syncError) {
        console.error('Both async and sync chain loading failed:', syncError);
        setChainsList([]); // Ensure we have a valid array
      } finally {
        setIsLoadingChains(false);
        loadingRef.current = false;
      }
    };

    loadChains();
  }, [activeWallet, appChains, solanaRPCUrls, chainsList.length]);

  /**
   * Memoized loading state check
   */
  const isLoading = useMemo(() => isLoadingChains && chainsList.length === 0, [isLoadingChains, chainsList.length]);

  // Early return if no wallet is connected
  if (!activeWallet) return null;

  // Current chain information
  const currentFormattedChainId = formatWalletChainId(
    activeWallet.chainId,
    getAdapterFromWalletType(activeWallet.walletType),
  );

  const selectValue = String(currentFormattedChainId);
  const chainName = getChainName(currentFormattedChainId);

  // Show loading state while chains are being fetched
  if (isLoading) {
    return (
      <div
        className="flex items-center space-x-2 [&_img]:w-6 [&_img]:h-6 animate-pulse"
        role="status"
        aria-label={`${labels.loading}...`}
      >
        <div className="w-6 h-6 bg-gray-300 rounded-full" aria-hidden="true" />
        <div className="w-20 h-4 bg-gray-300 rounded" aria-hidden="true" />
      </div>
    );
  }

  // Single chain display - no selector needed
  if (chainsList.length <= 1) {
    return (
      <div
        className="flex items-center space-x-2 [&_img]:w-6 [&_img]:h-6"
        role="img"
        aria-label={`${labels.currentChain}: ${chainName}`}
      >
        <Web3Icon chainId={currentFormattedChainId} />
        <span className="sr-only">{chainName}</span>
      </div>
    );
  }

  // Main selector interface for multiple chains
  return (
    <div role="region" aria-label={labels.chainSelector}>
      {/* Desktop View - Dropdown Select */}
      <div className="hidden sm:block">
        <Select.Root
          value={selectValue}
          onValueChange={handleChainChange}
          open={isChainsListOpen}
          onOpenChange={setIsChainsListOpen}
        >
          <ChainTriggerButton
            currentFormattedChainId={currentFormattedChainId}
            isChainsListOpen={isChainsListOpen}
            onToggle={() => setIsChainsListOpen(!isChainsListOpen)}
            selectValue={selectValue}
            isMobile={false}
          />
          <SelectContentAnimated className="w-[210px]">
            <ChainListRenderer
              chainsList={chainsList}
              selectValue={selectValue}
              handleValueChange={handleChainChange}
              getChainData={getChainData}
              onClose={() => setIsChainsListOpen(false)}
              isMobile={false}
            />
          </SelectContentAnimated>
        </Select.Root>
      </div>

      {/* Mobile View - Modal Dialog */}
      <div className="sm:hidden">
        <ChainTriggerButton
          currentFormattedChainId={currentFormattedChainId}
          isChainsListOpen={isChainsListOpenMobile}
          onToggle={() => setIsChainsListOpenMobile(true)}
          selectValue={selectValue}
          isMobile={true}
        />

        <Dialog open={isChainsListOpenMobile} onOpenChange={setIsChainsListOpenMobile}>
          <DialogContent className={cn('w-full sm:max-w-md')} aria-describedby="chain-selector-description">
            <div className={cn('relative flex w-full flex-col')}>
              <DialogHeader>
                <DialogTitle id="chain-selector-title">{labels.switchNetworks}</DialogTitle>
                <DialogClose asChild>
                  <button
                    type="button"
                    aria-label={labels.closeModal}
                    className="cursor-pointer rounded-full p-1
                     text-[var(--tuwa-text-tertiary)] transition-colors
                     hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-primary)]
                     focus:outline-none focus:ring-2 focus:ring-[var(--tuwa-border-primary)] focus:ring-offset-2"
                  >
                    <CloseIcon />
                  </button>
                </DialogClose>
              </DialogHeader>

              <div id="chain-selector-description" className="sr-only">
                {labels.selectChain}
              </div>

              <ScrollableChainList
                chainsList={chainsList}
                selectValue={selectValue}
                handleValueChange={handleChainChange}
                getChainData={getChainData}
                onClose={() => setIsChainsListOpenMobile(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
