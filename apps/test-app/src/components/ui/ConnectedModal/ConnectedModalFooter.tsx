import { getAdapterFromWalletType } from '@tuwaio/satellite-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { motion } from 'framer-motion';

export function ConnectedModalFooter({ setIsOpen }: { setIsOpen: (isOpen: boolean) => void }) {
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);
  const getAdapter = useSatelliteConnectStore((store) => store.getAdapter);
  const disconnect = useSatelliteConnectStore((store) => store.disconnect);

  if (!activeWallet) return null;

  return (
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
  );
}
