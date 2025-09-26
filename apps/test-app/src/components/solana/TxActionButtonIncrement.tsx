'use client';

import { ArrowUpIcon } from '@heroicons/react/24/solid';
import { useWalletAccountTransactionSendingSigner } from '@solana/react';
import { TxActionButton as TAB } from '@tuwaio/nova-transactions';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { createSolanaClientWithCache } from '@tuwaio/orbit-solana';
import { SolanaWallet, Wallet } from '@tuwaio/satellite-core';
import { UiWalletAccount } from '@wallet-standard/react';
import { Address } from 'gill';
import React from 'react';

import { useStore } from '@/hooks/storeHook';
import { usePulsarStore } from '@/hooks/txTrackingHooks';
import { txActions, TxType } from '@/transactions';

export const TxActionButtonIncrement = ({
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

  const handleIncrement = async () => {
    await handleTransaction({
      actionFunction: () =>
        txActions.incrementSolana({
          client: createSolanaClientWithCache(activeWallet.rpcURL ?? 'devnet'),
          signer,
          solanatest,
        }),
      onSuccessCallback: async () => {
        await getAccounts();
      },
      params: {
        type: TxType.increment,
        adapter: OrbitAdapter.SOLANA,
        // The RPC URL must be provided for the tracker to work after a page reload
        rpcUrl: activeWallet?.rpcURL,
        desiredChainID: 'devnet', // The cluster name for the pre-flight check
        title: ['Incrementing', 'Incremented', 'Error', 'Replaced'],
        description: [
          `New value will be ${currentCount + 1}`,
          `Success! New value is ${currentCount + 1}`,
          'An error occurred during increment.',
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
      action={handleIncrement}
      transactionsPool={transactionsPool}
      getLastTxKey={getLastTxKey}
      className={`
        w-full p-2.5 rounded-xl border border-transparent
        text-[var(--tuwa-text-on-accent)] font-semibold shadow-md transition-all duration-200
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--tuwa-button-gradient-to-hover)]
        bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)]
        hover:from-[var(--tuwa-button-gradient-from-hover)] hover:to-[var(--tuwa-button-gradient-to-hover)] hover:shadow-lg
        disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] select-none
      `}
      disabled={!activeWallet?.isConnected}
      walletAddress={activeWallet?.address}
    >
      <div className="flex items-center justify-center space-x-2">
        <ArrowUpIcon className="w-5 h-5" />
        <span className="text-sm leading-none">Increment</span>
      </div>
    </TAB>
  );
};
