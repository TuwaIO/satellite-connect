// JUST for test

'use client';

import { ReactNode } from 'react';

import { TransactionsBlockWrapper } from '@/components/solana/TransactionsBlockWrapper';
import { WalletConnectButton } from '@/components/WalletConnect/WalletConnectButton';

export const TransactionsBlockSolana = ({ toggleButton }: { toggleButton: ReactNode }) => {
  return <TransactionsBlockWrapper connectWidget={<WalletConnectButton />} toggleButton={toggleButton} />;
};
