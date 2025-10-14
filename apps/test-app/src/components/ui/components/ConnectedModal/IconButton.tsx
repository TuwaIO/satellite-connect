import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { ChevronArrowWithAnim, cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';

import { WalletIcon } from '../WalletIcon';

interface IconButtonProps {
  walletIcon?: string;
  walletName?: string;
  walletChainId?: string | number;
  items?: number;
  onClick?: () => void;
  className?: string;
}

export function IconButton({ walletIcon, walletName, walletChainId, items, onClick, className }: IconButtonProps) {
  const isClickAvailable = !!onClick && items && items > 1;

  return (
    <button
      type="button"
      className={cn(
        'flex items-center justify-center gap-1 rounded-full bg-[var(--tuwa-bg-primary)] border border-[var(--tuwa-border-primary)] p-1.5',
        `[&>img]:w-[24px] [&>img]:h-[24px] transition [&>img]:transition`,
        {
          'cursor-pointer hover:[&>img]:scale-[0.95] active:[&>img]:scale-[0.85]': isClickAvailable,
        },
        className,
      )}
      onClick={() => (isClickAvailable ? onClick() : undefined)}
    >
      {!!walletName && <WalletIcon name={walletName} icon={walletIcon} />}
      {!!walletChainId && (
        <Web3Icon
          chainId={typeof walletChainId === 'string' ? `${OrbitAdapter.SOLANA}:${walletChainId}` : walletChainId}
        />
      )}
      {isClickAvailable && <ChevronArrowWithAnim />}
    </button>
  );
}
