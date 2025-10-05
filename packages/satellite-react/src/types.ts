import { ConnectorEVM } from '@tuwaio/satellite-evm';
import { ConnectorSolana, SolanaWallet } from '@tuwaio/satellite-solana';

/** Union type for all supported wallet types */
export type Wallet = SolanaWallet;

/** Union type for all supported connector types */
export type Connector = ConnectorEVM | ConnectorSolana;
