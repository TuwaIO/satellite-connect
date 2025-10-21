/**
 * @file This file contains the `WalletAvatar` component, a customizable user avatar renderer with ENS support and blockie fallback.
 */

import { cn } from '@tuwaio/nova-core';
import makeBlockie from 'ethereum-blockies-base64';
import { ComponentPropsWithoutRef, ComponentType, forwardRef, useCallback, useMemo, useState } from 'react';

import { useNovaConnectLabels } from '../hooks/useNovaConnectLabels';

// --- Types for Customization ---
type CustomLoadingOverlayProps = {
  isLoading: boolean;
  showLoading: boolean;
  disableAnimation: boolean;
  size: WalletAvatarSize;
};

type CustomAvatarImageProps = {
  src: string;
  isLoading: boolean;
  onLoad: () => void;
  onError: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  address: string;
  ensAvatar?: string | null;
  size: WalletAvatarSize;
};

type CustomFallbackContentProps = {
  address: string;
  formattedAddress: string;
  size: WalletAvatarSize;
};

export type WalletAvatarSize = 'sm' | 'md' | 'lg' | 'xl';

/**
 * Customization options for WalletAvatar component
 */
export type WalletAvatarCustomization = {
  /** Override container element props */
  containerProps?: Partial<ComponentPropsWithoutRef<'div'>>;
  /** Override image element props */
  imageProps?: Partial<ComponentPropsWithoutRef<'img'>>;
  /** Custom components */
  components?: {
    /** Custom loading overlay component */
    LoadingOverlay?: ComponentType<CustomLoadingOverlayProps>;
    /** Custom avatar image component */
    AvatarImage?: ComponentType<CustomAvatarImageProps>;
    /** Custom fallback content component for extreme error cases */
    FallbackContent?: ComponentType<CustomFallbackContentProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { size: WalletAvatarSize; bgColor: string; address: string }) => string;
    /** Function to generate loading overlay classes */
    loadingOverlay?: (params: { isLoading: boolean; showLoading: boolean; disableAnimation: boolean }) => string;
    /** Function to generate image classes */
    image?: (params: { isLoading: boolean; size: WalletAvatarSize; hasError: boolean }) => string;
    /** Function to generate fallback content classes */
    fallbackContent?: (params: { size: WalletAvatarSize; address: string }) => string;
  };
  /** Custom utilities */
  utils?: {
    /** Custom blockie generator function */
    generateBlockie?: (address: string) => string | null;
    /** Custom background color generator function */
    generateBgColor?: (address: string) => string;
    /** Custom address formatter function */
    formatAddress?: (address: string, labels: any) => string;
  };
};

export interface WalletAvatarProps extends Omit<ComponentPropsWithoutRef<'div'>, 'role'> {
  /** The user's wallet address, used for the blockie fallback and background color. */
  address: string;
  /** An optional URL for the user's ENS avatar image. */
  ensAvatar?: string | null;
  /** Custom alt text for the avatar image */
  altText?: string;
  /** Size variant for the avatar */
  size?: WalletAvatarSize;
  /** Whether to show loading animation */
  showLoading?: boolean;
  /** Callback fired when image loads successfully */
  onImageLoad?: () => void;
  /** Callback fired when image fails to load */
  onImageError?: (error: Event) => void;
  /** Whether to disable the pulse animation */
  disableAnimation?: boolean;
  /** Customization options */
  customization?: WalletAvatarCustomization;
}

// --- Utility Functions ---
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

// --- Default Sub-Components ---
const DefaultLoadingOverlay = ({ isLoading, showLoading, disableAnimation }: CustomLoadingOverlayProps) => {
  const loadingClasses = cn(
    'novacon:absolute novacon:inset-0 novacon:rounded-full novacon:bg-[var(--tuwa-bg-muted)]',
    {
      'novacon:animate-pulse': !disableAnimation && showLoading && isLoading,
      'novacon:opacity-0': !isLoading || !showLoading,
    },
    'novacon:transition-opacity novacon:duration-300',
  );

  return <div className={loadingClasses} aria-hidden="true" />;
};

const DefaultAvatarImage = ({ src, isLoading, onLoad, onError, address, ensAvatar }: CustomAvatarImageProps) => {
  return (
    <img
      key={`${ensAvatar || 'blockie'}-${address}`}
      className={cn(
        'novacon:h-full novacon:w-full novacon:rounded-full novacon:object-cover novacon:relative novacon:z-10',
        'novacon:transition-opacity novacon:duration-300 novacon:opacity-100',
        {
          'novacon:opacity-0': isLoading,
        },
      )}
      src={src}
      alt=""
      onLoad={onLoad}
      onError={onError}
      loading="lazy"
      decoding="async"
      draggable={false}
    />
  );
};

