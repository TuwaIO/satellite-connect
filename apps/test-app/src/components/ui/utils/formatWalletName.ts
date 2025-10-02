export const formatWalletName = (walletName: string) => {
  switch (walletName) {
    case 'Safe':
      return 'safewallet';
    default:
      return walletName.replace(/\s+/g, '').toLowerCase();
  }
};
