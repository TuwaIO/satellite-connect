export const formatWalletName = (walletName: string) => {
  switch (walletName) {
    case 'Impersonated Connector':
      return 'impersonatedwallet';
    case 'Safe':
      return 'safewallet';
    default:
      return walletName.replace(/\s+/g, '').toLowerCase();
  }
};
