'use client';

import Image from 'next/image';

import { ConnectButton } from '@/components/ui/components/ConnectButton/ConnectButton';

export function Header() {
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

      <ConnectButton />
    </header>
  );
}
