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
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { motion } from 'framer-motion';
import React from 'react';

import { useNovaConnect } from '../../hooks/useNovaConnect';
import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { InitialChains } from '../../types';
import { getChainsListByWalletType } from '../../utils/getChainsListByWalletType';
import { ChainListRenderer } from '../Chains/ChainListRenderer';
import { SelectContentAnimated } from '../SelectContentAnimated';
import { ScrollableChainList } from './ScrollableChainList';

interface ChainTriggerButtonProps {
  currentFormattedChainId: string | number;
  selectValue: string;
  isChainsListOpen: boolean;
  onToggle: () => void;
  isMobile: boolean;
}

const ChainTriggerButton: React.FC<ChainTriggerButtonProps> = ({
  currentFormattedChainId,
  isChainsListOpen,
  onToggle,
  isMobile,
}) => {
  const labels = useNovaConnectLabels();
  const chainName = getChainName(currentFormattedChainId);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onToggle();
    }
    if (event.key === 'Escape' && isChainsListOpen) {
      event.preventDefault();
      onToggle();
    }
  };

  const innerContent = (
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
  );

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

export function ChainSelector({ appChains, solanaRPCUrls }: InitialChains) {
  const labels = useNovaConnectLabels();
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);

  const {
    handleChainChange,
    isChainsListOpen,
    setIsChainsListOpen,
    isChainsListOpenMobile,
    setIsChainsListOpenMobile,
  } = useNovaConnect();

  if (!activeWallet) return null;

  const chainsList = getChainsListByWalletType({
    walletType: activeWallet.walletType,
    appChains,
    solanaRPCUrls,
    chains: 'connectedWallet' in activeWallet ? activeWallet?.connectedWallet?.chains : undefined,
  });

  const currentFormattedChainId = formatWalletChainId(
    activeWallet.chainId,
    getAdapterFromWalletType(activeWallet.walletType),
  );

  const getChainData = (chain: string | number) => ({
    formattedChainId: formatWalletChainId(chain, getAdapterFromWalletType(activeWallet.walletType)),
    chain,
  });

  const selectValue = String(currentFormattedChainId);
  const chainName = getChainName(currentFormattedChainId);

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

  return (
    <div role="region" aria-label={labels.chainSelector}>
      {/* Desktop View */}
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

      {/* Mobile View */}
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
