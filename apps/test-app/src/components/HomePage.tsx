'use client';

import { TransactionsBlockWrapper as TransactionsBlockRainbowKit } from '@/components/evm/TransactionsBlockWrapper';
import { TransactionsBlockWrapper as TransactionsBlockSolana } from '@/components/solana/TransactionsBlockWrapper';

export default function HomePage() {
  return (
    <div className="w-full flex justify-center items-center bg-gradient-to-br from-[var(--tuwa-bg-secondary)] to-[var(--tuwa-bg-muted)] gap-4 flex-wrap relative min-h-[calc(100dvh-65px)]">
      <TransactionsBlockSolana />
      <TransactionsBlockRainbowKit />
    </div>
  );
}
