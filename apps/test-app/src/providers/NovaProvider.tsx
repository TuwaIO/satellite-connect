import { NovaProvider as NP } from '@tuwaio/nova-transactions/providers';
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
import { getAdapterFromWalletType } from '@tuwaio/satellite-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';

import { usePulsarStore } from '@/hooks/txTrackingHooks';

export function NovaProvider() {
  const getAdapter = usePulsarStore((state) => state.getAdapter);
  const initialTx = usePulsarStore((state) => state.initialTx);
  const closeTxTrackedModal = usePulsarStore((state) => state.closeTxTrackedModal);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const handleTransaction = usePulsarStore((state) => state.handleTransaction);
  const initializeTransactionsPool = usePulsarStore((state) => state.initializeTransactionsPool);
  const activeWallet = useSatelliteConnectStore((state) => state.activeWallet);

  useInitializeTransactionsPool({ initializeTransactionsPool });

  return (
    <NP
      transactionsPool={transactionsPool}
      initialTx={initialTx}
      closeTxTrackedModal={closeTxTrackedModal}
      handleTransaction={handleTransaction}
      connectedWalletAddress={activeWallet?.isConnected ? activeWallet.address : undefined}
      connectedAdapterType={getAdapterFromWalletType(activeWallet?.walletType ?? 'evm:') as any}
      adapter={getAdapter()}
    />
  );
}
