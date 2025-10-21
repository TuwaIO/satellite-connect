import { textCenterEllipsis } from '@tuwaio/nova-core';
import { getAdapterFromWalletType, OrbitAdapter } from '@tuwaio/orbit-core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { NovaConnectProviderProps, NovaConnectProviderType } from './useNovaConnect';

export interface WalletNameAndAvatarData {
  /** The resolved name from the Name Service (e.g., ENS, like "alice.eth"), or null if not found. */
  ensName: string | null;
  /** The URL of the avatar associated with the name, or null if not found. */
  ensAvatar: string | null;
  /** True while the name service data is being fetched. */
  isLoading: boolean;
  /** A truncated version of the name for display, or the abbreviated address if no name. */
  ensNameAbbreviated: string | undefined;
  /** Error message if the name resolution failed. */
  error: string | null;
  /** Function to retry the name resolution manually. */
  retry: () => void;
}

interface UseGetWalletNameAndAvatarOptions
  extends Pick<NovaConnectProviderProps, 'store'>,
    Pick<NovaConnectProviderType, 'activeWallet'> {
  /** Number of characters to show on each side when abbreviating (default: 12) */
  abbreviateSymbols?: number;
  /** Maximum length before abbreviation is applied (default: 30) */
  maxNameLength?: number;
  /** Whether to automatically retry on failure (default: false) */
  autoRetry?: boolean;
  /** Retry delay in milliseconds (default: 3000) */
  retryDelay?: number;
}

/**
 * A custom hook to fetch the Name Service (e.g., ENS) name and avatar
 * for the currently active wallet.
 *
 * This hook automatically detects the active wallet and its corresponding
 * adapter via the `useSatelliteConnectStore` and attempts to resolve the
 * wallet address to a human-readable name and avatar.
 *
 * @param options Configuration options for the hook
 * @returns An object containing the resolved name, avatar, loading state, and utility functions
 *
 * @example
 * ```typescript
 * import { useGetWalletNameAndAvatar } from './useGetWalletNameAndAvatar';
 *
 * function DisplayWalletInfo() {
 *   const { ensName, ensAvatar, isLoading, ensNameAbbreviated, error, retry } = useGetWalletNameAndAvatar({
 *     abbreviateSymbols: 8,
 *     maxNameLength: 25
 *   });
 *
 *   if (isLoading) {
 *     return <div>Resolving name...</div>;
 *   }
 *
 *   if (error) {
 *     return <div>Error: {error} <button onClick={retry}>Retry</button></div>;
 *   }
 *
 *   return (
 *     <div className="wallet-info">
 *       {ensAvatar && <img src={ensAvatar} alt="Wallet Avatar" />}
 *       <p title={ensName || ''}>{ensNameAbbreviated || 'No Name Found'}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useGetWalletNameAndAvatar(options: UseGetWalletNameAndAvatarOptions): WalletNameAndAvatarData {
  const { abbreviateSymbols = 12, maxNameLength = 30, autoRetry = false, retryDelay = 3000, store } = options;

  // Store state selectors - memoized for performance
  const getAdapter = store.getState().getAdapter;

  // Memoize wallet address and adapter for dependency tracking
  const walletAddress = useMemo(() => options.activeWallet?.address, [options.activeWallet?.address]);
  const walletType = useMemo(() => options.activeWallet?.walletType, [options.activeWallet?.walletType]);

  const foundAdapter = useMemo(() => {
    if (!walletType) return null;
    return getAdapter(getAdapterFromWalletType(walletType ?? `${OrbitAdapter.EVM}:not-connected`));
  }, [getAdapter, walletType]);

  // State variables
  const [ensName, setEnsName] = useState<string | null>(null);
  const [ensAvatar, setEnsAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Refs for cleanup and retry functionality
  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<number | null>(null);

  // Memoize adapter capabilities
  const adapterCapabilities = useMemo(() => {
    if (!foundAdapter) {
      return { hasNameResolver: false, hasAvatarResolver: false };
    }

    const hasNameResolver = 'getName' in foundAdapter && typeof foundAdapter.getName === 'function';
    const hasAvatarResolver = 'getAvatar' in foundAdapter && typeof foundAdapter.getAvatar === 'function';

    return { hasNameResolver, hasAvatarResolver };
  }, [foundAdapter]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (retryTimeoutRef.current !== null) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
  }, []);

  // Main fetch function
  const fetchNameData = useCallback(async () => {
    cleanup();

    // Exit conditions
    if (!walletAddress || !foundAdapter || !adapterCapabilities.hasNameResolver) {
      setEnsName(null);
      setEnsAvatar(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController();
    const { signal } = abortControllerRef.current;

    // Start loading
    setIsLoading(true);
    setError(null);
    setEnsName(null);
    setEnsAvatar(null);

    try {
      // Check if request was aborted
      if (signal.aborted) return;

      // Attempt to resolve the name
      const name = await foundAdapter.getName?.(walletAddress);

      if (signal.aborted) return;

      if (name) {
        setEnsName(name);

        // If avatar resolution is supported, fetch the avatar
        if (adapterCapabilities.hasAvatarResolver) {
          try {
            const avatar = await foundAdapter.getAvatar?.(name);
            if (!signal.aborted) {
              // Handle undefined case by converting to null
              setEnsAvatar(avatar ?? null);
            }
          } catch (avatarError) {
            // Avatar fetch failed, but name succeeded - not critical
            console.warn('Failed to fetch avatar:', avatarError);
            if (!signal.aborted) {
              setEnsAvatar(null);
            }
          }
        }
      }
    } catch (error) {
      if (signal.aborted) return;

      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch name service data';
      console.error('Failed to fetch name service data:', error);

      setError(errorMessage);
      setEnsName(null);
      setEnsAvatar(null);

      // Auto retry if enabled
      if (autoRetry) {
        retryTimeoutRef.current = setTimeout(() => {
          fetchNameData();
        }, retryDelay) as unknown as number;
      }
    } finally {
      if (!signal.aborted) {
        setIsLoading(false);
      }
    }
  }, [walletAddress, foundAdapter, adapterCapabilities, autoRetry, retryDelay, cleanup]);

  // Manual retry function
  const retry = useCallback(() => {
    setError(null);
    fetchNameData();
  }, [fetchNameData]);

  // Effect to fetch data when dependencies change
  useEffect(() => {
    fetchNameData();
    return cleanup;
  }, [fetchNameData, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Memoized abbreviated name computation
  const ensNameAbbreviated = useMemo(() => {
    if (ensName) {
      return ensName.length > maxNameLength
        ? textCenterEllipsis(ensName, abbreviateSymbols, abbreviateSymbols)
        : ensName;
    }

    return walletAddress ? textCenterEllipsis(walletAddress, abbreviateSymbols, abbreviateSymbols) : undefined;
  }, [ensName, walletAddress, maxNameLength, abbreviateSymbols]);

  return {
    ensName,
    ensAvatar,
    isLoading,
    ensNameAbbreviated,
    error,
    retry,
  };
}
