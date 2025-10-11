import { PuzzlePieceIcon } from '@heroicons/react/24/solid';
import { TransactionsHistory } from '@tuwaio/nova-transactions';

import { useNovaConnect } from '../../providers/NovaConnectProvider';

export function ConnectedModalTxHistory() {
  const { transactionPool, pulsarAdapter, address } = useNovaConnect();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {transactionPool && pulsarAdapter ? (
        <TransactionsHistory
          transactionsPool={transactionPool}
          adapter={pulsarAdapter}
          connectedWalletAddress={address}
          className="w-full"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center gap-3">
          <div className="w-12 h-12 p-2 rounded-full bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)] text-[var(--tuwa-text-on-accent)]">
            <PuzzlePieceIcon className="w-full h-full" />
          </div>
          <h2 className="text-xl font-bold text-[var(--tuwa-text-primary)]">Pulsar Adapter Required</h2>
          <p className="text-[var(--tuwa-text-secondary)]">
            For viewing transactions in app, need additional configuration. Please contact your admin.
          </p>
        </div>
      )}
    </div>
  );
}
