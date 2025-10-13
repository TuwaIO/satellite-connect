const WALLET_MAPPINGS = new Map([
  ['Impersonated Connector', 'impersonatedwallet'],
  ['Safe', 'safewallet'],
  ['Trust', 'trustwallet'],
  ['Trust Wallet', 'trustwallet'],
]);

export const formatWalletName = (walletName: string): string => {
  return WALLET_MAPPINGS.get(walletName) ?? walletName.replace(/\s+/g, '').toLowerCase();
};
