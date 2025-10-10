import { lastConnectedWalletHelpers } from '@tuwaio/orbit-core';

import { getAvailableWallets } from './getAvailableSolanaWallets';

export function getConnectedSolanaWallet() {
  const lastConnectedWallet = lastConnectedWalletHelpers.getLastConnectedWallet();
  const wallets = getAvailableWallets();
  const connectedWallet = wallets.find((w) =>
    w.accounts.find((a) => a.address.toLowerCase() === lastConnectedWallet?.address?.toLowerCase()),
  );
  if (!connectedWallet) {
    throw new Error('Wallet not provided. Cannot perform chain check.');
  }
  return connectedWallet;
}
