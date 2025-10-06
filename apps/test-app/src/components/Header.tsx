'use client';

import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import Image from 'next/image';

import { ConnectButton } from '@/components/ui/ConnectButton/ConnectButton';
import { appEVMChains, solanaRPCUrls } from '@/configs/appConfig';

export function Header() {
  const walletError = useSatelliteConnectStore((store) => store.walletConnectionError);

  console.log('walletError', walletError);

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

      <div className="flex items-center gap-3">
        <ConnectButton appChains={appEVMChains} solanaRPCUrls={solanaRPCUrls} withBalance />
      </div>
    </header>
  );
}
