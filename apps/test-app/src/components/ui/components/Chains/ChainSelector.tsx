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
import { SolanaWallet } from '@tuwaio/satellite-solana';
import { motion } from 'framer-motion';

import { useNovaConnect } from '../../hooks/useNovaConnect';
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
  const innerContent = (
    <motion.div
      layout
      className="inline-flex items-center justify-center gap-2 px-2 sm:px-4 min-w-[60px] min-h-[42px] py-1"
      transition={{ layout: { duration: 0.0001 } }}
    >
      <div className="block items-center sm:flex sm:space-x-2 [&_img]:w-6 [&_img]:h-6">
        <Web3Icon chainId={currentFormattedChainId} />
        {isMobile ? (
          <span className="hidden sm:inline-block">{getChainName(currentFormattedChainId)}</span>
        ) : (
          <Select.Value asChild>
            <span className="hidden sm:inline-block">{getChainName(currentFormattedChainId)}</span>
          </Select.Value>
        )}
      </div>

      {isMobile ? (
        <ChevronArrowWithAnim isOpen={isChainsListOpen} />
      ) : (
        <Select.Icon asChild>
          <ChevronArrowWithAnim isOpen={isChainsListOpen} />
        </Select.Icon>
      )}
    </motion.div>
  );

  const buttonClasses = cn(
    'cursor-pointer inline-flex items-center justify-center',
    'rounded-xl font-medium text-sm transition-all duration-200',
    'hover:scale-[1.02] active:scale-[0.98]',
    'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--tuwa-bg-primary)]',
    'bg-[var(--tuwa-bg-secondary)] text-[var(--tuwa-text-primary)] hover:bg-[var(--tuwa-bg-muted)]',
    {
      'ring-2 ring-[var(--tuwa-text-accent)] border border-transparent': isChainsListOpen,
      'border border-[var(--tuwa-border-primary)]': !isChainsListOpen,
    },
    '[&_img]:w-4 [&_img]:h-4',
  );

  return (
    <motion.div
      layout
      onClick={onToggle}
      className="relative"
      transition={{ layout: { duration: 0.2, ease: [0.4, 1, 0.4, 1] } }}
    >
      {isMobile ? (
        <button type="button" aria-label="Chain Selector" className={buttonClasses}>
          {innerContent}
        </button>
      ) : (
        <Select.Trigger aria-label="Chain Selector" className={buttonClasses}>
          {innerContent}
        </Select.Trigger>
      )}
    </motion.div>
  );
};

export function ChainSelector({ appChains, solanaRPCUrls }: InitialChains) {
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
    chains: (activeWallet as SolanaWallet)?.connectedWallet?.chains,
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

  return (
    <div>
      {chainsList.length > 1 ? (
        <>
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
              <DialogContent className={cn('w-full sm:max-w-md')}>
                <div className={cn('relative flex w-full flex-col')}>
                  <DialogHeader>
                    <DialogTitle>Switch Networks</DialogTitle>
                    <DialogClose asChild>
                      <button
                        type="button"
                        aria-label="Close modal"
                        className="cursor-pointer rounded-full p-1
                     text-[var(--tuwa-text-tertiary)] transition-colors
                     hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-primary)]"
                      >
                        <CloseIcon />
                      </button>
                    </DialogClose>
                  </DialogHeader>

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
        </>
      ) : (
        <div className="block items-center sm:flex sm:space-x-2 [&_img]:w-6 [&_img]:h-6">
          <Web3Icon chainId={currentFormattedChainId} />
        </div>
      )}
    </div>
  );
}
