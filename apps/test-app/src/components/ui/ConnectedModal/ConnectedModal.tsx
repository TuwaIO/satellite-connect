import {
  CloseIcon,
  cn,
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  useCopyToClipboard,
} from '@tuwaio/nova-core';
import { getAdapterFromWalletType } from '@tuwaio/satellite-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { SolanaWallet } from '@tuwaio/satellite-solana';
import { AnimatePresence, motion } from 'framer-motion';

import { ConnectButtonProps } from '@/components/ui/ConnectButton/ConnectButton';
import { IconButton } from '@/components/ui/ConnectedModal/IconButton';
import { useGetWalletNameAndAvatar } from '@/components/ui/hooks/useGetWalletNameAndAvatar';
import { useWalletNativeBalance } from '@/components/ui/hooks/useWalletNativeBalance';
import { getChainsListByWalletType } from '@/components/ui/utils/getChainsListByWalletType';
import { WalletAvatar } from '@/components/ui/WalletInfo/WalletAvatar';

interface ConnectedModalProps extends Pick<ConnectButtonProps, 'solanaRPCUrls' | 'appChains' | 'transactionPool'> {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onChangeWalletClick?: () => void;
}

export function ConnectedModal({
  isOpen,
  setIsOpen,
  solanaRPCUrls,
  appChains,
  transactionPool,
  onChangeWalletClick,
}: ConnectedModalProps) {
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);
  const getAdapter = useSatelliteConnectStore((store) => store.getAdapter);
  const disconnect = useSatelliteConnectStore((store) => store.disconnect);
  const getConnectors = useSatelliteConnectStore((store) => store.getConnectors);
  const { copy, isCopied } = useCopyToClipboard();

  const { ensAvatar, ensNameAbbreviated, isLoading: isGetNameLoading } = useGetWalletNameAndAvatar(12);
  const { balance, isLoading } = useWalletNativeBalance();

  const chainsList = activeWallet
    ? getChainsListByWalletType({
        walletType: activeWallet.walletType,
        appChains,
        solanaRPCUrls,
        chains: (activeWallet as SolanaWallet)?.connectedWallet?.chains,
      })
    : [];

  const connectors = getConnectors();

  if (!activeWallet) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <DialogContent className={cn('w-full sm:max-w-md')}>
        <div className={cn('relative flex w-full flex-col')}>
          <DialogHeader>
            <DialogTitle>Connected</DialogTitle>

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

          <main className="flex flex-col items-center justify-center gap-2 p-4 relative">
            <AnimatePresence>
              {(isGetNameLoading || isLoading) && (
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute right-5 top-2 w-5 h-5"
                >
                  <div className="Toastify__spinner" />
                </motion.div>
              )}
            </AnimatePresence>

            <div className="mb-6 relative">
              <IconButton
                className="absolute z-2 bottom-[-10px] left-[-10px]"
                walletIcon={activeWallet.walletIcon}
                walletName={activeWallet.walletType.split(':')[1]}
                items={connectors[getAdapterFromWalletType(activeWallet.walletType)]?.length}
                onClick={onChangeWalletClick}
              />
              <IconButton
                className="absolute z-2 bottom-[-10px] right-[-10px]"
                walletChainId={activeWallet.chainId}
                items={chainsList.length}
                onClick={() => console.log('walletIcon')}
              />
              <WalletAvatar
                ensAvatar={ensAvatar}
                address={activeWallet?.address}
                className="w-28 h-28 sm:w-32 sm:h-32"
              />
            </div>

            <div className="flex items-center gap-3 relative text-[var(--tuwa-text-primary)]">
              <p className="text-xl font-bold">{ensNameAbbreviated}</p>
              <button
                type="button"
                onClick={() => copy(activeWallet.address)}
                className={cn(
                  'cursor-pointer flex items-center justify-center text-sm text-[var(--tuwa-text-tertiary)] hover:opacity-60 transition absolute right-[-26px]',
                  {
                    'text-[var(--tuwa-success-text)]': isCopied,
                  },
                )}
              >
                {isCopied ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <motion.path
                      d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={{
                        hidden: { pathLength: 0, opacity: 0 },
                        visible: { pathLength: 1, opacity: 1 },
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{
                        duration: 0.5,
                        ease: 'easeInOut',
                      }}
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <motion.path
                      d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      variants={{
                        hidden: { pathLength: 0, opacity: 0 },
                        visible: { pathLength: 1, opacity: 1 },
                      }}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      transition={{
                        duration: 0.5,
                        ease: 'easeInOut',
                      }}
                    />
                  </svg>
                )}
              </button>
            </div>

            <>
              {isLoading ? (
                <div className="animate-pulse rounded-xl h-5 w-24 bg-[var(--tuwa-bg-muted)] " />
              ) : (
                <p className="flex items-center gap-1 text-sm text-[var(--tuwa-text-tertiary)]">
                  {balance?.value}
                  <span>{balance?.symbol}</span>
                </p>
              )}
            </>

            {!!Object.values(transactionPool ?? {})?.filter(
              (tx) => tx.from.toLowerCase() === activeWallet.address.toLowerCase(),
            ).length && (
              <button
                className="cursor-pointer rounded-md bg-[var(--tuwa-bg-muted)] px-4 py-2 flex items-center gap-1 text-sm font-semibold mt-4
                     text-[var(--tuwa-text-primary)] transition-colors hover:bg-[var(--tuwa-border-primary)]
                     disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                  console.log('open tx history modal');
                }}
              >
                View transactions
              </button>
            )}
          </main>

          <footer className="flex flex-wrap gap-4 w-full items-center justify-between border-t border-[var(--tuwa-border-primary)] p-4 flex-col-reverse sm:flex-row">
            <button
              className="cursor-pointer rounded-md bg-[var(--tuwa-bg-muted)] px-4 py-2 flex items-center gap-1 text-sm font-semibold
                     text-[var(--tuwa-text-primary)] transition-colors hover:bg-[var(--tuwa-border-primary)]
                     disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                disconnect();
                setIsOpen(false);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
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
              Disconnect
            </button>
            <a
              href={getAdapter(getAdapterFromWalletType(activeWallet.walletType))?.getExplorerUrl(
                `/address/${activeWallet.address}`,
                activeWallet.chainId,
              )}
              className="cursor-pointer rounded-md bg-[var(--tuwa-bg-muted)] px-3 py-2 flex items-center gap-1 text-sm font-semibold
                     text-[var(--tuwa-text-primary)] transition-colors hover:bg-[var(--tuwa-border-primary)]
                     disabled:cursor-not-allowed disabled:opacity-50"
              target="_blank"
            >
              View on explorer
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
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
            </a>
          </footer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
