import { Address, getBase58Decoder, SolanaClient } from 'gill';
import { getProgramAccountsDecoded } from '@/programs/getProgramAccountsDecoded';
import { getSolanatestDecoder, SOLANATEST_DISCRIMINATOR } from './solanatest/generated'

export * from './solanatest/generated'

export function getSolanatestProgramAccounts(rpc: SolanaClient['rpc'], programAddress: Address) {
  return getProgramAccountsDecoded(rpc, {
    decoder: getSolanatestDecoder(),
    filter: getBase58Decoder().decode(SOLANATEST_DISCRIMINATOR),
    programAddress: programAddress,
  })
}
