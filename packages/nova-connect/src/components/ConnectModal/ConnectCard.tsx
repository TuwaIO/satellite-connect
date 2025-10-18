import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import React, { useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { getNetworkIcon, isTouchDevice } from '../../utils';
import { RecentBadge } from './RecentBadge';

/**
 * Props for the NetworkIcons component
 */
interface NetworkIconsProps {
  /** Array of network adapters to display as icons */
  adapters?: OrbitAdapter[];
  /** Whether only one network is available */
  isOnlyOneNetwork?: boolean;
}

/**
 * NetworkIcons component - Displays network chain icons for supported networks
 *
 * Shows up to 3 network icons with an overflow indicator for additional networks.
 * Hidden when only one network is available or no adapters are provided.
 *
 * @param adapters - Array of network adapters to display
 * @param isOnlyOneNetwork - Whether only one network is available
 * @returns JSX element with network icons or null if conditions not met
 */
function NetworkIcons({ adapters, isOnlyOneNetwork }: NetworkIconsProps) {
  const labels = useNovaConnectLabels();

  if (!adapters?.length) return null;
  if (isOnlyOneNetwork) return null;

  return (
    <div
      className="absolute -bottom-1 -right-1 w-full flex items-center justify-end"
      role="group"
      aria-label={labels.listOfNetworks}
    >
      {adapters?.slice(0, 3).map((adapter, index) => (
        <div
          key={adapter}
          className={cn(
            'w-4 h-4 rounded-full border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] flex items-center justify-center',
            index > 0 && '-ml-2',
          )}
          role="img"
          aria-label={`Network ${getNetworkIcon(adapter)?.chainId || adapter}`}
        >
          <Web3Icon chainId={getNetworkIcon(adapter)?.chainId} />
        </div>
      ))}
      {adapters.length > 3 && (
        <div
          className="w-4 h-4 rounded-full border border-[var(--tuwa-border-primary)] bg-[var(--tuwa-bg-primary)] -ml-2 flex items-center justify-center text-[8px]"
          role="img"
          aria-label={`${adapters.length - 3} additional networks`}
        >
          +{adapters.length - 3}
        </div>
      )}
    </div>
  );
}

/**
 * Props for the ConnectCard component
 */
interface ConnectCardProps extends NetworkIconsProps {
  /** Click handler for the connect card */
  onClick: () => void;
  /** Icon element to display for the wallet/connector */
  icon: React.ReactNode;
  /** Primary title/name of the wallet/connector */
  title: string;
  /** Optional subtitle/description text */
  subtitle?: string;
  /** Optional URL for additional information */
  infoLink?: string;
  /** Whether this connector was recently used */
  isRecent?: boolean;
}

/**
 * ConnectCard component - Interactive card for wallet connection options
 *
 * This component provides a clickable card interface for wallet connectors with:
 * - Responsive design adapting to touch/mouse interfaces
 * - Network icons overlay showing supported networks
 * - Recent usage indicator badge
 * - Information link with external documentation
 * - Hover animations and visual feedback
 * - Full accessibility support with ARIA labels
 * - Keyboard navigation support
 *
 * Visual features:
 * - Touch devices: Square card layout optimized for mobile interaction
 * - Mouse devices: Horizontal card layout with hover animations
 * - Dynamic network icons display up to 3 supported networks
 * - Smooth hover transitions with scale and color changes
 * - Recent badge with fade-out on hover
 *
 * Accessibility features:
 * - Proper ARIA labels for screen readers
 * - Role attributes for semantic structure
 * - Keyboard navigation support
 * - Focus management with visual indicators
 * - Screen reader announcements for state changes
 *
 * @param onClick - Handler function called when card is clicked
 * @param title - Primary display name for the wallet/connector
 * @param icon - React element containing the wallet icon
 * @param adapters - Array of supported network adapters
 * @param infoLink - Optional URL for additional information
 * @param subtitle - Optional secondary description text
 * @param isRecent - Whether to show recent usage badge
 * @param isOnlyOneNetwork - Whether only one network is available
 * @returns JSX element representing the interactive connect card
 *
 * @example
 * ```tsx
 * <ConnectCard
 *   onClick={() => connect('metamask')}
 *   title="MetaMask"
 *   subtitle="Browser Extension"
 *   icon={<MetaMaskIcon />}
 *   adapters={[evm]}
 *   isRecent={true}
 *   infoLink="https://metamask.io/learn"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Touch device optimized card
 * <ConnectCard
 *   onClick={() => connect('walletconnect')}
 *   title="WalletConnect"
 *   icon={<WalletConnectIcon />}
 *   adapters={[ethereum, polygon]}
 *   isOnlyOneNetwork={false}
 * />
 * ```
 *
 * @public
 */
export function ConnectCard({
  onClick,
  title,
  icon,
  adapters,
  infoLink,
  subtitle,
  isRecent,
  isOnlyOneNetwork,
}: ConnectCardProps) {
  const labels = useNovaConnectLabels();
  const isTouch = useMemo(() => isTouchDevice(), []);

  const baseClasses =
    'group cursor-pointer p-4 rounded-xl transition-colors relative border border-[var(--tuwa-border-primary)] disabled:opacity-50 disabled:cursor-not-allowed bg-[var(--tuwa-bg-secondary)] hover:bg-[var(--tuwa-bg-muted)]';

  const touchClasses = ['w-[125px] h-[125px]', 'p-2', 'flex flex-col items-center justify-center', 'text-center'];

  const mouseClasses = ['w-full h-auto', 'flex items-center justify-between'];

  return (
    <button
      type="button"
      className={cn(baseClasses, isTouch ? touchClasses : mouseClasses)}
      onClick={onClick}
      aria-label={useMemo(() => {
        const baseLabel = `${labels.connect} ${title}`;
        const recentText = isRecent ? ` (${labels.recent})` : '';
        const subtitleText = subtitle ? `, ${subtitle}` : '';
        const networkCount = adapters?.length ? `, supports ${adapters.length} networks` : '';

        return `${baseLabel}${recentText}${subtitleText}${networkCount}`;
      }, [labels.connect, labels.recent, title, isRecent, subtitle, adapters?.length])}
      aria-describedby={subtitle ? `${title}-subtitle` : undefined}
    >
      <div
        className={cn(
          'flex gap-3 transition duration-300 ease-in-out text-[var(--tuwa-text-primary)] group-hover:text-[var(--tuwa-text-accent)]',
          isTouch ? 'flex-col items-center gap-1' : 'items-center',
        )}
      >
        <div
          className="flex relative transition duration-300 ease-in-out group-hover:scale-115"
          role="img"
          aria-label={`${title} ${labels.walletIcon}`}
        >
          <div className="[&_img]:!w-[42px] [&_img]:h-[auto] sm:[&_img]:!w-[32px]">{icon}</div>
          <NetworkIcons adapters={adapters} isOnlyOneNetwork={isOnlyOneNetwork} />
        </div>

        <div className={cn('flex flex-col gap-0.5', isTouch ? 'items-center text-sm' : 'items-start')}>
          <span className={cn(isTouch && 'font-medium')} role="heading" aria-level={3}>
            {title}
          </span>
          {subtitle && (
            <span
              className={cn('text-[var(--tuwa-text-secondary)]', isTouch ? 'text-[10px]' : 'text-sm')}
              id={`${title}-subtitle`}
              role="text"
            >
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
          rel="noopener noreferrer"
          aria-label={`${labels.learnMore} ${labels.aboutWallets} ${title}`}
        >
          <InformationCircleIcon width={16} height={16} aria-hidden="true" />
        </a>
      )}
      {isRecent && (
        <RecentBadge
          className="absolute top-0.5 right-0.5 transition group-hover:opacity-0 group-hover:scale-90"
          aria-label={`${title} ${labels.recent}`}
        >
          {labels.recent}
        </RecentBadge>
      )}
      {!isTouch && (
        <div
          className="w-5 h-5 transition duration-300 ease-in-out translate-x-[-10px] opacity-0 group-hover:translate-x-0 group-hover:opacity-100 text-[var(--tuwa-text-secondary)]"
          aria-hidden="true"
        >
          <ChevronRightIcon />
        </div>
      )}
    </button>
  );
}
