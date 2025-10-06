'use client';

import { OrbitAdapter } from '@tuwaio/orbit-core/src';
import { getAdapterFromWalletType } from '@tuwaio/satellite-core/src';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';

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
        <div>Connect Wallet To proccess transactions.</div>
      )}
    </div>
  );
}
