import { OrbitAdapter } from '@tuwaio/orbit-core';

import { WalletType } from '../types';

/**
 * Extracts the adapter type from a wallet type string
 *
 * @example
 * ```typescript
 * // Returns OrbitAdapter.EVM
 * getAdapterFromWalletType('evm:metamask');
 *
 * // Returns OrbitAdapter.SOLANA
 * getAdapterFromWalletType('solana:phantom');
 *
 * // Returns OrbitAdapter.EVM (default)
 * getAdapterFromWalletType('unknown');
 * ```
 *
 * @param walletType - Wallet type in format "chain:wallet" (e.g. "evm:metamask", "solana:phantom")
 * @returns The corresponding {@link OrbitAdapter} type or EVM as default
 *
 * @remarks
 * The function splits the wallet type string by ":" and takes the first part as the adapter type.
 * If the split fails or the first part is empty, it defaults to EVM adapter.
 */
export function getAdapterFromWalletType(walletType: WalletType): OrbitAdapter {
  return (walletType.split(':')[0] ?? OrbitAdapter.EVM) as OrbitAdapter;
}
