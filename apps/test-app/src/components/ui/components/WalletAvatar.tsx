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
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
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
          'flex-shrink-0 rounded-full relative overflow-hidden',
          'ring-1 ring-[var(--tuwa-border-primary)] ring-opacity-20',
          'focus-within:ring-2 focus-within:ring-[var(--tuwa-text-accent)] focus-within:ring-opacity-50',
          className,
        ),
      [size, className],
    );

    // Memoize loading overlay classes
    const loadingClasses = useMemo(
      () =>
        cn(
          'absolute inset-0 rounded-full bg-[var(--tuwa-bg-muted)]',
          !disableAnimation && showLoading && isLoading && 'animate-pulse',
          (!isLoading || !showLoading) && 'opacity-0',
          'transition-opacity duration-300',
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
              'h-full w-full rounded-full object-cover relative z-10',
              'transition-opacity duration-300',
              isLoading ? 'opacity-0' : 'opacity-100',
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
            className="absolute inset-0 flex items-center justify-center text-white text-xs font-mono"
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
