import { signAndSendSolanaTx } from '@tuwaio/pulsar-solana';

import { PROGRAM_ID } from '@/constants';
import { getCloseInstruction } from '@/programs';
import { BaseTxParams } from '@/transactions/index';

export function close({ client, signer, solanatest }: BaseTxParams) {
  return signAndSendSolanaTx({
    client,
    signer,
    instruction: getCloseInstruction({ payer: signer, solanatest }, { programAddress: PROGRAM_ID }),
  });
}
