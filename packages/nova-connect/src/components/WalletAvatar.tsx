/**
 * @file This file contains the `WalletAvatar` component for displaying a user's avatar.
 */

import { cn } from '@tuwaio/nova-core';
import makeBlockie from 'ethereum-blockies-base64';
import { forwardRef, useCallback, useMemo, useRef, useState } from 'react';

import { useNovaConnectLabels } from '../hooks/useNovaConnectLabels';

export type WalletAvatarProps = {
  /** The user's wallet address, used for the blockie fallback and background color. */
  address: string;
  /** An optional URL for the user's ENS avatar image. */
  ensAvatar?: string | null;
  /** Optional additional CSS classes for the container. */
  className?: string;
  /** Custom alt text for the avatar image */
  altText?: string;
  /** Size variant for the avatar */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Whether to show loading animation */
  showLoading?: boolean;
  /** Callback fired when image loads successfully */
  onImageLoad?: () => void;
  /** Callback fired when image fails to load */
  onImageError?: (error: Event) => void;
  /** Whether to disable the pulse animation */
  disableAnimation?: boolean;
};

function isHex(value: unknown, { strict = true }: { strict?: boolean | undefined } = {}): value is `0x${string}` {
  if (!value) return false;
  if (typeof value !== 'string') return false;
  return strict ? /^0x[0-9a-fA-F]*$/.test(value) : value.startsWith('0x');
}

const zeroAddress = '0x0000000000000000000000000000000000000000';

// Size mapping for different avatar sizes
const sizeClasses = {
  sm: 'novacon:h-4 novacon:w-4',
  md: 'novacon:h-6 novacon:w-6',
  lg: 'novacon:h-8 novacon:w-8',
  xl: 'novacon:h-12 novacon:w-12',
} as const;

/**
 * A component that displays a user's avatar.
 *
 * It prioritizes showing the provided `ensAvatar`. If unavailable or if the image fails to load,
 * it falls back to a procedurally generated "blockie" based on the user's address.
 * It also generates a unique background color from the address as a placeholder.
 */
export const WalletAvatar = forwardRef<HTMLDivElement, WalletAvatarProps>(
  (
    {
      address,
      ensAvatar,
      className,
      altText,
      size = 'md',
      showLoading = true,
      onImageLoad,
      onImageError,
      disableAnimation = false,
      ...props
    },
    ref,
  ) => {
    const labels = useNovaConnectLabels();

    // State management - fix useState initialization
    const [imageSrc, setImageSrc] = useState<string | null>(ensAvatar ?? null);
    const [isLoading, setIsLoading] = useState(Boolean(ensAvatar));
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    // Memoize the generated blockie to avoid re-creating it on every render
    const blockie = useMemo(() => {
      try {
        return makeBlockie(isHex(address) ? address : zeroAddress);
      } catch (error) {
        console.warn('Failed to generate blockie for address:', address, error);
        return null;
      }
    }, [address]);

    // Memoize the background color with validation
    const bgColor = useMemo(() => {
      try {
        if (!isHex(address)) return '#6B7280'; // Fallback gray color
        const colorHex = address.slice(2, 8);
        return colorHex.length === 6 ? `#${colorHex}` : '#6B7280';
      } catch {
        return '#6B7280';
      }
    }, [address]);

    // Format address for screen readers
    const formattedAddress = useMemo(() => {
      if (!address) return labels.unknownWallet;
      return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }, [address, labels.unknownWallet]);

    // Generate alt text
    const imageAltText = useMemo(() => {
      if (altText) return altText;
      if (hasError || !ensAvatar) {
        return `${labels.walletAvatar} ${formattedAddress}`;
      }
      return `${labels.ensAvatar} ${formattedAddress}`;
    }, [altText, hasError, ensAvatar, formattedAddress, labels.walletAvatar, labels.ensAvatar]);

    // Reset image source when ensAvatar changes - fix state update issues
    const currentEnsAvatar = useMemo(() => ensAvatar ?? null, [ensAvatar]);

    useMemo(() => {
      setImageSrc(currentEnsAvatar);
      setIsLoading(Boolean(currentEnsAvatar));
      setHasError(false);
    }, [currentEnsAvatar]);

    // Handle image load success
    const handleImageLoad = useCallback(() => {
      setIsLoading(false);
      setHasError(false);
      onImageLoad?.();
    }, [onImageLoad]);

    // Handle image load error
    const handleImageError = useCallback(
      (event: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setIsLoading(false);
        setHasError(true);
        setImageSrc(blockie);
        onImageError?.(event.nativeEvent);
      },
      [blockie, onImageError],
    );

    // Memoize container classes
    const containerClasses = useMemo(
      () =>
        cn(
          sizeClasses[size],
          'novacon:flex-shrink-0 novacon:rounded-full novacon:relative novacon:overflow-hidden',
          'novacon:ring-1 novacon:ring-[var(--tuwa-border-primary)]',
          'novacon:focus-within:ring-2 novacon:focus-within:ring-[var(--tuwa-text-accent)]',
          className,
        ),
      [size, className],
    );

    // Memoize loading overlay classes
    const loadingClasses = useMemo(
      () =>
        cn(
          'novacon:absolute novacon:inset-0 novacon:rounded-full novacon:bg-[var(--tuwa-bg-muted)]',
          !disableAnimation && showLoading && isLoading && 'novacon:animate-pulse',
          (!isLoading || !showLoading) && 'novacon:opacity-0',
          'novacon:transition-opacity novacon:duration-300',
        ),
      [disableAnimation, showLoading, isLoading],
    );

    // Get current image source with fallback
    const currentImageSrc = imageSrc || blockie || '';

    return (
      <div
        ref={ref}
        className={containerClasses}
        style={{ backgroundColor: bgColor }}
        role="img"
        aria-label={imageAltText}
        title={imageAltText}
        {...props}
      >
        {/* Loading overlay */}
        <div className={loadingClasses} aria-hidden="true" />

        {/* Avatar image */}
        {currentImageSrc && (
          <img
            ref={imgRef}
            key={`${ensAvatar || 'blockie'}-${address}`} // Force re-mount when source changes
            className={cn(
              'novacon:h-full novacon:w-full novacon:rounded-full novacon:object-cover novacon:relative novacon:z-10',
              'novacon:transition-opacity novacon:duration-300',
              isLoading ? 'novacon:opacity-0' : 'novacon:opacity-100',
            )}
            src={currentImageSrc}
            alt="" // Empty alt since parent div has role="img" and aria-label
            onLoad={handleImageLoad}
            onError={handleImageError}
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        )}

        {/* Fallback content for extreme error cases */}
        {!currentImageSrc && (
          <div
            className="novacon:absolute novacon:inset-0 novacon:flex novacon:items-center novacon:justify-center novacon:text-white novacon:text-xs novacon:font-mono"
            aria-hidden="true"
          >
            {formattedAddress.slice(0, 2)}
          </div>
        )}
      </div>
    );
  },
);

WalletAvatar.displayName = 'WalletAvatar';
