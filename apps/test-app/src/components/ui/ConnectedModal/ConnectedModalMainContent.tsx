import { getAdapterFromWalletType } from '@tuwaio/satellite-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { SolanaWallet } from '@tuwaio/satellite-solana';
import { AnimatePresence, motion } from 'framer-motion';

import { ConnectButtonProps } from '@/components/ui/ConnectButton/ConnectButton';
import { ConnectedContentType } from '@/components/ui/ConnectedModal/ConnectedModal';
import { ConnectedModalNameAndBalance } from '@/components/ui/ConnectedModal/ConnectedModalNameAndBalance';
import { IconButton } from '@/components/ui/ConnectedModal/IconButton';
import { useGetWalletNameAndAvatar } from '@/components/ui/hooks/useGetWalletNameAndAvatar';
import { useWalletNativeBalance } from '@/components/ui/hooks/useWalletNativeBalance';
import { getChainsListByWalletType } from '@/components/ui/utils/getChainsListByWalletType';
import { WalletAvatar } from '@/components/ui/WalletInfo/WalletAvatar';

export function ConnectedModalMainContent({
  appChains,
  solanaRPCUrls,
  transactionPool,
  onChangeWalletClick,
  setContentType,
}: { onChangeWalletClick?: () => void; setContentType: (value: ConnectedContentType) => void } & Pick<
  ConnectButtonProps,
  'appChains' | 'solanaRPCUrls' | 'transactionPool'
>) {
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);
  const getConnectors = useSatelliteConnectStore((store) => store.getConnectors);

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
    <div className="flex flex-col items-center justify-center gap-2 p-4">
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
          className="absolute z-3 bottom-[-10px] left-[-10px]"
          walletIcon={activeWallet.walletIcon}
          walletName={activeWallet.walletType.split(':')[1]}
          items={connectors[getAdapterFromWalletType(activeWallet.walletType)]?.length}
          onClick={onChangeWalletClick}
        />
        <IconButton
          className="absolute z-3 bottom-[-10px] right-[-10px]"
          walletChainId={activeWallet.chainId}
          items={chainsList.length}
          onClick={() => console.log('walletIcon')}
        />
        <WalletAvatar ensAvatar={ensAvatar} address={activeWallet?.address} className="w-28 h-28 sm:w-32 sm:h-32" />
      </div>

      <ConnectedModalNameAndBalance
        address={activeWallet.address}
        balance={balance}
        isLoading={isLoading}
        ensNameAbbreviated={ensNameAbbreviated}
      />

      {!!Object.values(transactionPool ?? {})?.filter(
        (tx) => tx.from.toLowerCase() === activeWallet.address.toLowerCase(),
      ).length && (
        <button
          className="cursor-pointer rounded-md bg-[var(--tuwa-bg-muted)] px-4 py-2 flex items-center gap-1 text-sm font-semibold mt-4
                     text-[var(--tuwa-text-primary)] transition-colors hover:bg-[var(--tuwa-border-primary)]
                     disabled:cursor-not-allowed disabled:opacity-50"
          onClick={() => setContentType('transactions')}
        >
          View transactions
        </button>
      )}
    </div>
  );
}