const DefaultFallbackContent = ({ formattedAddress }: CustomFallbackContentProps) => {
  return (
    <div
      className="novacon:absolute novacon:inset-0 novacon:flex novacon:items-center novacon:justify-center novacon:text-white novacon:text-xs novacon:font-mono"
      aria-hidden="true"
    >
      {formattedAddress.slice(0, 2)}
    </div>
  );
};

// --- Default Utility Functions ---
const defaultGenerateBlockie = (address: string): string | null => {
  try {
    return makeBlockie(isHex(address) ? address : zeroAddress);
  } catch (error) {
    console.warn('Failed to generate blockie for address:', address, error);
    return null;
  }
};

const defaultGenerateBgColor = (address: string): string => {
  try {
    if (!isHex(address)) return '#6B7280';
    const colorHex = address.slice(2, 8);
    return colorHex.length === 6 ? `#${colorHex}` : '#6B7280';
  } catch {
    return '#6B7280';
  }
};

const defaultFormatAddress = (address: string, labels: any): string => {
  if (!address) return labels.unknownWallet;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

/**
 * A highly customizable wallet avatar component with ENS support, blockie fallback, and extensive styling options.
 * Provides comprehensive customization for container, image, loading states, and fallback content while maintaining accessibility.
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
      customization,
      ...props
    },
    ref,
  ) => {
    const labels = useNovaConnectLabels();

    // State management
    const [imageSrc, setImageSrc] = useState<string | null>(ensAvatar ?? null);
    const [isLoading, setIsLoading] = useState(Boolean(ensAvatar));
    const [hasError, setHasError] = useState(false);

    // Extract custom components and utilities
    const {
      LoadingOverlay = DefaultLoadingOverlay,
      AvatarImage = DefaultAvatarImage,
      FallbackContent = DefaultFallbackContent,
    } = customization?.components ?? {};

    const {
      generateBlockie = defaultGenerateBlockie,
      generateBgColor = defaultGenerateBgColor,
      formatAddress = defaultFormatAddress,
    } = customization?.utils ?? {};

    // Generate blockie using custom or default function
    const blockie = useMemo(() => generateBlockie(address), [address, generateBlockie]);

    // Generate background color using custom or default function
    const bgColor = useMemo(() => generateBgColor(address), [address, generateBgColor]);

    // Format address using custom or default function
    const formattedAddress = useMemo(() => formatAddress(address, labels), [address, labels, formatAddress]);

    // Generate alt text for accessibility
    const imageAltText = useMemo(() => {
      if (altText) return altText;
      if (hasError || !ensAvatar) {
        return `${labels.walletAvatar} ${formattedAddress}`;
      }
      return `${labels.ensAvatar} ${formattedAddress}`;
    }, [altText, hasError, ensAvatar, formattedAddress, labels.walletAvatar, labels.ensAvatar]);

    // Reset image source when ensAvatar changes
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

    // Generate container classes
    const containerClasses = useMemo(() => {
      if (customization?.classNames?.container) {
        return customization.classNames.container({ size, bgColor, address });
      }
      return cn(
        sizeClasses[size],
        'novacon:flex-shrink-0 novacon:rounded-full novacon:relative novacon:overflow-hidden',
        'novacon:ring-1 novacon:ring-[var(--tuwa-border-primary)]',
        'novacon:focus-within:ring-2 novacon:focus-within:ring-[var(--tuwa-text-accent)]',
        className,
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.container, size, bgColor, address, className]);

    // Get current image source with fallback
    const currentImageSrc = imageSrc || blockie || '';

    // Merge container props
    const containerProps = useMemo(
      () => ({
        ...customization?.containerProps,
        ...props,
        ref,
        className: containerClasses,
        role: 'img' as const,
        'aria-label': imageAltText,
        title: imageAltText,
      }),
      [customization?.containerProps, props, ref, containerClasses, imageAltText],
    );

    return (
      <div {...containerProps}>
        {/* Loading overlay */}
        <LoadingOverlay
          isLoading={isLoading}
          showLoading={showLoading}
          disableAnimation={disableAnimation}
          size={size}
        />

        {/* Avatar image */}
        {currentImageSrc && (
          <AvatarImage
            src={currentImageSrc}
            isLoading={isLoading}
            onLoad={handleImageLoad}
            onError={handleImageError}
            address={address}
            ensAvatar={ensAvatar}
            size={size}
          />
        )}

        {/* Fallback content for extreme error cases */}
        {!currentImageSrc && <FallbackContent address={address} formattedAddress={formattedAddress} size={size} />}
      </div>
    );
  },
);

WalletAvatar.displayName = 'WalletAvatar';
