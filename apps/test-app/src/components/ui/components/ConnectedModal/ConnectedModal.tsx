import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { CloseIcon, cn, Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@tuwaio/nova-core';
import { formatWalletChainId, getAdapterFromWalletType } from '@tuwaio/orbit-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { SolanaWallet } from '@tuwaio/satellite-solana';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

import { ConnectButtonProps } from '@/components/ui/components/ConnectButton/ConnectButton';
import { getChainsListByWalletType } from '@/components/ui/utils/getChainsListByWalletType';

import { useNovaConnect } from '../../hooks/useNovaConnect';
import { ScrollableChainList } from '../Chains/ScrollableChainList';
import { ConnectedModalFooter } from '../ConnectedModal/ConnectedModalFooter';
import { ConnectedModalMainContent } from '../ConnectedModal/ConnectedModalMainContent';
import { ConnectedModalTxHistory } from './ConnectedModalTxHistory';

export function ConnectedModal({
  solanaRPCUrls,
  transactionPool,
  pulsarAdapter,
  appChains,
}: Omit<ConnectButtonProps, 'className'>) {
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);
  const {
    setConnectedModalContentType,
    isConnectedModalOpen,
    setIsConnectedModalOpen,
    connectedModalContentType,
    handleChainChange,
  } = useNovaConnect();

  useEffect(() => {
    if (isConnectedModalOpen) {
      setConnectedModalContentType('main');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnectedModalOpen]);

  if (!activeWallet) return null;

  const chainsList = getChainsListByWalletType({
    walletType: activeWallet.walletType,
    appChains,
    solanaRPCUrls,
    chains: (activeWallet as SolanaWallet)?.connectedWallet?.chains,
  });

  const getChainData = (chain: string | number) => ({
    formattedChainId: formatWalletChainId(chain, getAdapterFromWalletType(activeWallet.walletType)),
    chain,
  });

  const getTitle = () => {
    switch (connectedModalContentType) {
      case 'transactions':
        return 'Transactions in app';
      case 'chains':
        return 'Switch network';
      default:
        return 'Connected';
    }
  };

  const renderMainContent = () => {
    switch (connectedModalContentType) {
      case 'main':
        return <ConnectedModalMainContent chainsList={chainsList} transactionPool={transactionPool} />;
      case 'transactions':
        return <ConnectedModalTxHistory transactionPool={transactionPool} pulsarAdapter={pulsarAdapter} />;
      case 'chains':
        return (
          <ScrollableChainList
            chainsList={chainsList}
            selectValue={String(
              formatWalletChainId(activeWallet.chainId, getAdapterFromWalletType(activeWallet.walletType)),
            )}
            handleValueChange={handleChainChange}
            getChainData={getChainData}
            onClose={() => setConnectedModalContentType('main')}
          />
        );
    }
  };

  return (
    <Dialog open={isConnectedModalOpen} onOpenChange={(open) => setIsConnectedModalOpen(open)}>
      <DialogContent className={cn('w-full sm:max-w-md')}>
        <motion.div
          layout
          transition={{
            layout: {
              duration: 0.0001,
            },
          }}
        >
          <div className={cn('relative flex w-full flex-col')}>
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center justify-between gap-2">
                  {connectedModalContentType !== 'main' && (
                    <button
                      type="button"
                      onClick={() => setConnectedModalContentType('main')}
                      className={cn(
                        'cursor-pointer rounded-full p-1',
                        'text-[var(--tuwa-text-tertiary)] transition-colors',
                        'hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-primary)]',
                      )}
                    >
                      <ChevronLeftIcon className="h-5 w-5" />
                    </button>
                  )}
                  {getTitle()}
                </div>
              </DialogTitle>

              <DialogClose asChild>
                <button
                  type="button"
                  onClick={() => setIsConnectedModalOpen(false)}
                  aria-label="Close modal"
                  className="cursor-pointer rounded-full p-1
                     text-[var(--tuwa-text-tertiary)] transition-colors
                     hover:bg-[var(--tuwa-bg-muted)] hover:text-[var(--tuwa-text-primary)]"
                >
                  <CloseIcon />
                </button>
              </DialogClose>
            </DialogHeader>
            <main className="relative">{renderMainContent()}</main>
            <ConnectedModalFooter setIsOpen={setIsConnectedModalOpen} />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
