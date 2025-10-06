import { filterUniqueByKey } from '@tuwaio/orbit-core';
import { getWallets } from '@wallet-standard/app';
import { getOrCreateUiWalletForStandardWallet_DO_NOT_USE_OR_YOU_WILL_BE_FIRED as getOrCreateUiWalletForStandardWallet } from '@wallet-standard/ui-registry';

export function getAvailableWallets() {
  return filterUniqueByKey(getWallets().get().map(getOrCreateUiWalletForStandardWallet), 'name');
}
