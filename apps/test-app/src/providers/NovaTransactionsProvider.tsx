import { NovaTransactionsProvider as NTP } from '@tuwaio/nova-transactions/providers';
import { getAdapterFromWalletType } from '@tuwaio/orbit-core';
import { useInitializeTransactionsPool } from '@tuwaio/pulsar-react';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';

import { usePulsarStore } from '@/hooks/pulsarStoreHook';

export function NovaTransactionsProvider() {
  const getAdapter = usePulsarStore((state) => state.getAdapter);
  const initialTx = usePulsarStore((state) => state.initialTx);
  const closeTxTrackedModal = usePulsarStore((state) => state.closeTxTrackedModal);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const executeTxAction = usePulsarStore((state) => state.executeTxAction);
  const initializeTransactionsPool = usePulsarStore((state) => state.initializeTransactionsPool);
  const activeWallet = useSatelliteConnectStore((state) => state.activeWallet);

  useInitializeTransactionsPool({ initializeTransactionsPool });

  return (
    <NTP
      transactionsPool={transactionsPool}
      initialTx={initialTx}
      closeTxTrackedModal={closeTxTrackedModal}
      executeTxAction={executeTxAction}
      connectedWalletAddress={activeWallet?.isConnected ? activeWallet.address : undefined}
      connectedAdapterType={getAdapterFromWalletType(activeWallet?.walletType ?? 'evm:')}
      adapter={getAdapter()}
    />
  );
}
