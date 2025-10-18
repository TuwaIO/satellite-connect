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
          'flex items-center justify-center gap-1 rounded-full',
          'bg-[var(--tuwa-bg-primary)] border border-[var(--tuwa-border-primary)]',
          'p-1.5 transition-all duration-200',

          // Icon sizing
          '[&_img]:!w-6 [&_img]:!h-6 [&_img]:transition-transform [&_img]:duration-200',

          // Interactive states
          {
            'cursor-pointer hover:[&_img]:scale-95 active:[&_img]:scale-85 hover:shadow-sm': isClickable,
            'cursor-not-allowed opacity-50': disabled && !loading,
            'cursor-wait opacity-75': loading,
            'cursor-default': !isClickable && !disabled && !loading,
          },

          // Focus states for accessibility
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--tuwa-border-accent)] focus-visible:ring-offset-2',

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
            className="flex-shrink-0"
          />
        )}

        {/* Chain/Network icon */}
        {formattedChainId && (
          <Web3Icon chainId={formattedChainId} className="flex-shrink-0" title={`Network: ${walletChainId}`} />
        )}

        {/* Chevron arrow for dropdown indication */}
        {isClickable && <ChevronArrowWithAnim className="flex-shrink-0" aria-hidden="true" />}

        {/* Loading indicator overlay */}
        {loading && (
          <div
            className="absolute inset-0 bg-[var(--tuwa-bg-primary)]/50 rounded-full flex items-center justify-center"
            aria-hidden="true"
          >
            <div className="w-3 h-3 border-2 border-[var(--tuwa-text-accent)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </button>
    );
  },
);

IconButton.displayName = 'IconButton';
