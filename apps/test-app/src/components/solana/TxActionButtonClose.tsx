'use client';

import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import { TxActionButton as TAB } from '@tuwaio/nova-transactions';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import { SolanaWallet, Wallet } from '@tuwaio/satellite-core';
import { UiWalletAccount } from '@wallet-standard/react';
import { Address, createSolanaClient } from 'gill';
import React from 'react';

import { useStore } from '@/hooks/storeHook';
import { usePulsarStore } from '@/hooks/txTrackingHooks';
import { txActions, TxType } from '@/transactions';

export const TxActionButtonClose = ({ activeWallet, solanatest }: { activeWallet: Wallet; solanatest: Address }) => {
  const handleTransaction = usePulsarStore((state) => state.handleTransaction);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getLastTxKey = usePulsarStore((state) => state.getLastTxKey);
  const getAccounts = useStore((state) => state.getAccounts);
  const removeAccFromStore = useStore((state) => state.removeAccFromStore);

  const activeWalletSolana = activeWallet as SolanaWallet;

  const signer = useWalletAccountTransactionSendingSigner(
    activeWalletSolana.connectedAccount as UiWalletAccount,
    `solana:${activeWallet?.chainId ?? 'devnet'}`,
  );

  const handleClose = async () => {
    await handleTransaction({
      actionFunction: () =>
        txActions.closeSolana({
          client: createSolanaClient({ urlOrMoniker: activeWallet.rpcURL ?? 'mainnet' }),
          signer,
          solanatest,
        }),
      onSuccessCallback: async () => {
        await getAccounts(activeWallet);
        removeAccFromStore(solanatest.toString());
      },
      params: {
        type: TxType.close,
        adapter: TransactionAdapter.SOLANA,
        // The RPC URL must be provided for the tracker to work after a page reload
        rpcUrl: activeWallet?.rpcURL,
        desiredChainID: 'devnet', // The cluster name for the pre-flight check
        title: ['Closing', 'Closed', 'Error', 'Replaced'],
        description: [
          `The counter will be closed.`,
          `Success! The counter is closed.`,
          'An error occurred during closing.',
          'Transaction was replaced.',
        ],
        withTrackedModal: true,
      },
    });
  };

  return (
    <TAB
      action={handleClose}
      transactionsPool={transactionsPool}
      getLastTxKey={getLastTxKey}
      disabled={!activeWallet?.isConnected}
      walletAddress={activeWallet?.address}
      className={`
        w-full p-2.5 rounded-xl border border-transparent
        text-gray-800 font-semibold shadow-sm transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neutral-400
        bg-gradient-to-r from-neutral-200 to-neutral-300
        hover:from-neutral-300 hover:to-neutral-400 hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none
      `}
    >
      <span className="text-sm leading-none">Close</span>
    </TAB>
  );
};
