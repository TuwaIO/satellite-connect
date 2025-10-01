'use client';

import Image from 'next/image';

import { ConnectButton } from '@/components/ui/ConnectButton/ConnectButton';

import { WalletConnectButton } from './WalletConnect/WalletConnectButton';

export function Header() {
  return (
    <header className="p-2 flex items-center justify-between gap-4 bg-[var(--tuwa-bg-secondary)] border-b border-[var(--tuwa-border-secondary)]">
      <a href="https://www.tuwa.io/" target="_blank">
        <Image
          width="80"
          height="30"
          src="https://raw.githubusercontent.com/TuwaIO/workflows/refs/heads/main/preview/tuwa_logo.svg"
          alt="TUWA Logo"
        />
      </a>

      <div className="flex items-center gap-3">
        <ConnectButton />
        sss
        <WalletConnectButton />
      </div>
    </header>
  );
}
