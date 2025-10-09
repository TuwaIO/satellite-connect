'use client';

import Image from 'next/image';

import { ConnectButton, ConnectButtonProps } from '@/components/ui/ConnectButton/ConnectButton';
import { appEVMChains, solanaRPCUrls } from '@/configs/appConfig';
import { usePulsarStore } from '@/hooks/pulsarStoreHook';

export function Header() {
  const transactionPool = usePulsarStore((state) => state.transactionsPool);
  const getAdapter = usePulsarStore((state) => state.getAdapter);

  return (
    <header className="p-2 flex items-center justify-between gap-4 bg-[var(--tuwa-bg-secondary)] border-b border-[var(--tuwa-border-secondary)]">
      <a href="https://www.tuwa.io/" target="_blank">
        <Image
          width={90}
          height={35}
          className="w-[90px] h-[35px]"
          src="https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/tuwa_logo.svg"
          alt="TUWA Logo"
        />
      </a>

      <ConnectButton
        appChains={appEVMChains}
        solanaRPCUrls={solanaRPCUrls}
        transactionPool={transactionPool}
        pulsarAdapter={getAdapter() as ConnectButtonProps['pulsarAdapter']}
        withBalance
        withChain
        withImpersonated
      />
    </header>
  );
}
