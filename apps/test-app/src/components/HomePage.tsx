'use client';

import { WalletIcon } from '@heroicons/react/24/outline';
import { cn } from '@tuwaio/nova-core';
import { getAdapterFromWalletType, OrbitAdapter } from '@tuwaio/orbit-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { motion } from 'framer-motion';

import { TransactionsBlockWrapper as TransactionsBlockRainbowKit } from '@/components/evm/TransactionsBlockWrapper';
import { TransactionsBlockWrapper as TransactionsBlockSolana } from '@/components/solana/TransactionsBlockWrapper';

export default function HomePage() {
  const activeWallet = useSatelliteConnectStore((store) => store.activeWallet);

  return (
    <div className="w-full flex justify-center items-center bg-gradient-to-br from-[var(--tuwa-bg-secondary)] to-[var(--tuwa-bg-muted)] gap-4 flex-wrap relative min-h-[calc(100dvh-65px)]">
      {activeWallet ? (
        <>
          {getAdapterFromWalletType(activeWallet.walletType) === OrbitAdapter.EVM && <TransactionsBlockRainbowKit />}
          {getAdapterFromWalletType(activeWallet.walletType) === OrbitAdapter.SOLANA && <TransactionsBlockSolana />}
        </>
      ) : (
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.1, 0.1, 0.2, 1] }}
          className={cn(
            'flex flex-col items-center justify-center p-8 m-8 max-w-sm text-center',
            'rounded-xl shadow-2xl backdrop-blur-sm',
            'bg-[var(--tuwa-bg-primary)] ring-1 ring-[var(--tuwa-border-primary)]',
          )}
        >
          <div className="w-12 h-12 p-2 rounded-full mb-4 bg-gradient-to-r from-[var(--tuwa-button-gradient-from)] to-[var(--tuwa-button-gradient-to)] text-[var(--tuwa-text-on-accent)]">
            <WalletIcon className="w-full h-full" />
          </div>
          <h2 className="text-xl font-bold text-[var(--tuwa-text-primary)] mb-2">Wallet Required</h2>
          <p className="text-[var(--tuwa-text-secondary)]">
            Connect your wallet to view and process transactions in the Pulsar module.
          </p>
        </motion.div>
      )}
    </div>
  );
}
