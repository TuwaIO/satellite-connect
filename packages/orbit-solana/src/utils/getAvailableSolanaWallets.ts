import { filterUniqueByKey } from '@tuwaio/orbit-core';
import { getWallets } from '@wallet-standard/app';
import { getOrCreateUiWalletForStandardWallet_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as getOrCreateUiWalletForStandardWallet } from '@wallet-standard/ui-registry';

export function getAvailableWallets() {
  return filterUniqueByKey(getWallets().get().map(getOrCreateUiWalletForStandardWallet), 'name').filter((wallet) => {
    try {
      // Check if wallet has chains property
      if (!wallet || !Array.isArray(wallet.chains)) {
        return false;
      }

      // Check if wallet has features property (features should be an array)
      if (!wallet.features || !Array.isArray(wallet.features)) {
        return false;
      }

      // Define required features for Solana wallet functionality
      const requiredFeatures = [
        'standard:connect',
        'standard:disconnect',
        'standard:events',
        'solana:signAndSendTransaction',
        'solana:signTransaction',
        'solana:signMessage',
      ] as const;

      // Check if wallet supports all required features
      const hasAllFeatures = requiredFeatures.every((requiredFeature) => {
        return wallet.features.includes(requiredFeature);
      });

      if (!hasAllFeatures) {
        return false;
      }

      // Check if all chains are Solana chains
      return wallet.chains.every((chain) => {
        try {
          if (typeof chain !== 'string') {
            return false;
          }
          const chainParts = chain.split(':');
          return chainParts.length >= 1 && chainParts[0] === 'solana';
        } catch (error) {
          console.warn('Error parsing chain:', chain, error);
          return false;
        }
      });
    } catch (error) {
      console.warn('Error filtering wallet:', error);
      return false;
    }
  });
}
