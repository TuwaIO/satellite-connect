import { signAndSendSolanaTx } from '@tuwaio/pulsar-solana';

import { PROGRAM_ID } from '@/constants';
import { getIncrementInstruction } from '@/programs';
import { BaseTxParams } from '@/transactions/index';

export function increment({ client, signer, solanatest }: BaseTxParams) {
  return signAndSendSolanaTx({
    client,
    signer,
    instruction: getIncrementInstruction({ solanatest }, { programAddress: PROGRAM_ID }),
  });
}
