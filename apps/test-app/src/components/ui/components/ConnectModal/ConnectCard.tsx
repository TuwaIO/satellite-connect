import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import React, { useMemo } from 'react';

import { useNovaConnectLabels } from '@/components/ui/hooks/useNovaConnectLabels';

import { getNetworkIcon } from '../../utils/getNetworIcon';
import { isTouchDevice } from '../../utils/isTouchDevice';
import { RecentBadge } from './RecentBadge';

interface NetworkIconsProps {
  adapters?: OrbitAdapter[];
  isOnlyOneNetwork?: boolean;
}

function NetworkIcons({ adapters, isOnlyOneNetwork }: NetworkIconsProps) {
  if (!adapters?.length) return null;
  if (isOnlyOneNetwork) return null;

  return (
    <div className="absolute -bottom-1 -right-1 w-full flex items-center justify-end">
      {adapters?.slice(0, 3).map((adapter, index) => (
        <div
          key={adapter}
          className={cn(
            'w-4 h-4 rounded-full border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] flex items-center justify-center',
            index > 0 && '-ml-2',
          )}
        >
          <Web3Icon chainId={getNetworkIcon(adapter)?.chainId} />
        </div>
      ))}
      {adapters.length > 3 && (
        <div className="w-4 h-4 rounded-full border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] -ml-2 flex items-center justify-center text-[8px]">
          +{adapters.length - 3}
        </div>
      )}
    </div>
  );
}

interface ConnectCardProp extends NetworkIconsProps {
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  infoLink?: string;
  isRecent?: boolean;
}

export function ConnectCard({
  onClick,
  title,
  icon,
  adapters,
  infoLink,
  subtitle,
  isRecent,
  isOnlyOneNetwork,
}: ConnectCardProp) {
  const labels = useNovaConnectLabels();
  const isTouch = useMemo(() => isTouchDevice(), []);

  const baseClasses =
    'group cursor-pointer p-4 rounded-xl transition-colors relative border border-[var(--tuwa-border-primary)] disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--tuwa-bg-secondary)] hover:bg-[var(--tuwa-bg-muted)]';

  const touchClasses = ['w-[125px] h-[125px]', 'p-2', 'flex flex-col items-center justify-center', 'text-center'];

  const mouseClasses = ['w-full h-auto', 'flex items-center justify-between'];

  return (
    <button type="button" className={cn(baseClasses, isTouch ? touchClasses : mouseClasses)} onClick={onClick}>
      <div
        className={cn(
          'flex gap-3 transition duration-300 ease-in-out text-[var(--tuwa-text-primary)] group-hover:text-[var(--tuwa-text-accent)]',
          isTouch ? 'flex-col items-center gap-1' : 'items-center',
        )}
      >
        <div className="flex relative transition duration-300 ease-in-out group-hover:scale-115">
          <div className="[&_img]:w-[42px] [&_img]:h-[auto] sm:[&_img]:w-[32px]">{icon}</div>
          <NetworkIcons adapters={adapters} isOnlyOneNetwork={isOnlyOneNetwork} />
        </div>

        <div className={cn('flex flex-col gap-0.5', isTouch ? 'items-center text-sm' : 'items-start')}>
          <span className={cn(isTouch && 'font-medium')}>{title}</span>
          {subtitle && (
            <span className={cn('text-[var(--tuwa-text-secondary)]', isTouch ? 'text-[10px]' : 'text-sm')}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
      {infoLink && (
        <a
          className="absolute top-[2px] right-[2px] text-[var(--tuwa-text-secondary)] transition duration-300 ease-in-out active:scale-75 hover:scale-110 group-hover:text-[var(--tuwa-text-primary)]"
          onClick={(e) => e.stopPropagation()}
          href={infoLink}
          target="_blank"
          aria-label={labels.learnMore}
        >
          <InformationCircleIcon width={16} height={16} />
        </a>
      )}
      {isRecent && (
        <RecentBadge className="absolute top-0.5 right-0.5 transition group-hover:opacity-0 group-hover:scale-90">
          {labels.recent}
        </RecentBadge>
      )}
      {!isTouch && (
        <div className="w-5 h-5 transition duration-300 ease-in-out translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-[var(--tuwa-text-secondary)]">
          <ChevronRightIcon />
        </div>
      )}
    </button>
  );
}
