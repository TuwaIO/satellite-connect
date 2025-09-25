'use client';

import { ArrowDownIcon } from '@heroicons/react/24/solid';
import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import { TxActionButton as TAB } from '@tuwaio/nova-transactions';
import { createSolanaClientWithCache } from '@tuwaio/orbit-solana';
import { TransactionAdapter } from '@tuwaio/pulsar-core';
import { SolanaWallet, Wallet } from '@tuwaio/satellite-core';
import { UiWalletAccount } from '@wallet-standard/react';
import { Address } from 'gill';
import React from 'react';

import { useStore } from '@/hooks/storeHook';
import { usePulsarStore } from '@/hooks/txTrackingHooks';
import { txActions, TxType } from '@/transactions';

export const TxActionButtonDecrement = ({
  activeWallet,
  currentCount,
  solanatest,
}: {
  activeWallet: Wallet;
  currentCount: number;
  solanatest: Address;
}) => {
  const handleTransaction = usePulsarStore((state) => state.handleTransaction);
  const transactionsPool = usePulsarStore((state) => state.transactionsPool);
  const getLastTxKey = usePulsarStore((state) => state.getLastTxKey);
  const getAccounts = useStore((state) => state.getAccounts);

  const activeWalletSolana = activeWallet as SolanaWallet;

  const signer = useWalletAccountTransactionSendingSigner(
    activeWalletSolana.connectedAccount as UiWalletAccount,
    `solana:${activeWallet?.chainId ?? 'devnet'}`,
  );

  const handleDecrement = async () => {
    await handleTransaction({
      actionFunction: () =>
        txActions.decrementSolana({
          client: createSolanaClientWithCache(activeWallet.rpcURL ?? 'devnet'),
          signer,
          solanatest,
        }),
      onSuccessCallback: async () => {
        await getAccounts();
      },
      params: {
        type: TxType.decrement,
        adapter: TransactionAdapter.SOLANA,
        // The RPC URL must be provided for the tracker to work after a page reload
        rpcUrl: activeWallet?.rpcURL,
        desiredChainID: 'devnet', // The cluster name for the pre-flight check
        title: ['Decrementing', 'Decremented', 'Error', 'Replaced'],
        description: [
          `New value will be ${currentCount - 1}`,
          `Success! New value is ${currentCount - 1}`,
          'An error occurred during decrement.',
          'Transaction was replaced.',
        ],
        payload: {
          value: currentCount,
        },
        withTrackedModal: true,
      },
    });
  };

  return (
    <TAB
      action={handleDecrement}
      transactionsPool={transactionsPool}
      getLastTxKey={getLastTxKey}
      className={`
        w-full p-2.5 rounded-xl border border-transparent
        text-white font-semibold shadow-md transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-700
        bg-gray-800
        hover:bg-gray-700 hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none
      `}
      disabled={!activeWallet?.isConnected || currentCount === 0}
      walletAddress={activeWallet?.address}
    >
      <div className="flex items-center justify-center space-x-2">
        <ArrowDownIcon className="w-5 h-5" />
        <span className="text-sm leading-none">Decrement</span>
      </div>
    </TAB>
  );
};
