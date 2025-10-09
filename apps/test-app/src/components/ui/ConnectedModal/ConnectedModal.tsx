import { ChevronLeftIcon } from '@heroicons/react/24/solid';
import { CloseIcon, cn, Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle } from '@tuwaio/nova-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

import { ConnectButtonProps } from '@/components/ui/ConnectButton/ConnectButton';
import { ConnectedModalFooter } from '@/components/ui/ConnectedModal/ConnectedModalFooter';
import { ConnectedModalMainContent } from '@/components/ui/ConnectedModal/ConnectedModalMainContent';
import { ConnectedModalTxHistory } from '@/components/ui/ConnectedModal/ConnectedModalTxHistory';

type ConnectedModalProps = Pick<
  ConnectButtonProps,
  'solanaRPCUrls' | 'appChains' | 'transactionPool' | 'pulsarAdapter'
> & {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onChangeWalletClick?: () => void;
};

export type ConnectedContentType = 'main' | 'transactions' | 'chains';

export function ConnectedModal({
  isOpen,
  setIsOpen,
  solanaRPCUrls,
  appChains,
  transactionPool,
  onChangeWalletClick,
  pulsarAdapter,
}: ConnectedModalProps) {
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);

  const [contentType, setContentType] = useState<ConnectedContentType>('main');

  useEffect(() => {
    if (isOpen) {
      setContentType('main');
    }
  }, [isOpen]);

  if (!activeWallet) return null;

  const getTitle = () => {
    switch (contentType) {
      case 'transactions':
        return 'Transactions in app';
      case 'chains':
        return 'Switch network';
      default:
        return 'Connected';
    }
  };

  const renderMainContent = () => {
    switch (contentType) {
      case 'main':
        return (
          <ConnectedModalMainContent
            onChangeWalletClick={onChangeWalletClick}
            solanaRPCUrls={solanaRPCUrls}
            transactionPool={transactionPool}
            appChains={appChains}
            setContentType={setContentType}
          />
        );
      case 'transactions':
        return (
          <ConnectedModalTxHistory
            address={activeWallet.address}
            pulsarAdapter={pulsarAdapter}
            transactionPool={transactionPool}
          />
        );
      case 'chains':
        return <h1>Chains</h1>;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
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
                  {contentType !== 'main' && (
                    <button
                      type="button"
                      onClick={() => setContentType('main')}
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
                  onClick={() => setIsOpen(false)}
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

            <ConnectedModalFooter setIsOpen={setIsOpen} />
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
