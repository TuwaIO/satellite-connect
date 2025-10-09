import { ConnectorEVM, EVMWallet } from '@tuwaio/satellite-evm';
import { ConnectorSolana, SolanaWallet } from '@tuwaio/satellite-solana';

/** Union type for all supported wallet types */
export type Wallet = EVMWallet | SolanaWallet;

/** Union type for all supported connector types */
export type Connector = ConnectorEVM | ConnectorSolana;
