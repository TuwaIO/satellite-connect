import { signAndSendSolanaTx } from '@tuwaio/pulsar-solana';

import { PROGRAM_ID } from '@/constants';
import { getDecrementInstruction } from '@/programs';
import { BaseTxParams } from '@/transactions/index';

export function decrement({ client, signer, solanatest }: BaseTxParams) {
  return signAndSendSolanaTx({
    client,
    signer,
    instruction: getDecrementInstruction({ solanatest }, { programAddress: PROGRAM_ID }),
  });
}
