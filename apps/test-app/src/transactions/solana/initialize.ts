import { signAndSendSolanaTx } from '@tuwaio/pulsar-solana';
import { KeyPairSigner } from 'gill';

import { PROGRAM_ID } from '@/constants';
import { getInitializeInstruction } from '@/programs';
import { BaseTxParams } from '@/transactions';

export async function initialize({
  client,
  signer,
  contractAddress,
}: Omit<BaseTxParams, 'contractAddress'> & { contractAddress: KeyPairSigner<string> }) {
  return signAndSendSolanaTx({
    client,
    signer,
    instruction: getInitializeInstruction(
      { payer: signer, solanatest: contractAddress },
      { programAddress: PROGRAM_ID },
    ),
  });
}
