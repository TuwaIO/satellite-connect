import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { ChevronArrowWithAnim, cn } from '@tuwaio/nova-core';
import { OrbitAdapter } from '@tuwaio/orbit-core';
import { forwardRef, useMemo } from 'react';

import { useNovaConnectLabels } from '../../hooks/useNovaConnectLabels';
import { WalletIcon } from '../WalletIcon';

/**
 * Props for the IconButton component
 */
interface IconButtonProps {
  /** Custom icon URL for the wallet */
  walletIcon?: string;
  /** Name of the wallet */
  walletName?: string;
  /** Chain ID for the network icon */
  walletChainId?: string | number;
  /** Number of available items/options (shows chevron if > 1) */
  items?: number;
  /** Click handler for the button */
  onClick?: () => void;
  /** Additional CSS classes for styling */
  className?: string;
  /** Whether the button is currently disabled */
  disabled?: boolean;
  /** Whether to show loading state */
  loading?: boolean;
  /** Custom aria-label for accessibility */
  'aria-label'?: string;
  /** Custom tooltip text */
  title?: string;
}

/**
 * Multi-purpose icon button component for wallets and chains
 *
 * This component provides a unified interface for displaying wallet and chain information:
 * - Displays wallet icon with fallback to Web3Icon
 * - Shows chain/network icon when chain ID is provided
 * - Conditional chevron arrow for dropdown indicators
 * - Full WCAG accessibility support with proper ARIA labels
 * - Loading and disabled states
 * - Hover and active animations
 * - Responsive design with consistent sizing
 *
 * The button automatically becomes interactive when onClick is provided and items > 1.
 * It supports both EVM chain IDs (numbers) and Solana network identifiers (strings).
 *
 * @param props - Component props for icon button configuration
 * @returns Forwardable button element with icons and accessibility support
 *
 * @example
 * ```tsx
 * // Simple wallet button
 * <IconButton
 *   walletName="MetaMask"
 *   walletIcon="https://example.com/metamask-icon.png"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Interactive chain selector
 * <IconButton
 *   walletName="Phantom"
 *   walletChainId="mainnet-beta"
 *   items={3}
 *   onClick={handleChainSelect}
 *   aria-label="Select blockchain network"
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Loading state with disabled interaction
 * <IconButton
 *   walletName="WalletConnect"
 *   loading={true}
 *   disabled={true}
 *   title="Connecting to wallet..."
 * />
 * ```
 *
 * @public
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      walletIcon,
      walletName,
      walletChainId,
      items = 0,
      onClick,
      className,
      disabled = false,
      loading = false,
      'aria-label': ariaLabel,
      title,
    },
    ref,
  ) => {
    const labels = useNovaConnectLabels();

    /**
     * Determine if the button should be interactive
     * Button is clickable when onClick is provided, not disabled, not loading, and has multiple items
     */
    const isClickable = useMemo(
      () => Boolean(onClick && !disabled && !loading && items > 1),
      [onClick, disabled, loading, items],
    );

    /**
     * Generate chain ID for Web3Icon
     * Handles both EVM (numeric) and Solana (string) chain identifiers
     */
    const formattedChainId = useMemo(() => {
      if (!walletChainId) return undefined;

      // If it's a string, assume it's a Solana network identifier
      if (typeof walletChainId === 'string') {
        return `${OrbitAdapter.SOLANA}:${walletChainId}`;
      }

      // If it's a number, use it directly as EVM chain ID
      return walletChainId;
    }, [walletChainId]);

    /**
     * Generate accessible label for the button
     */
    const accessibleLabel = useMemo(() => {
      if (ariaLabel) return ariaLabel;

      const parts: string[] = [];

      if (walletName) parts.push(`${walletName} wallet`);
      if (walletChainId) parts.push('network selector');
      if (isClickable) parts.push('button');
      if (loading) parts.push('loading');
      if (disabled) parts.push('disabled');

      return parts.join(', ') || 'Wallet controls';
    }, [ariaLabel, walletName, walletChainId, isClickable, loading, disabled]);

    /**
     * Generate tooltip text
     */
    const tooltipText = useMemo(() => {
      if (title) return title;
      if (loading) return 'Loading...';
      if (disabled) return 'Button is disabled';
      if (isClickable) return `Click to select ${walletName ? walletName + ' ' : ''}options`;
      return walletName ? `${walletName} wallet` : 'Wallet information';
    }, [title, loading, disabled, isClickable, walletName]);

    /**
     * Memoized button classes for performance
     */
    const buttonClasses = useMemo(
      () =>
        cn(
          // Base styles
          'novacon:flex novacon:items-center novacon:justify-center novacon:gap-1 novacon:rounded-full',
          'novacon:bg-[var(--tuwa-bg-primary)] novacon:border novacon:border-[var(--tuwa-border-primary)]',
          'novacon:p-1.5 novacon:transition-all novacon:duration-200',

          // Icon sizing
          'novacon:[&_img]:w-6! novacon:[&_img]:h-6! novacon:[&_img]:transition-transform novacon:[&_img]:duration-200',

          // Interactive states
          {
            'novacon:cursor-pointer novacon:hover:[&_img]:scale-95 novacon:active:[&_img]:scale-85 novacon:hover:shadow-sm':
              isClickable,
            'novacon:cursor-not-allowed novacon:opacity-50': disabled && !loading,
            'novacon:cursor-wait novacon:opacity-75': loading,
            'novacon:cursor-default': !isClickable && !disabled && !loading,
          },

          // Focus states for accessibility
          'novacon:focus-visible:outline-none novacon:focus-visible:ring-2 novacon:focus-visible:ring-[var(--tuwa-border-accent)] novacon:focus-visible:ring-offset-2',

          className,
        ),
      [isClickable, disabled, loading, className],
    );

    /**
     * Handle button click with safety checks
     */
    const handleClick = () => {
      if (isClickable && onClick) {
        onClick();
      }
    };

    return (
      <button
        ref={ref}
        type="button"
        className={buttonClasses}
        onClick={handleClick}
        disabled={disabled || loading}
        aria-label={accessibleLabel}
        title={tooltipText}
        role="button"
        tabIndex={disabled || loading ? -1 : 0}
      >
        {/* Wallet icon */}
        {walletName && (
          <WalletIcon
            name={walletName}
            icon={walletIcon}
            altText={`${walletName} ${labels.walletIcon}`}
            showLoading={loading}
            className="novacon:flex-shrink-0"
          />
        )}

        {/* Chain/Network icon */}
        {formattedChainId && (
          <Web3Icon chainId={formattedChainId} className="novacon:flex-shrink-0" title={`Network: ${walletChainId}`} />
        )}

        {/* Chevron arrow for dropdown indication */}
        {isClickable && <ChevronArrowWithAnim className="novacon:flex-shrink-0" aria-hidden="true" />}

        {/* Loading indicator overlay */}
        {loading && (
          <div
            className="novacon:absolute novacon:inset-0 novacon:bg-[var(--tuwa-bg-primary)]/50 novacon:rounded-full novacon:flex novacon:items-center novacon:justify-center"
            aria-hidden="true"
          >
            <div className="novacon:w-3 novacon:h-3 novacon:border-2 novacon:border-[var(--tuwa-text-accent)] novacon:border-t-transparent novacon:rounded-full novacon:animate-spin" />
          </div>
        )}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
