import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { cn } from '@tuwaio/nova-core';
import { formatWalletName } from '@tuwaio/orbit-core';
import Image from 'next/image';
import { forwardRef, useCallback, useMemo, useState } from 'react';

import { useNovaConnectLabels } from '../hooks/useNovaConnectLabels';

interface WalletIconProps {
  /** Custom icon URL for the wallet */
  icon?: string;
  /** Name of the wallet */
  name: string;
  /** Size of the icon in pixels */
  size?: number;
  /** Additional CSS classes */
  className?: string;
  /** Custom alt text for the icon */
  altText?: string;
  /** Whether to show loading state */
  showLoading?: boolean;
  /** Callback fired when image loads successfully */
  onImageLoad?: () => void;
  /** Callback fired when image fails to load */
  onImageError?: () => void;
  /** Priority loading for critical images */
  priority?: boolean;
}

export const WalletIcon = forwardRef<HTMLDivElement, WalletIconProps>(
  (
    { icon, name, className, altText, showLoading = false, onImageLoad, onImageError, priority = false, ...props },
    ref,
  ) => {
    const labels = useNovaConnectLabels();
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(Boolean(icon));

    // Format wallet name for consistency
    const walletName = useMemo(() => formatWalletName(name), [name]);

    // Generate alt text for accessibility
    const imageAltText = useMemo(() => {
      if (altText) return altText;
      return `${walletName} ${labels.walletIcon}`;
    }, [altText, walletName, labels.walletIcon]);

    // Clean and validate icon URL
    const cleanIconUrl = useMemo(() => {
      if (!icon) return null;

      try {
        const trimmedIcon = icon.trim();
        if (!trimmedIcon) return null;

        // Basic URL validation
        if (
          trimmedIcon.startsWith('http://') ||
          trimmedIcon.startsWith('https://') ||
          trimmedIcon.startsWith('/') ||
          trimmedIcon.startsWith('data:')
        ) {
          return trimmedIcon;
        }

        return null;
      } catch {
        return null;
      }
    }, [icon]);

    // Handle image load success
    const handleImageLoad = useCallback(() => {
      setIsLoading(false);
      setHasError(false);
      onImageLoad?.();
    }, [onImageLoad]);

    // Handle image load error
    const handleImageError = useCallback(() => {
      setIsLoading(false);
      setHasError(true);
      onImageError?.();
    }, [onImageError]);

    // Container classes
    const containerClasses = useMemo(
      () =>
        cn(
          'relative inline-flex items-center justify-center flex-shrink-0',
          'rounded-lg overflow-hidden',
          showLoading && isLoading && 'animate-pulse bg-[var(--tuwa-bg-muted)]',
          className,
        ),
      [showLoading, isLoading, className],
    );

    // Image classes for consistency
    const imageClasses = useMemo(
      () => cn('object-cover transition-opacity duration-200', isLoading && showLoading ? 'opacity-0' : 'opacity-100'),
      [isLoading, showLoading],
    );

    return (
      <div ref={ref} className={containerClasses} role="img" aria-label={imageAltText} title={imageAltText} {...props}>
        {/* Loading overlay */}
        {showLoading && isLoading && (
          <div className="absolute inset-0 bg-[var(--tuwa-bg-muted)] animate-pulse rounded-lg" aria-hidden="true" />
        )}

        {/* Custom icon with error fallback */}
        {cleanIconUrl && !hasError ? (
          <Image
            src={cleanIconUrl}
            alt="" // Empty alt since parent div has role="img" and aria-label
            className={imageClasses}
            onLoad={handleImageLoad}
            onError={handleImageError}
            priority={priority}
            unoptimized={cleanIconUrl.startsWith('data:')}
            width={32}
            height={32}
          />
        ) : (
          /* Fallback to Web3Icon */
          <Web3Icon walletKey={walletName} className={cn(imageClasses, 'flex-shrink-0')} />
        )}

        {/* Error state indicator (optional) */}
        {hasError && process.env.NODE_ENV === 'development' && (
          <div
            className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
            title={`Failed to load icon for ${walletName}`}
            aria-hidden="true"
          />
        )}
      </div>
    );
  },
);

WalletIcon.displayName = 'WalletIcon';
