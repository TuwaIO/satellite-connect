// JUST for test

'use client';

import { ReactNode } from 'react';

import { TransactionsBlockWrapper } from '@/components/evm/TransactionsBlockWrapper';
import { WalletConnectButton } from '@/components/WalletConnect/WalletConnectButton';

export const TransactionsBlockRainbowKit = ({ toggleButton }: { toggleButton: ReactNode }) => {
  return <TransactionsBlockWrapper connectWidget={<WalletConnectButton />} toggleButton={toggleButton} />;
};
