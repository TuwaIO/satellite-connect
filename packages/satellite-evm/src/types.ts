import { BaseConnector } from '@tuwaio/satellite-core';
import { Connector, CreateConnectorFn } from '@wagmi/core';

/** A wagmi `Connector` from `@wagmi/core`: the wallet connectors returned by `getConnectors` of the EVM adapter. */
export type ConnectorEVM = Connector<CreateConnectorFn>;

/**
 * An EVM connection in the Satellite Connect store: `BaseConnector` from `@tuwaio/satellite-core` plus the wagmi
 * connector of the wallet. `chainId` is a numeric chain ID and `signMessage` signs with wagmi's `signMessage`.
 */
export interface EVMConnection extends BaseConnector {
  /** The wagmi connector of the connected wallet. */
  connector?: ConnectorEVM;
}
