import { OrbitAdapter } from '@tuwaio/orbit-core';

export const networksLinks: Partial<
  Record<OrbitAdapter, { aboutNetwork: string; choseWallet: string; about: string }>
> = {
  [OrbitAdapter.EVM]: {
    aboutNetwork: 'https://ethereum.org/developers/docs/intro-to-ethereum/',
    choseWallet: 'https://ethereum.org/wallets/find-wallet/',
    about: 'https://ethereum.org/wallets/',
  },
  [OrbitAdapter.SOLANA]: {
    aboutNetwork: 'https://solana.com/en/learn/what-is-solana',
    choseWallet: 'https://solana.com/en/solana-wallets',
    about: 'https://solana.com/en/learn/what-is-a-wallet',
  },
};
