import { standardButtonClasses } from '@tuwaio/nova-core';
import { getAdapterFromWalletType } from '@tuwaio/orbit-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { AnimatePresence, motion } from 'framer-motion';

import { ConnectButtonProps } from '@/components/ui/ConnectButton/ConnectButton';
import { ConnectedContentType } from '@/components/ui/ConnectedModal/ConnectedModal';
import { ConnectedModalNameAndBalance } from '@/components/ui/ConnectedModal/ConnectedModalNameAndBalance';
import { IconButton } from '@/components/ui/ConnectedModal/IconButton';
import { useGetWalletNameAndAvatar } from '@/components/ui/hooks/useGetWalletNameAndAvatar';
import { useWalletNativeBalance } from '@/components/ui/hooks/useWalletNativeBalance';
import { WalletAvatar } from '@/components/ui/WalletAvatar';

export function ConnectedModalMainContent({
  transactionPool,
  onChangeWalletClick,
  setContentType,
  chainList,
}: {
  onChangeWalletClick?: () => void;
  setContentType: (value: ConnectedContentType) => void;
  chainList: string[] | number[];
} & Pick<ConnectButtonProps, 'transactionPool'>) {
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);
  const getConnectors = useSatelliteConnectStore((store) => store.getConnectors);

  const { ensAvatar, ensNameAbbreviated, isLoading: isGetNameLoading } = useGetWalletNameAndAvatar(10);
  const { balance, isLoading } = useWalletNativeBalance();

  const connectors = getConnectors();

  if (!activeWallet) return null;

  const walletTransactions = Object.values(transactionPool ?? {})?.filter(
    (tx) => tx.from.toLowerCase() === activeWallet.address.toLowerCase(),
  );

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
          items={chainList.length}
          onClick={() => setContentType('chains')}
        />
        <WalletAvatar ensAvatar={ensAvatar} address={activeWallet?.address} className="w-28 h-28 sm:w-32 sm:h-32" />
      </div>

      <ConnectedModalNameAndBalance
        address={activeWallet.address}
        balance={balance}
        isLoading={isLoading}
        ensNameAbbreviated={ensNameAbbreviated}
      />

      {!!walletTransactions.length && (
        <div className="relative flex items-center justify-center gap-2">
          <button className={standardButtonClasses} onClick={() => setContentType('transactions')}>
            View transactions
          </button>
          <AnimatePresence>
            {walletTransactions?.some((tx) => tx.pending) && (
              <motion.p
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="block absolute left-[110%] w-4 h-4"
              >
                <span className="block Toastify__spinner" />
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
