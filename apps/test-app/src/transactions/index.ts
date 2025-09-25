import { Transaction } from '@tuwaio/pulsar-core';
import { Address, KeyPairSigner, SolanaClient, TransactionSendingSigner } from 'gill';

import { wagmiConfig } from '@/configs/appConfig';
import { increment } from '@/transactions/evm/increment';
import { close } from '@/transactions/solana/close';
import { decrement } from '@/transactions/solana/decrement';
import { increment as incrementSolana } from '@/transactions/solana/increment';
import { initialize } from '@/transactions/solana/initialize';

import { incrementGelato } from './evm/incrementGelato';

export type BaseTxParams = {
  client: SolanaClient;
  signer: TransactionSendingSigner;
  solanatest: Address;
};

export const txActions = {
  incrementEvm: () => increment({ wagmiConfig }),
  incrementGelato: () => incrementGelato(),
  incrementSolana: ({ client, signer, solanatest }: BaseTxParams) => incrementSolana({ client, signer, solanatest }),
  decrementSolana: ({ client, signer, solanatest }: BaseTxParams) => decrement({ client, signer, solanatest }),
  closeSolana: ({ client, signer, solanatest }: BaseTxParams) => close({ client, signer, solanatest }),
  initializeSolana: ({
    client,
    signer,
    solanatest,
  }: Omit<BaseTxParams, 'solanatest'> & { solanatest: KeyPairSigner<string> }) =>
    initialize({ client, signer, solanatest }),
};

export enum TxType {
  initialize = 'initialize',
  increment = 'increment',
  decrement = 'decrement',
  close = 'close',
}

type InitializeTx = Transaction & {
  type: TxType.initialize;
  payload: {
    account: string;
  };
};

type IncrementTx = Transaction & {
  type: TxType.increment;
  payload: {
    value: number;
  };
};

type DecrementTx = Transaction & {
  type: TxType.decrement;
  payload: {
    value: number;
  };
};

type CloseTx = Transaction & {
  type: TxType.close;
  payload: undefined;
};

export type TransactionUnion = InitializeTx | IncrementTx | DecrementTx | CloseTx;
