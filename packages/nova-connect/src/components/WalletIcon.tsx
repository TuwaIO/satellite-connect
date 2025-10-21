/**
 * @file This file contains the `WalletIcon` component, a customizable wallet icon renderer with fallback support.
 */

import { Web3Icon } from '@bgd-labs/react-web3-icons';
import { cn } from '@tuwaio/nova-core';
import { formatWalletName } from '@tuwaio/orbit-core';
import { ComponentPropsWithoutRef, ComponentType, forwardRef, useCallback, useMemo, useState } from 'react';

import { useNovaConnectLabels } from '../hooks/useNovaConnectLabels';

// --- Types for Customization ---
type CustomLoadingOverlayProps = {
  size: number;
  isLoading: boolean;
};

type CustomErrorIndicatorProps = {
  walletName: string;
  hasError: boolean;
};

type CustomFallbackIconProps = {
  walletName: string;
  size: number;
  className?: string;
};

/**
 * Customization options for WalletIcon component
 */
export type WalletIconCustomization = {
  /** Override container element props */
  containerProps?: Partial<ComponentPropsWithoutRef<'div'>>;
  /** Override image element props */
  imageProps?: Partial<ComponentPropsWithoutRef<'img'>>;
  /** Custom components */
  components?: {
    /** Custom loading overlay component */
    LoadingOverlay?: ComponentType<CustomLoadingOverlayProps>;
    /** Custom error indicator component (only shown in development) */
    ErrorIndicator?: ComponentType<CustomErrorIndicatorProps>;
    /** Custom fallback icon component */
    FallbackIcon?: ComponentType<CustomFallbackIconProps>;
  };
  /** Custom class name generators */
  classNames?: {
    /** Function to generate container classes */
    container?: (params: { isLoading: boolean; showLoading: boolean; size: number }) => string;
    /** Function to generate image classes */
    image?: (params: { isLoading: boolean; showLoading: boolean; hasError: boolean }) => string;
  };
};

export interface WalletIconProps extends Omit<ComponentPropsWithoutRef<'div'>, 'role'> {
  /** Custom icon URL for the wallet */
  icon?: string;
  /** Name of the wallet */
  name: string;
  /** Size of the icon in pixels */
  size?: number;
  /** Custom alt text for the icon */
  altText?: string;
  /** Whether to show loading state */
  showLoading?: boolean;
  /** Callback fired when image loads successfully */
  onImageLoad?: () => void;
  /** Callback fired when image fails to load */
  onImageError?: () => void;
  /** Enable lazy loading for non-critical images */
  lazy?: boolean;
  /** Customization options */
  customization?: WalletIconCustomization;
}

// --- Default Sub-Components ---
const DefaultLoadingOverlay = ({ isLoading }: CustomLoadingOverlayProps) => {
  if (!isLoading) return null;

  return (
    <div
      className="novacon:absolute novacon:inset-0 novacon:bg-[var(--tuwa-bg-muted)] novacon:animate-pulse novacon:rounded-full"
      aria-hidden="true"
    />
  );
};

const DefaultErrorIndicator = ({ walletName, hasError }: CustomErrorIndicatorProps) => {
  if (!hasError || process.env.NODE_ENV !== 'development') return null;

  return (
    <div
      className="novacon:absolute novacon:top-0 novacon:right-0 novacon:w-2 novacon:h-2 novacon:bg-red-500 novacon:rounded-full"
      title={`Failed to load icon for ${walletName}`}
      aria-hidden="true"
    />
  );
};

const DefaultFallbackIcon = ({ walletName, className }: CustomFallbackIconProps) => {
  return <Web3Icon walletKey={walletName} className={cn('novacon:flex-shrink-0', className)} />;
};

/**
 * A highly customizable wallet icon component with loading states, error handling, and fallback support.
 * Provides extensive customization options for container, image, and sub-components while maintaining accessibility.
 */
export const WalletIcon = forwardRef<HTMLDivElement, WalletIconProps>(
  (
    {
      icon,
      name,
      size = 32,
      className,
      altText,
      showLoading = false,
      onImageLoad,
      onImageError,
      lazy = false,
      customization,
      ...props
    },
    ref,
  ) => {
    const labels = useNovaConnectLabels();
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(Boolean(icon));

    // Extract custom components
    const {
      LoadingOverlay = DefaultLoadingOverlay,
      ErrorIndicator = DefaultErrorIndicator,
      FallbackIcon = DefaultFallbackIcon,
    } = customization?.components ?? {};

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

    // Generate container classes
    const containerClasses = useMemo(() => {
      if (customization?.classNames?.container) {
        return customization.classNames.container({ isLoading, showLoading, size });
      }
      return cn(
        'novacon:relative novacon:inline-flex novacon:items-center novacon:justify-center novacon:flex-shrink-0',
        'novacon:overflow-hidden',
        {
          'novacon:animate-pulse novacon:bg-[var(--tuwa-bg-muted)]': showLoading && isLoading,
        },
        className,
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.container, isLoading, showLoading, size, className]);

    // Generate image classes
    const imageClasses = useMemo(() => {
      if (customization?.classNames?.image) {
        return customization.classNames.image({ isLoading, showLoading, hasError });
      }

      return cn(
        'novacon:object-cover novacon:transition-opacity novacon:duration-200',
        'novacon:max-w-full novacon:max-h-full',
        'novacon:opacity-100',
        {
          'novacon:opacity-0': isLoading && showLoading,
        },
      );
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [customization?.classNames?.image, isLoading, showLoading, hasError]);

    // Image style object
    const imageStyle = useMemo(
      () => ({
        width: size,
        height: size,
      }),
      [size],
    );

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
        style: { lineHeight: 0, ...customization?.containerProps?.style, ...props.style },
      }),
      [customization?.containerProps, props, ref, containerClasses, imageAltText],
    );

    // Merge image props
    const imageProps = useMemo(
      () => ({
        ...customization?.imageProps,
        src: cleanIconUrl!,
        alt: '', // Empty alt since parent div has role="img" and aria-label
        className: cn(imageClasses, customization?.imageProps?.className),
        style: { ...imageStyle, ...customization?.imageProps?.style },
        onLoad: handleImageLoad,
        onError: handleImageError,
        loading: (lazy ? 'lazy' : 'eager') as 'lazy' | 'eager',
        decoding: 'async' as const,
        crossOrigin: 'anonymous' as const,
        referrerPolicy: 'no-referrer' as const,
      }),
      [customization?.imageProps, cleanIconUrl, imageClasses, imageStyle, handleImageLoad, handleImageError, lazy],
    );

    return (
      <div {...containerProps}>
        {/* Loading overlay */}
        <LoadingOverlay size={size} isLoading={showLoading && isLoading} />

        {/* Custom icon with error fallback */}
        {cleanIconUrl && !hasError ? (
          <img {...imageProps} />
        ) : (
          <FallbackIcon walletName={walletName} size={size} className={imageClasses} />
        )}

        {/* Error state indicator */}
        <ErrorIndicator walletName={walletName} hasError={hasError} />
      </div>
    );
  },
);

WalletIcon.displayName = 'WalletIcon';
