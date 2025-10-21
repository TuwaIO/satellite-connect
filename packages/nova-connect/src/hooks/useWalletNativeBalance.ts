import { getAdapterFromWalletType } from '@tuwaio/orbit-core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { NovaConnectProviderProps, NovaConnectProviderType } from './useNovaConnect';

/**
 * @interface NativeBalanceResult
 * Represents the native token balance returned by the adapter.
 * The value is already formatted for human readability.
 * @property {string} value The native token balance formatted to standard decimals (e.g., "1.5").
 * @property {string} symbol The symbol of the native token (e.g., "ETH").
 */
export interface NativeBalanceResult {
  value: string;
  symbol: string;
}

// Type for the balance state within the hook (the fetched data or null).
type NativeBalanceState = NativeBalanceResult | null;

// Type for the local cache: "walletAddress-chainId" -> { value, symbol }.
type BalanceCache = Record<string, NativeBalanceResult>;

/**
 * @interface NativeBalanceData
 * The object returned by the useWalletNativeBalance hook.
 * @property {NativeBalanceState} balance The native token balance and symbol, or null.
 * @property {boolean} isLoading True while the balance is being fetched for the current wallet/chain combination.
 * @property {() => void} refetch Function to manually trigger a balance refresh.
 */
interface NativeBalanceData {
  balance: NativeBalanceState;
  isLoading: boolean;
  refetch: () => void;
}

/**
 * Custom hook to fetch the native token balance for the currently connected wallet
 * on the active chain. It includes a local cache layer to prevent redundant network calls
 * when switching between components or on re-renders for the same wallet/chain.
 *
 * @returns {NativeBalanceData} An object containing the balance data and loading state.
 *
 * @example
 * ```typescript
 * import { useWalletNativeBalance } from './useWalletNativeBalance';
 *
 * function NativeTokenDisplay() {
 *   const { balance, isLoading, refetch } = useWalletNativeBalance();
 *
 *   if (isLoading) {
 *     return <p>Loading balance...</p>;
 *   }
 *
 *   // Display the formatted balance and symbol
 *   return (
 *     <div>
 *       <p>Balance: {balance ? `${balance.value} ${balance.symbol}` : '0.00'}</p>
 *       <button onClick={refetch}>Refresh</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useWalletNativeBalance({
  store,
  activeWallet,
}: Pick<NovaConnectProviderProps, 'store'> & Pick<NovaConnectProviderType, 'activeWallet'>): NativeBalanceData {
  // --- 1. STATE & CACHE SETUP ---

  // Local cache storage. Keys combine wallet address and chain ID.
  const [balanceCache, setBalanceCache] = useState<BalanceCache>({});

  // Local loading state, managed alongside the cache check.
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Track the current fetch operation to prevent race conditions
  const fetchOperationRef = useRef<string | null>(null);

  // Store state selectors - memoized for performance
  const getAdapter = store.getState().getAdapter;

  // --- 2. COMPUTED INPUTS ---

  // Create the unique key for cache lookups: "address-chainId".
  const cacheKey = useMemo(() => {
    return activeWallet?.chainId && activeWallet?.address ? `${activeWallet.address}-${activeWallet.chainId}` : null;
  }, [activeWallet?.chainId, activeWallet?.address]);

  // Find the actual adapter object from the adapter map.
  const foundAdapter = useMemo(() => {
    if (!activeWallet?.walletType) return null;
    return getAdapter(getAdapterFromWalletType(activeWallet.walletType));
  }, [getAdapter, activeWallet?.walletType]);

  // Check if the adapter has balance functionality
  const hasBalanceResolver = useMemo(() => {
    return foundAdapter && 'getBalance' in foundAdapter && typeof foundAdapter.getBalance === 'function';
  }, [foundAdapter]);

  // --- 3. BALANCE FETCHING LOGIC ---

  const fetchBalance = useCallback(
    async (forceRefresh = false) => {
      // Exit early if essential data is missing (not connected).
      if (!activeWallet?.address || !foundAdapter || !activeWallet?.chainId || !cacheKey || !hasBalanceResolver) {
        setIsLoading(false);
        return;
      }

      // Set the current operation ID to prevent race conditions
      const operationId = `${cacheKey}-${Date.now()}`;
      fetchOperationRef.current = operationId;

      // Check cache unless forcing a refresh
      if (!forceRefresh) {
        const cachedBalance = balanceCache[cacheKey];
        if (cachedBalance) {
          setIsLoading(false);
          return;
        }
      }

      setIsLoading(true);

      try {
        // Call the adapter's getBalance method
        const balanceResult: NativeBalanceResult = await foundAdapter.getBalance(
          activeWallet.address,
          activeWallet.chainId,
        );

        // Only update if this operation is still the latest one
        if (fetchOperationRef.current === operationId) {
          setBalanceCache((prevCache) => ({
            ...prevCache,
            [cacheKey]: balanceResult,
          }));
        }
      } catch (error) {
        console.error(`Failed to fetch native balance for ${cacheKey}:`, error);

        // Optionally clear cache entry on error (if you want to retry on next call)
        if (forceRefresh && fetchOperationRef.current === operationId) {
          setBalanceCache((prevCache) => {
            const newCache = { ...prevCache };
            delete newCache[cacheKey];
            return newCache;
          });
        }
      } finally {
        // Only update loading state if this operation is still current
        if (fetchOperationRef.current === operationId) {
          setIsLoading(false);
        }
      }
    },
    [activeWallet?.address, foundAdapter, activeWallet?.chainId, cacheKey, hasBalanceResolver, balanceCache],
  );

  // Memoized refetch function that forces a refresh
  const refetch = useCallback(() => {
    fetchBalance(true);
  }, [fetchBalance]);

  // --- 4. EFFECT FOR INITIAL FETCH ---

  useEffect(() => {
    // Only fetch if we have all required data and no cached result
    if (cacheKey && hasBalanceResolver && !balanceCache[cacheKey]) {
      fetchBalance(false);
    } else if (!cacheKey || !hasBalanceResolver) {
      // Reset loading state if we can't fetch
      setIsLoading(false);
    }
  }, [cacheKey, hasBalanceResolver, balanceCache, fetchBalance]);

  // --- 5. CLEANUP EFFECT ---

  useEffect(() => {
    return () => {
      // Cancel any ongoing operations when component unmounts
      fetchOperationRef.current = null;
    };
  }, []);

  // --- 6. RETURNED DATA ---

  // The definitive balance is always derived from the cache based on the current key.
  const balance: NativeBalanceState = useMemo(() => {
    return cacheKey ? balanceCache[cacheKey] || null : null;
  }, [cacheKey, balanceCache]);

  // Return the fetched balance data and the loading status.
  return {
    balance, // { value: "1.5", symbol: "ETH" } or null
    isLoading,
    refetch,
  };
}
