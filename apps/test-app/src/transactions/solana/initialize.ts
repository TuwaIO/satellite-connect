import { signAndSendSolanaTx } from '@tuwaio/pulsar-solana';
import { KeyPairSigner } from 'gill';

import { PROGRAM_ID } from '@/constants';
import { getInitializeInstruction } from '@/programs';
import { BaseTxParams } from '@/transactions/index';

export async function initialize({
  client,
  signer,
  solanatest,
}: Omit<BaseTxParams, 'solanatest'> & { solanatest: KeyPairSigner<string> }) {
  return signAndSendSolanaTx({
    client,
    signer,
    instruction: getInitializeInstruction({ payer: signer, solanatest }, { programAddress: PROGRAM_ID }),
  });
}
