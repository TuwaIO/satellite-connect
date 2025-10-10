import { textCenterEllipsis } from '@tuwaio/nova-core';
import { getAdapterFromWalletType, OrbitAdapter } from '@tuwaio/orbit-core';
import { useSatelliteConnectStore } from '@tuwaio/satellite-react';
import { useEffect, useMemo, useState } from 'react';

/**
 * @interface WalletNameAndAvatarData
 * @property {string | null} ensName The resolved name from the Name Service (e.g., ENS, like "alice.eth"), or null if not found.
 * @property {string | null} ensAvatar The URL of the avatar associated with the name, or null if not found.
 * @property {boolean} isLoading True while the name service data is being fetched.
 * @property {string | undefined} ensNameAbbreviated A truncated version of the name for display, or undefined.
 */

/**
 * A custom hook to fetch the Name Service (e.g., ENS) name and avatar
 * for the currently active wallet.
 *
 * This hook automatically detects the active wallet and its corresponding
 * adapter via the `useSatelliteConnectStore` and attempts to resolve the
 * wallet address to a human-readable name and avatar.
 *
 * @returns {WalletNameAndAvatarData} An object containing the resolved name, avatar, loading state, and an abbreviated name.
 *
 * @example
 * ```typescript
 * import { useGetWalletNameAndAvatar } from './useGetWalletNameAndAvatar';
 *
 * function DisplayWalletInfo() {
 * const { ensName, ensAvatar, isLoading, ensNameAbbreviated } = useGetWalletNameAndAvatar();
 *
 * if (isLoading) {
 * return <div>Resolving name...</div>;
 * }
 *
 * return (
 * <div className="wallet-info">
 * {ensAvatar && <img src={ensAvatar} alt="Wallet Avatar" />}
 * <p title={ensName || ''}>{ensNameAbbreviated || 'No Name Found'}</p>
 * </div>
 * );
 * }
 * ```
 */
export function useGetWalletNameAndAvatar(abbreviateSymbolises?: number) {
  // 1. Retrieve essential wallet and adapter state from the global store.
  const wallet = useSatelliteConnectStore((state) => state.activeWallet);
  const getAdapter = useSatelliteConnectStore((state) => state.getAdapter);

  // 2. Compute necessary inputs for the name resolution logic.
  const walletAddress = wallet?.address;

  // Find the actual adapter object using the key and the adapter map from the store.
  const foundAdapter = getAdapter(getAdapterFromWalletType(wallet?.walletType ?? `${OrbitAdapter.EVM}:not-connected`));

  // 3. State variables to store the resolved data and loading status.
  const [ensName, setEnsName] = useState<string | null>(null);
  const [ensAvatar, setEnsAvatar] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 4. Effect hook to perform the asynchronous name service fetching.
  useEffect(() => {
    const fetchNameData = async () => {
      // Exit condition: if address or adapter type is missing, clear data and stop loading.
      if (!walletAddress || !foundAdapter) {
        setEnsName(null);
        setEnsAvatar(null);
        setIsLoading(false);
        return;
      }

      // Check if the found adapter has the necessary resolver functions.
      const hasNameResolver = foundAdapter && 'getName' in foundAdapter && typeof foundAdapter.getName === 'function';
      const hasAvatarResolver =
        foundAdapter && 'getAvatar' in foundAdapter && typeof foundAdapter.getAvatar === 'function';

      // If the adapter doesn't support name resolution, clear data and stop loading.
      if (!hasNameResolver) {
        setEnsName(null);
        setEnsAvatar(null);
        setIsLoading(false);
        return;
      }

      // Start the loading process and reset previous state values.
      setIsLoading(true);
      setEnsName(null);
      setEnsAvatar(null);

      try {
        // Attempt to resolve the name from the wallet address.
        const name = foundAdapter?.getName ? await foundAdapter.getName(walletAddress) : null;
        if (name) {
          setEnsName(name);

          // If a name is found and avatar resolution is supported, fetch the avatar.
          if (hasAvatarResolver) {
            const avatar = foundAdapter?.getAvatar ? await foundAdapter.getAvatar(name) : null;
            setEnsAvatar(avatar);
          }
        }
      } catch (error) {
        // Log the error but ensure the state is cleared and loading is stopped.
        console.error('Failed to fetch name service data:', error);
        setEnsName(null);
        setEnsAvatar(null);
      } finally {
        // Ensure loading state is set to false regardless of success or failure.
        setIsLoading(false);
      }
    };

    fetchNameData();

    // The cleanup function is empty but kept for completeness of the useEffect signature.
    return () => {};

    // Rerun effect whenever the wallet address, adapter object, or connected adapter type changes.
  }, [walletAddress, foundAdapter]);

  // 5. Memoized computation for the abbreviated name.
  const ensNameAbbreviated = useMemo(() => {
    // If a name exists, check its length and apply center ellipsis if it exceeds 30 characters.
    return ensName
      ? ensName.length > 30
        ? textCenterEllipsis(ensName, abbreviateSymbolises ?? 12, abbreviateSymbolises ?? 12)
        : ensName
      : textCenterEllipsis(wallet?.address, abbreviateSymbolises ?? 12, abbreviateSymbolises ?? 12);
  }, [ensName, wallet?.address]); // Recalculate only when the full name changes.

  // 6. Return all state and computed values.
  return {
    ensName,
    ensAvatar,
    isLoading,
    ensNameAbbreviated,
  };
}
