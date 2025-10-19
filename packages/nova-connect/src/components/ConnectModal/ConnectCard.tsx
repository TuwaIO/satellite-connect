import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { cn, isTouchDevice } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import React, { useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { getNetworkIcon } from '../../utils';
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
      className="novacon:absolute novacon:-bottom-1 novacon:-right-1 novacon:w-full novacon:flex novacon:items-center novacon:justify-end"
      role="group"
      aria-label={labels.listOfNetworks}
    >
      {adapters?.slice(0, 3).map((adapter, index) => (
        <div
          key={adapter}
          className={cn(
            'novacon:w-4 novacon:h-4 novacon:rounded-full novacon:border novacon:border-[var(--tuwa-border-primary)] novacon:bg-[var(--tuwa-bg-primary)] novacon:flex novacon:items-center novacon:justify-center',
            index > 0 && 'novacon:-ml-2',
          )}
          role="img"
          aria-label={`Network ${getNetworkIcon(adapter)?.chainId || adapter}`}
        >
          <Web3Icon chainId={getNetworkIcon(adapter)?.chainId} />
        </div>
      ))}
      {adapters.length > 3 && (
        <div
          className="novacon:w-4 novacon:h-4 novacon:rounded-full novacon:border novacon:border-[var(--tuwa-border-primary)] novacon:bg-[var(--tuwa-bg-primary)] novacon:-ml-2 novacon:flex novacon:items-center novacon:justify-center novacon:text-[8px]"
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
    'novacon:group novacon:cursor-pointer novacon:p-4 novacon:rounded-xl novacon:transition-colors novacon:relative novacon:border novacon:border-[var(--tuwa-border-primary)] novacon:disabled:opacity-50 novacon:disabled:cursor-not-allowed novacon:bg-[var(--tuwa-bg-secondary)] novacon:hover:bg-[var(--tuwa-bg-muted)]';

  const touchClasses = [
    'novacon:w-[125px] novacon:h-[125px]',
    'novacon:p-2',
    'novacon:flex novacon:flex-col novacon:items-center novacon:justify-center',
    'novacon:text-center',
  ];

  const mouseClasses = ['novacon:w-full novacon:h-auto', 'novacon:flex novacon:items-center novacon:justify-between'];

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
          'novacon:flex novacon:gap-3 novacon:transition novacon:duration-300 novacon:ease-in-out novacon:text-[var(--tuwa-text-primary)] novacon:group-hover:text-[var(--tuwa-text-accent)]',
          isTouch ? 'novacon:flex-col novacon:items-center novacon:gap-1' : 'novacon:items-center',
        )}
      >
        <div
          className="novacon:flex novacon:relative novacon:transition novacon:duration-300 novacon:ease-in-out group-hover:novacon:scale-115"
          role="img"
          aria-label={`${title} ${labels.walletIcon}`}
        >
          <div className="novacon:[&_img]:w-[42px]! novacon:[&_img]:h-[auto]! novacon:sm:[&_img]:w-[32px]!">{icon}</div>
          <NetworkIcons adapters={adapters} isOnlyOneNetwork={isOnlyOneNetwork} />
        </div>

        <div
          className={cn(
            'novacon:flex novacon:flex-col novacon:gap-0.5',
            isTouch ? 'novacon:items-center novacon:text-sm' : 'novacon:items-start',
          )}
        >
          <span className={cn(isTouch && 'novacon:font-medium')} role="heading" aria-level={3}>
            {title}
          </span>
          {subtitle && (
            <span
              className={cn(
                'novacon:text-[var(--tuwa-text-secondary)]',
                isTouch ? 'novacon:text-[10px]' : 'novacon:text-sm',
              )}
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
          className="novacon:absolute novacon:top-[2px] novacon:right-[2px] novacon:text-[var(--tuwa-text-secondary)] novacon:transition novacon:duration-300 novacon:ease-in-out novacon:active:scale-75 novacon:hover:scale-110 novacon:group-hover:text-[var(--tuwa-text-primary)]"
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
          className="novacon:absolute novacon:top-0.5 novacon:right-0.5 novacon:transition novacon:group-hover:opacity-0 novacon:group-hover:scale-90"
          aria-label={`${title} ${labels.recent}`}
        >
          {labels.recent}
        </RecentBadge>
      )}
      {!isTouch && (
        <div
          className="novacon:w-5 novacon:h-5 novacon:transition novacon:duration-300 novacon:ease-in-out novacon:translate-x-[-10px] novacon:opacity-0 novacon:group-hover:translate-x-0 novacon:group-hover:opacity-100 novacon:text-[var(--tuwa-text-secondary)]"
          aria-hidden="true"
        >
          <ChevronRightIcon />
        </div>
      )}
    </button>
  );
}
