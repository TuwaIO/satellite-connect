import { OrbitAdapter, selectAdapterByKey } from '@tuwaio/orbit-core';
import { getAdapterFromWalletType } from '@tuwaio/satellite-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { useEffect, useState } from 'react';

/**
 * @interface NativeBalanceResult
 * Represents the native token balance returned by the adapter.
 * The value is already formatted for human readability.
 * @property {string} value The native token balance formatted to standard decimals (e.g., "1.5").
 * @property {string} symbol The symbol of the native token (e.g., "ETH").
 */
interface NativeBalanceResult {
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
 */

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
 * const { balance, isLoading } = useWalletNativeBalance();
 *
 * if (isLoading) {
 * return <p>Loading balance...</p>;
 * }
 *
 * // Display the formatted balance and symbol
 * return (
 * <p>Balance: {balance ? `${balance.value} ${balance.symbol}` : '0.00'}</p>
 * );
 * }
 * ```
 */
export function useWalletNativeBalance() {
  // --- 1. STATE & CACHE SETUP ---

  // Local cache storage. Keys combine wallet address and chain ID.
  const [balanceCache, setBalanceCache] = useState<BalanceCache>({});

  // Local loading state, managed alongside the cache check.
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Retrieve essential state from the global connection store.
  const wallet = useSatelliteConnectStore((state) => state.activeWallet);
  const getAdapter = useSatelliteConnectStore((state) => state.getAdapter);

  // --- 2. COMPUTED INPUTS ---

  const walletAddress = wallet?.address;
  // Get the current chain ID, which is crucial for caching and balance fetching.
  const currentChainId = wallet?.chainId;

  // Create the unique key for cache lookups: "address-chainId".
  const cacheKey = walletAddress && currentChainId ? `${walletAddress}-${currentChainId}` : null;

  // Identify the required adapter based on the wallet type.
  const connectedAdapter = getAdapterFromWalletType(wallet?.walletType ?? `${OrbitAdapter.EVM}:not-connected`);
  // Find the actual adapter object from the adapter map.
  const foundAdapter = selectAdapterByKey({ adapterKey: connectedAdapter, adapter: getAdapter() });

  // --- 3. EFFECT FOR FETCHING AND CACHING ---
  useEffect(() => {
    const fetchBalance = async () => {
      // Exit early if essential data is missing (not connected).
      if (!walletAddress || !connectedAdapter || !currentChainId || !cacheKey) {
        setIsLoading(false);
        return;
      }

      // 3a. CACHE CHECK: If data is already in the cache, use it immediately.
      const cachedBalance = balanceCache[cacheKey];
      if (cachedBalance) {
        setIsLoading(false);
        return;
      }

      // Check for the required 'getBalance' function on the adapter.
      const hasBalanceResolver =
        foundAdapter && 'getBalance' in foundAdapter && typeof foundAdapter.getBalance === 'function';

      if (!hasBalanceResolver) {
        setIsLoading(false);
        return;
      }

      // Start loading only if a network call is necessary.
      setIsLoading(true);

      try {
        // 3b. NETWORK FETCH: Call the adapter's method.
        // Assumes the adapter returns the balance pre-formatted.
        const balanceResult: NativeBalanceResult = await foundAdapter.getBalance(walletAddress, currentChainId);

        console.log('balanceResult', balanceResult);

        // 3c. CACHE UPDATE: Store the new result.
        setBalanceCache((prevCache) => ({
          ...prevCache,
          [cacheKey]: balanceResult,
        }));
      } catch (error) {
        console.error(`Failed to fetch native balance for ${cacheKey}:`, error);
        // On failure, loading still stops, but the cache is not polluted with null/error states.
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();

    // The effect runs when wallet/chain changes, or when the cache state itself updates
    // (to trigger a re-check in components that use this hook).
  }, [walletAddress, currentChainId, connectedAdapter, foundAdapter, cacheKey, balanceCache]);

  // --- 4. RETURNED DATA ---

  // The definitive balance is always derived from the cache based on the current key.
  const balance: NativeBalanceState = cacheKey ? balanceCache[cacheKey] || null : null;

  // Return the fetched balance data and the loading status.
  return {
    balance, // { value: "1.5", symbol: "ETH" } or null
    isLoading,
  };
}
