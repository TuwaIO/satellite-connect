import { OrbitAdapter } from '@tuwaio/orbit-core';

import { WalletType } from '../types';

export function getAdapterFromWalletType(walletType: WalletType) {
  return (walletType.split(':')[0] ?? OrbitAdapter.EVM) as OrbitAdapter;
}
