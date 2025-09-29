import { getAvailableWallets } from './getAvailableSolanaWallets';

export const getSolanaAddressAvatar = async (name: string) => {
  const wallets = getAvailableWallets();
  const connectedWallet = wallets.filter((wallet) =>
    wallet.accounts.some((account) => account.label?.toLowerCase() === name.toLowerCase()),
  )[0];
  return connectedWallet?.accounts[0]?.icon ?? name;
};
