import { getAvailableWallets } from './getAvailableSolanaWallets';

export const getSolanaAddressName = async (address: string) => {
  const wallets = getAvailableWallets();
  const connectedWallet = wallets.filter((wallet) =>
    wallet.accounts.some((account) => account.address.toLowerCase() === address.toLowerCase()),
  )[0];
  return connectedWallet?.accounts[0]?.label ?? address;
};
